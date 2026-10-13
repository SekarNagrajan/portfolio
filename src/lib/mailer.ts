import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * SMTP transport — server-only, module-scoped singleton.
 * Keeps the Nodemailer pool alive across repeated Server Action
 * invocations so Gmail SMTP connections are reused instead of rebuilt
 * on every form submission.
 *
 * Gmail prerequisite: enable 2-Step Verification on the Google Account,
 * then generate a 16-character App Password at
 * https://myaccount.google.com/apppasswords and set it as SMTP_PASS.
 * The regular account password will fail with `535-5.7.8`.
 */
let _mailer: Transporter | null = null;

function missing(name: string): never {
  throw new Error(
    `Missing required SMTP env var: ${name}. Copy .env.example to .env.local and populate it.`,
  );
}

export function getMailer(): Transporter {
  if (_mailer) return _mailer;

  const host = process.env.SMTP_HOST ?? missing("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = (process.env.SMTP_SECURE ?? "true") === "true";
  const user = process.env.SMTP_USER ?? missing("SMTP_USER");
  const pass = process.env.SMTP_PASS ?? missing("SMTP_PASS");

  _mailer = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
  });

  return _mailer;
}
