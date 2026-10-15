import { ExperienceView } from "@/components/features/experience/ExperienceView";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Experience",
  description:
    "Professional timeline — Software Engineer at Solverminds Solutions and Technologies, shipping multi-tenant maritime platforms.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Experience", path: "/experience" }])} />
      <ExperienceView />
    </>
  );
}
