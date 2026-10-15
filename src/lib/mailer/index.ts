import "server-only";
import { getMailConfig } from "./config";
import { MailerError, toMailerError } from "./errors";
import { getTransport, resetTransport } from "./transport";
import type { RenderedEmail } from "./types";

export { MailerError, type MailErrorCode } from "./errors";
export { renderContactEmail } from "./templates/contact";
export { renderAutoReply } from "./templates/auto-reply";

export type { RenderedEmail } from "./types";

export type OutgoingEmail = RenderedEmail & {
  /** Defaults to CONTACT_TO — the site owner's inbox. */
  to?: string | string[];
  replyTo?: string;
};

export type SendResult =
  | { ok: true; messageId: string }
  | { ok: false; error: MailerError };

const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 500;

/**
 * Send one email. Never throws — returns a discriminated result so
 * callers (Server Actions, route handlers) handle failure explicitly.
 * Transient failures are retried once; credentials errors drop the pool
 * so a rotated password is picked up without a restart.
 */
export async function sendMail(email: OutgoingEmail): Promise<SendResult> {
  let lastError: MailerError | undefined;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const config = getMailConfig();
      const info = await getTransport().sendMail({
        from: config.from,
        to: email.to ?? config.contactTo,
        replyTo: email.replyTo,
        subject: toHeaderValue(email.subject),
        text: email.text,
        html: email.html,
      });

      return { ok: true, messageId: info.messageId };
    } catch (error) {
      lastError = toMailerError(error);

      // Log metadata only — never the message body or recipient PII.
      console.error("[mailer] send failed", {
        attempt,
        code: lastError.code,
        responseCode: lastError.responseCode,
        retryable: lastError.retryable,
      });

      if (lastError.code === "AUTH") resetTransport();
      if (!lastError.retryable || attempt === MAX_ATTEMPTS) break;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt));
    }
  }

  return { ok: false, error: lastError! };
}

/** Health check: opens a connection and authenticates without sending. */
export async function verifyMailer(): Promise<
  { ok: true } | { ok: false; error: MailerError }
> {
  try {
    await getTransport().verify();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMailerError(error) };
  }
}

/** Collapse whitespace/control chars so user input can't fold headers. */
function toHeaderValue(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, 200);
}
