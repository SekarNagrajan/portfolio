import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

/**
 * Dynamic OG image endpoint — rendered with JSX + inline CSS by
 * `next/og`'s ImageResponse. Called by every page's metadata builder
 * so a social share preview is generated on demand.
 *
 * Note: we don't pin `runtime = "edge"` because Next 16's Cache
 * Components feature is incompatible with explicit route-segment
 * runtime config. The default Node runtime renders this just fine.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title =
    searchParams.get("title") ??
    "Sekar Nagarajan — Full-Stack Software Engineer";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0b",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(96, 165, 250, 0.18), transparent 55%), radial-gradient(circle at 10% 90%, rgba(129, 140, 248, 0.14), transparent 50%)",
          padding: "72px",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            color: "#a1a1aa",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: "#60a5fa",
            }}
          />
          sekarnagarajan.dev
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 1.05,
              maxWidth: 1050,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a1a1aa",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            React 19 · Spring Boot 4 · Java 21 · Multi-Tenant Architecture
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            fontSize: 20,
            color: "#71717a",
          }}
        >
          <div style={{ display: "flex" }}>
            Sekar Nagarajan · Full-Stack Software Engineer
          </div>
          <div style={{ display: "flex" }}>github.com/SekarNagarajan07</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
