import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Geist SemiBold/Bold TTFs for next/og (Satori can't read woff2, and the
 * bundled default font is regular-weight only). Geist © Vercel, SIL OFL 1.1
 * — see src/assets/fonts/Geist-LICENSE.txt.
 */
let cached: Promise<{ name: string; data: Buffer; weight: 600 | 700; style: "normal" }[]> | null = null;

export function ogFonts() {
  cached ??= Promise.all(
    ([["Geist-SemiBold.ttf", 600], ["Geist-Bold.ttf", 700]] as const).map(async ([file, weight]) => ({
      name: "Geist",
      data: await readFile(join(process.cwd(), "src/assets/fonts", file)),
      weight,
      style: "normal" as const,
    })),
  );
  return cached;
}
