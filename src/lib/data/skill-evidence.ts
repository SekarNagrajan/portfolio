import { skillGroups, type SkillGroup } from "@/lib/data/skills";
import { projects, type Project } from "@/lib/data/projects";
import { experiences } from "@/lib/data/experiences";

/**
 * Links each resume skill to the shipped products whose tech stack
 * names it — so the skills page shows evidence, never self-rated
 * proficiency. Matching is by technology family ("React 19" ↔ "React 18"),
 * and every hit keeps the project's own label so the exact version shows.
 */

/** Resume names whose family key isn't just "drop the version number". */
const ALIASES: Record<string, string> = {
  "OpenAI API": "openai",
  "N8N Workflow Engine": "n8n",
  "OpenAPI / Swagger": "openapi",
  "JPA / Hibernate": "jpa",
  "Nx Monorepo": "nx",
  "React Query": "react query",
  "RTK Query": "redux toolkit",
};

export function skillKey(name: string): string {
  return (ALIASES[name] ?? name.replace(/\s+\d+(\.\d+)?$/, "")).trim().toLowerCase();
}

/**
 * Skills the write-ups describe in prose rather than list in the stack.
 * Each keyword must appear in the project's description or highlights.
 */
const KEYWORDS: Record<string, readonly string[]> = {
  "AI Chatbots": ["chatbot"],
  "Multi-Tenant Architecture": ["multi-tenant"],
  "Multi-Datasource Architecture": ["datasources"],
  "Document Processing": ["ocr"],
  "Enterprise Design Systems": ["design system"],
  "OpenAPI / Swagger": ["openapi"],
  "REST APIs": ["rest api"],
  "Batch Processing": ["batch"],
  "Spring Security": ["spring security"],
};

export type Evidence = {
  project: Project;
  /** How the project itself names the technology, e.g. "React 18". */
  as: string;
  /** "stack" = listed in the tech stack; "described" = named in the write-up. */
  kind: "stack" | "described";
};

export type SkillInfo = {
  name: string;
  group: SkillGroup;
  evidence: readonly Evidence[];
  /** Named in the current role's technology list. */
  atCurrentRole: boolean;
};

const currentTech = new Set(experiences[0]?.technologies.map(skillKey) ?? []);

export const skills: readonly SkillInfo[] = skillGroups.flatMap((group) =>
  group.items.map((name) => {
    const key = skillKey(name);
    const evidence = projects.flatMap((project): Evidence[] => {
      const hit = project.techStack.find((t) => skillKey(t) === key);
      if (hit) return [{ project, as: hit, kind: "stack" }];
      const text = [project.description, ...project.highlights].join(" ").toLowerCase();
      const word = KEYWORDS[name]?.find((k) => text.includes(k));
      return word ? [{ project, as: word, kind: "described" }] : [];
    });
    return { name, group, evidence, atCurrentRole: currentTech.has(key) };
  }),
);

export const skillByName = new Map(skills.map((s) => [s.name, s]));

/** Skills that share the most products with `skill`, strongest first. */
export function pairedWith(skill: SkillInfo, limit = 6): SkillInfo[] {
  const mine = new Set(skill.evidence.map((e) => e.project.id));
  if (mine.size === 0) return [];
  return skills
    .filter((s) => s.name !== skill.name && skillKey(s.name) !== skillKey(skill.name))
    .map((s) => ({ s, shared: s.evidence.filter((e) => mine.has(e.project.id)).length }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map((x) => x.s);
}

export const stackCount = (s: SkillInfo) => s.evidence.filter((e) => e.kind === "stack").length;

/** Tools listed in the most product stacks, one per technology family. */
export function dailyDrivers(limit = 6): SkillInfo[] {
  const seen = new Set<string>();
  return [...skills]
    .sort((a, b) => stackCount(b) - stackCount(a))
    .filter((s) => {
      const k = skillKey(s.name);
      if (seen.has(k) || stackCount(s) === 0) return false;
      seen.add(k);
      return true;
    })
    .slice(0, limit);
}

export const productsWithEvidence = new Set(skills.flatMap((s) => s.evidence.map((e) => e.project.id))).size;
