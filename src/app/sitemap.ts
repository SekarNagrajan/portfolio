import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { caseStudies } from "@/lib/data/case-studies";

const routes = [
  "",
  "/about",
  "/skills",
  "/projects",
  "/experience",
  "/resume",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = routes.map((path) => ({
    url: new URL(path || "/", SITE_URL).toString(),
    lastModified: now,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }));
  const studies = caseStudies.map((c) => ({
    url: new URL(`/projects/${c.slug}`, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...pages, ...studies];
}
