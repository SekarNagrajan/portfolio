import type { ContactInput } from "@/lib/schemas/contact";
import type { RenderedEmail } from "../types";

/** Notification sent to the site owner for each contact-form submission. */
export function renderContactEmail({
  name,
  email,
  message,
}: Pick<ContactInput, "name" | "email" | "message">): RenderedEmail {
  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;">
      <h2 style="margin:0 0 12px;">New portfolio inquiry</h2>
      <p style="margin:0 0 4px;"><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;"/>
      <p style="white-space:pre-wrap;margin:0;">${escapeHtml(message)}</p>
    </body></html>`;

  return {
    subject: `Portfolio inquiry from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html,
  };
}

/**
 * Minimal HTML escaper for user-provided content embedded in the
 * outbound email body. We never render this HTML in the browser.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
