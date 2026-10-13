"use server";

import { ContactSchema } from "@/lib/schemas/contact";
import { getMailer } from "@/lib/mailer";

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

  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO;
  if (!from || !to) {
    return {
      success: false,
      message:
        "Email transport is not configured on the server. Please try again later.",
      inputs: echo,
    };
  }

  try {
    const mailer = getMailer();
    const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;">
      <h2 style="margin:0 0 12px;">New portfolio inquiry</h2>
      <p style="margin:0 0 4px;"><strong>From:</strong> ${escapeHtml(parsed.data.name)} &lt;${escapeHtml(parsed.data.email)}&gt;</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;"/>
      <p style="white-space:pre-wrap;margin:0;">${escapeHtml(parsed.data.message)}</p>
    </body></html>`;

    await mailer.sendMail({
      from: `"Portfolio Contact" <${from}>`,
      to,
      replyTo: parsed.data.email,
      subject: `Portfolio inquiry from ${parsed.data.name}`,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
      html,
    });

    return {
      success: true,
      message: "Thanks — your message has been transmitted successfully.",
    };
  } catch (error) {
    console.error("[submitContact] mailer error:", error);
    return {
      success: false,
      message:
        "Server encountered an error sending your message. Please try again later or reach me on LinkedIn.",
      inputs: echo,
    };
  }
}

/**
 * Minimal HTML escaper for user-provided content embedded in the
 * outbound email body. We never render this HTML in the browser.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
