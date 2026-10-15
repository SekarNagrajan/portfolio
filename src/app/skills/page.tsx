import { SkillsExperience } from "@/components/features/skills/SkillsExperience";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Skills",
  description:
    "A technical matrix of my core languages, frontend, backend, AI, data, and tooling competencies, each linked to the shipped products where it was used.",
  path: "/skills",
});

export default function SkillsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Skills", path: "/skills" }])} />
      <SkillsExperience />
    </>
  );
}
