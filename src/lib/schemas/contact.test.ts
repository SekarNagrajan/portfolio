import { describe, expect, it } from "vitest";
import { ContactSchema } from "./contact";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello, I would like to talk about a role.",
  honeypot: "",
};

describe("ContactSchema", () => {
  it("accepts a complete inquiry", () => {
    expect(ContactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a short name, a bad email, and a short message", () => {
    const parsed = ContactSchema.safeParse({
      name: "A",
      email: "not-an-email",
      message: "short",
      honeypot: "",
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      expect(fields.name?.length).toBeGreaterThan(0);
      expect(fields.email?.length).toBeGreaterThan(0);
      expect(fields.message?.length).toBeGreaterThan(0);
    }
  });

  it("rejects a filled honeypot", () => {
    expect(ContactSchema.safeParse({ ...valid, honeypot: "bot" }).success).toBe(false);
  });
});
