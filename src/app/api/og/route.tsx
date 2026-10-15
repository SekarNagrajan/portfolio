import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { brand } from "@/lib/brand";
import { profile } from "@/lib/data/profile";
import { ogFonts } from "@/lib/og-fonts";

/**
 * Dynamic OG image endpoint — rendered with JSX + inline CSS by
 * `next/og`'s ImageResponse. Called by every page's metadata builder
 * (`/api/og?title=…`) so each route gets its own share preview.
 *
 * Note: we don't pin `runtime = "edge"` because Next 16's Cache
 * Components feature is incompatible with explicit route-segment
 * runtime config. The default Node runtime renders this just fine.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? `${profile.name} — ${profile.title}`).slice(0, 120);
  const glow = `${brand.accent}33`; // ~20% alpha
  const gridLine = "rgba(255,255,255,0.05)";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: brand.background,
          backgroundImage: `radial-gradient(circle at 80% 0%, ${glow}, transparent 55%), linear-gradient(to right, ${gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 56px 56px, 56px 56px",
          padding: "72px 80px",
          color: brand.foreground,
          fontFamily: "Geist",
        }}
      >
        {/* Top row: mark + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `linear-gradient(135deg, ${brand.accent}, ${brand.accent}99)`,
              color: brand.accentForeground,
              fontSize: 28,
              fontWeight: 700,
              boxShadow: `0 0 60px ${brand.accent}66`,
            }}
          >
            SN
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{profile.name}</div>
            <div style={{ fontSize: 20, color: brand.muted }}>{profile.title}</div>
          </div>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ width: 96, height: 6, borderRadius: 999, backgroundColor: brand.accentBright }} />
          <div
            style={{
              fontSize: title.length > 48 ? 64 : 80,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 1.04,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: brand.muted,
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            {["React 19", "Spring Boot 4", "Java 21", "Multi-tenant SaaS"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: `1px solid ${brand.border}`,
                  backgroundColor: brand.card,
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: brand.accentBright }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: brand.accentBright }} />
            {profile.location}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: await ogFonts() },
  );
}
