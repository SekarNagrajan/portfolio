/**
 * Normalised mail failure. Callers branch on `code` / `retryable`
 * instead of parsing Nodemailer's string codes and SMTP reply numbers.
 */
export type MailErrorCode =
  | "CONFIG" // env vars missing or malformed
  | "AUTH" // credentials rejected (e.g. Gmail 535-5.7.8)
  | "CONNECTION" // DNS, TLS, or socket failure reaching the server
  | "TIMEOUT" // server too slow to greet / respond
  | "REJECTED" // server refused the envelope or message
  | "UNKNOWN";

export class MailerError extends Error {
  readonly code: MailErrorCode;
  readonly retryable: boolean;
  /** SMTP reply code, when the server sent one. */
  readonly responseCode?: number;

  constructor(
    code: MailErrorCode,
    message: string,
    options: { cause?: unknown; responseCode?: number } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "MailerError";
    this.code = code;
    this.responseCode = options.responseCode;
    // 4xx SMTP replies are transient by spec; network blips usually are too.
    this.retryable =
      code === "CONNECTION" ||
      code === "TIMEOUT" ||
      (options.responseCode !== undefined &&
        options.responseCode >= 400 &&
        options.responseCode < 500);
  }
}

type NodemailerLikeError = Error & { code?: string; responseCode?: number };

export function toMailerError(error: unknown): MailerError {
  if (error instanceof MailerError) return error;

  const err = (error instanceof Error ? error : new Error(String(error))) as NodemailerLikeError;
  const opts = { cause: error, responseCode: err.responseCode };

  switch (err.code) {
    case "EAUTH":
      return new MailerError("AUTH", "SMTP authentication failed.", opts);
    case "ETIMEDOUT":
      return new MailerError("TIMEOUT", "SMTP server timed out.", opts);
    case "ECONNECTION":
    case "ESOCKET":
    case "EDNS":
    case "ETLS":
      return new MailerError("CONNECTION", "Could not reach SMTP server.", opts);
    case "EENVELOPE":
    case "EMESSAGE":
      return new MailerError("REJECTED", "SMTP server rejected the message.", opts);
    default:
      return new MailerError("UNKNOWN", err.message || "Unknown mail error.", opts);
  }
}
