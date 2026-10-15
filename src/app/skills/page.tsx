import { HeaderArt } from "@/components/features/HeaderArt";
import { PageHeader, Section } from "@/components/features/Section";
import { SkillGroupCard } from "@/components/features/SkillGroupCard";
import { SparklesIcon } from "@/components/icons/AnimatedIcons";
import { skillGroups } from "@/lib/data/skills";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Skills",
  description:
    "A technical matrix of my core languages, frontend, backend, AI, data, and tooling competencies.",
  path: "/skills",
});

/** Bento spans on a 6-col grid so the matrix fills wide screens. */
const SPANS: Record<string, string> = {
  languages: "xl:col-span-2",
  frontend: "xl:col-span-4",
  backend: "xl:col-span-3",
  ai: "xl:col-span-3",
  database: "xl:col-span-3",
  tools: "xl:col-span-3",
};

export default function SkillsPage() {
  const total = skillGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Skills", path: "/skills" }])} />
      <PageHeader
        art={<HeaderArt variant="skills" />}
        eyebrow="Skills"
        icon={<SparklesIcon size={14} trigger="self" />}
        title={
          <>
            A <span className="text-gradient">production-tested</span> technical matrix.
          </>
        }
        description="Grouped by layer so recruiters, engineering managers, and clients can scan quickly. All items reflect production usage across enterprise platforms, not tutorial-level exposure."
        aside={
          <div className="glass rounded-2xl px-6 py-4 text-right">
            <p className="text-4xl font-semibold tracking-tight text-gradient">{total}</p>
            <p className="text-xs text-muted-foreground">skills across {skillGroups.length} layers</p>
          </div>
        }
      />

      <Section id="skills">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">
          {skillGroups.map((group, i) => (
            <SkillGroupCard key={group.id} group={group} index={i} className={SPANS[group.id]} />
          ))}
        </div>
      </Section>
    </>
  );
}
