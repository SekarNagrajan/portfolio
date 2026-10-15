import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { getMailConfig } from "./config";

export type SmtpTransporter = Transporter<SMTPTransport.SentMessageInfo>;

/**
 * Pooled SMTP transport — one per server process. Stored on `globalThis`
 * so `next dev` hot reloads reuse the pool instead of leaking a new set
 * of sockets on every edit; in production this is a plain singleton.
 */
const globalForMailer = globalThis as typeof globalThis & {
  __smtpTransport?: SmtpTransporter;
};

export function getTransport(): SmtpTransporter {
  if (globalForMailer.__smtpTransport) return globalForMailer.__smtpTransport;

  const { smtp } = getMailConfig();

  const transport = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    // On non-465 ports, refuse to send credentials over plaintext.
    requireTLS: !smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
    tls: { minVersion: "TLSv1.2" },

    pool: true,
    maxConnections: 3,
    maxMessages: 50,

    // Nodemailer's defaults (2 min / 30 s / 10 min) would hang a Server
    // Action far past any reasonable request budget.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  globalForMailer.__smtpTransport = transport;
  return transport;
}

/** Drop the pooled transport, e.g. after an auth failure or on shutdown. */
export function resetTransport(): void {
  globalForMailer.__smtpTransport?.close();
  globalForMailer.__smtpTransport = undefined;
}
