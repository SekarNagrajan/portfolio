"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { ContactSchema } from "@/lib/schemas/contact";
import { renderAutoReply, renderContactEmail, sendMail } from "@/lib/mailer";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/** Valid submissions allowed per client IP per window. */
const CONTACT_LIMIT = { limit: 3, windowMs: 10 * 60 * 1000 } as const;
/** Auto-replies per recipient address — stops the form being used to mail-bomb a third party. */
const AUTO_REPLY_LIMIT = { limit: 1, windowMs: 24 * 60 * 60 * 1000 } as const;

export type ContactState = {
  success?: boolean;
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string[]>>;
  /**
   * Submitted values echoed back on failure so the form repopulates
   * even when JavaScript is disabled (progressive enhancement).
   */
  inputs?: {
    name?: string;
    email?: string;
    message?: string;
  };
};

/**
 * React 19 Server Action — used via `useActionState` on the client leaf.
 * Runs entirely server-side; the compiled HTTP endpoint is encrypted
 * and non-deterministic between builds, which blocks replay abuse.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot — any value here means we're talking to a bot. Pretend we
  // succeeded so the attacker gets no useful signal.
  const honeypot = formData.get("honeypot");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return {
      success: true,
      message: "Your message has been transmitted successfully.",
    };
  }

  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  const parsed = ContactSchema.safeParse({
    name,
    email,
    message,
    honeypot: honeypot ?? "",
  });

  const echo = {
    name: typeof name === "string" ? name : "",
    email: typeof email === "string" ? email : "",
    message: typeof message === "string" ? message : "",
  };

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      success: false,
      message: "Please fix the highlighted fields and try again.",
      errors: flat.fieldErrors as ContactState["errors"],
      inputs: echo,
    };
  }

  // Throttle after validation so typo-fix resubmits don't count, but
  // before SMTP so floods can't burn the Gmail sending quota.
  const limited = rateLimit(`contact:${clientIp(await headers())}`, CONTACT_LIMIT);
  if (!limited.ok) {
    const minutes = Math.max(1, Math.ceil(limited.retryAfterSeconds / 60));
    return {
      success: false,
      message: `You've sent a few messages already — please wait about ${minutes} minute${minutes === 1 ? "" : "s"} before trying again, or reach me on LinkedIn.`,
      inputs: echo,
    };
  }

  const result = await sendMail({
    ...renderContactEmail(parsed.data),
    replyTo: parsed.data.email,
  });

  if (!result.ok) {
    return {
      success: false,
      message:
        result.error.code === "CONFIG"
          ? "Email transport is not configured on the server. Please try again later."
          : "Server encountered an error sending your message. Please try again later or reach me on LinkedIn.",
      inputs: echo,
    };
  }

  // Confirmation to the sender runs after the response is sent, so it
  // never delays the form or turns a delivered message into an error.
  const { email: senderEmail, name: senderName, message: senderMessage } = parsed.data;
  after(async () => {
    if (!rateLimit(`auto-reply:${senderEmail.toLowerCase()}`, AUTO_REPLY_LIMIT).ok) return;
    const reply = await sendMail({
      ...renderAutoReply({ name: senderName, message: senderMessage }),
      to: senderEmail,
    });
    if (!reply.ok) console.warn("[submitContact] auto-reply failed", { code: reply.error.code });
  });

  return {
    success: true,
    message: "Thanks — your message has been transmitted successfully. A confirmation is on its way to your inbox.",
  };
}
