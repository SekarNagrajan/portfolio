import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";
import { ogFonts } from "@/lib/og-fonts";

/**
 * "SN" monogram tile rendered to PNG — shared by app/icon.tsx,
 * app/apple-icon.tsx, and the manifest icon routes.
 */
export async function renderBrandMark(size: number, { rounded = true }: { rounded?: boolean } = {}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: rounded ? size * 0.22 : 0,
          backgroundColor: brand.background,
          backgroundImage: `linear-gradient(135deg, ${brand.accent}, ${brand.accent}8c)`,
          color: brand.background,
          fontSize: size * 0.42,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          fontFamily: "Geist",
        }}
      >
        SN
      </div>
    ),
    { width: size, height: size, fonts: await ogFonts() },
  );
}
