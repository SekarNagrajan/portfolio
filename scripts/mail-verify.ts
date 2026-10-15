import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { verifyMailer } from "../src/lib/mailer";

/**
 * Load KEY=VALUE lines without overriding variables already in the environment.
 * Next does this for the app; this script runs outside `next dev`.
 */
function loadEnvFile(filename: string) {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

async function main() {
  loadEnvFile(".env");
  loadEnvFile(".env.local");

  const result = await verifyMailer();

  if (result.ok) {
    console.log("mail: ok");
    return;
  }

  console.error(`mail: ${result.error.code}`);
  if (result.error.code === "CONFIG") {
    console.error(
      "SMTP is not configured. Copy .env.example to .env.local and set SMTP_USER, SMTP_PASS, CONTACT_FROM, and CONTACT_TO.",
    );
  }
  process.exitCode = 1;
}

void main();
