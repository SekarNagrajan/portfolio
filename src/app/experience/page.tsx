import { Section, SectionHeader } from "@/components/features/Section";
import { TimelineItem } from "@/components/features/TimelineItem";
import { experiences } from "@/lib/data/experiences";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Experience",
  description:
    "Professional timeline — Software Engineer at Solverminds Solutions and Technologies, shipping multi-tenant maritime platforms.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <Section id="experience">
      <SectionHeader
        eyebrow="Experience"
        title="Shipping enterprise software for maritime operators."
        description="Chronological record of roles, responsibilities, and the systems I've shipped — framed in the real operational domains they serve."
      />

      <ol
        aria-label="Professional experience timeline"
        className="relative"
      >
        {experiences.map((exp) => (
          <TimelineItem key={exp.id} exp={exp} />
        ))}
      </ol>
    </Section>
  );
}
