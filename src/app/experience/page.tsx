import { HeaderArt } from "@/components/features/HeaderArt";
import { PageHeader, Section } from "@/components/features/Section";
import { Timeline } from "@/components/features/Timeline";
import { BriefcaseIcon } from "@/components/icons/AnimatedIcons";
import { experiences } from "@/lib/data/experiences";
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
      <PageHeader
        art={<HeaderArt variant="experience" />}
        eyebrow="Experience"
        icon={<BriefcaseIcon size={14} trigger="self" />}
        title={
          <>
            Shipping enterprise software for <span className="text-gradient">maritime operators</span>.
          </>
        }
        description="Chronological record of roles, responsibilities, and the systems I've shipped — framed in the real operational domains they serve."
      />

      <Section id="experience">
        <Timeline items={experiences} />
      </Section>
    </>
  );
}
