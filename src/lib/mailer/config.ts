import "server-only";
import { z } from "zod";
import { MailerError } from "./errors";

/**
 * Environment contract for outbound mail. Validated once, on first use,
 * so a misconfigured deploy fails loudly with every problem listed
 * instead of one `undefined` at a time.
 *
 * Gmail prerequisite: enable 2-Step Verification on the Google Account,
 * then generate a 16-character App Password at
 * https://myaccount.google.com/apppasswords and set it as SMTP_PASS.
 * The regular account password will fail with `535-5.7.8`.
 */
const MailEnvSchema = z.object({
  SMTP_HOST: z.string().trim().min(1),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(465),
  /** Implicit TLS. Defaults to `true` on port 465, STARTTLS otherwise. */
  SMTP_SECURE: z.stringbool().optional(),
  SMTP_USER: z.string().trim().min(1),
  // Google displays App Passwords in groups of four ("abcd efgh ...");
  // strip the spaces so a straight copy-paste works.
  SMTP_PASS: z
    .string()
    .min(1)
    .transform((value) => value.replace(/\s+/g, "")),
  /** Envelope sender. Must be an address the SMTP account may send as. */
  CONTACT_FROM: z.email(),
  /** Inbox that receives contact-form submissions. */
  CONTACT_TO: z.email(),
  CONTACT_FROM_NAME: z.string().trim().min(1).default("Portfolio Contact"),
});

export type MailConfig = {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
  from: { name: string; address: string };
  contactTo: string;
};

let cached: MailConfig | null = null;

export function getMailConfig(): MailConfig {
  if (cached) return cached;

  const parsed = MailEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => i.path.join(".")))];
    throw new MailerError(
      "CONFIG",
      `Invalid or missing mail env vars: ${fields.join(", ")}. ` +
        "Copy .env.example to .env.local and populate it.",
    );
  }

  const env = parsed.data;
  cached = {
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE ?? env.SMTP_PORT === 465,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    from: { name: env.CONTACT_FROM_NAME, address: env.CONTACT_FROM },
    contactTo: env.CONTACT_TO,
  };
  return cached;
}
