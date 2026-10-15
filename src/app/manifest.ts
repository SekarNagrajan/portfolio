import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
import { profile } from "@/lib/data/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — ${profile.title}`,
    short_name: profile.firstName,
    description: profile.summary,
    start_url: "/",
    display: "standalone",
    background_color: brand.background,
    theme_color: brand.background,
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
