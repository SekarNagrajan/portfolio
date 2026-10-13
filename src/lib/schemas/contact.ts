import { z } from "zod";

/**
 * Server-boundary validation for the contact form.
 * Keep max lengths tight so a malicious actor can't abuse SMTP egress.
 */
export const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(200, "Email is too long."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters long.")
    .max(5000, "Message is too long."),
  /** Hidden field — bots fill it, humans don't. */
  honeypot: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;
