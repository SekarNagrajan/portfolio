import type { ContactInput } from "@/lib/schemas/contact";
import { profile } from "@/lib/data/profile";
import type { RenderedEmail } from "../types";
import { escapeHtml } from "./contact";

/** Confirmation sent back to the person who submitted the contact form. */
export function renderAutoReply({ name, message }: Pick<ContactInput, "name" | "message">): RenderedEmail {
  const firstName = name.split(/\s+/)[0] ?? name;
  const excerpt = message.length > 600 ? `${message.slice(0, 600)}…` : message;

  const text = [
    `Hi ${firstName},`,
    "",
    "Thanks for reaching out — your message landed safely in my inbox. I usually reply within one working day.",
    "",
    "For reference, here's what you sent:",
    "",
    excerpt
      .split("\n")
      .map((l) => `> ${l}`)
      .join("\n"),
    "",
    "Best,",
    profile.name,
    profile.title,
    profile.socials.linkedin,
  ].join("\n");

  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;line-height:1.6;color:#111;max-width:560px;">
      <p>Hi ${escapeHtml(firstName)},</p>
      <p>Thanks for reaching out — your message landed safely in my inbox. I usually reply within one working day.</p>
      <p style="margin:20px 0 6px;color:#555;font-size:13px;">For reference, here's what you sent:</p>
      <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #22b8d8;background:#f5fafc;white-space:pre-wrap;">${escapeHtml(excerpt)}</blockquote>
      <p style="margin-top:24px;">Best,<br/><strong>${escapeHtml(profile.name)}</strong><br/>
      <span style="color:#555;">${escapeHtml(profile.title)}</span><br/>
      <a href="${profile.socials.linkedin}" style="color:#0e7fa0;">LinkedIn</a></p>
      <p style="margin-top:24px;color:#999;font-size:12px;">This is an automatic confirmation — no need to reply to it.</p>
    </body></html>`;

  return { subject: `Thanks for your message, ${firstName}`, text, html };
}
