import { Section, SectionHeader } from "@/components/features/Section";
import { SkillGroupList } from "@/components/features/SkillGroupList";
import { skillGroups } from "@/lib/data/skills";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Skills",
  description:
    "A technical matrix of my core languages, frontend, backend, AI, data, and tooling competencies.",
  path: "/skills",
});

export default function SkillsPage() {
  return (
    <Section id="skills">
      <SectionHeader
        eyebrow="Skills"
        title="Technical matrix."
        description="Grouped by layer so recruiters, engineering managers, and clients can scan quickly. All items reflect production usage across enterprise platforms, not tutorial-level exposure."
      />

      <div className="space-y-14">
        {skillGroups.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`group-${group.id}`}
            className="rounded-xl border border-border/70 bg-card/50 p-6 shadow-sm sm:p-8"
          >
            <div className="mb-6 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
              <h3
                id={`group-${group.id}`}
                className="text-xl font-semibold tracking-tight text-foreground"
              >
                {group.label}
              </h3>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                {group.description}
              </p>
            </div>
            <SkillGroupList items={group.items} />
          </section>
        ))}
      </div>
    </Section>
  );
}
