"use client";

import type { ComponentType } from "react";
import { SpotlightCard } from "@/components/motion/Effects";
import { GlassChip, GlassIconBadge } from "@/components/ui/glass";
import {
  CodeIcon,
  DatabaseIcon,
  ServerIcon,
  ShieldIcon,
  SparklesIcon,
  ZapIcon,
  type AnimatedIconProps,
} from "@/components/icons/AnimatedIcons";
import { cn } from "@/lib/utils";

type Capability = {
  title: string;
  body: string;
  icon: ComponentType<AnimatedIconProps>;
  tags: readonly string[];
  span: string;
};

const CAPABILITIES: readonly Capability[] = [
  {
    title: "Frontend architecture",
    body: "App shells, RBAC with module gating, and reusable DataTable / transaction UI across 40+ lazy-loaded enterprise screens.",
    icon: CodeIcon,
    tags: ["React 19", "TanStack Router", "React Query", "AG Grid"],
    span: "md:col-span-2 xl:col-span-4",
  },
  {
    title: "Backend services",
    body: "Spring Boot services on Java 21 over multi-datasource SQL Server.",
    icon: ServerIcon,
    tags: ["Spring Boot 4", "JPA", "REST"],
    span: "xl:col-span-2",
  },
  {
    title: "AI in the workflow",
    body: "Voice-to-Text, Image-to-Lead, and NL→SQL chatbots integrated into existing product flows.",
    icon: SparklesIcon,
    tags: ["OpenAI", "Cloud Vision", "N8N"],
    span: "xl:col-span-2",
  },
  {
    title: "Data & integration",
    body: "Stored procedures, indexing, EDI batch pipelines, and document OCR at operational scale.",
    icon: DatabaseIcon,
    tags: ["SQL Server", "EDI", "Redis"],
    span: "xl:col-span-2",
  },
  {
    title: "Security & tenancy",
    body: "Per-tenant branding, LDAP / JWT auth, and agency-level isolation.",
    icon: ShieldIcon,
    tags: ["RBAC", "JWT", "LDAP"],
    span: "xl:col-span-2",
  },
  {
    title: "Performance & craft",
    body: "Core Web Vitals budgets, compositor-friendly motion, keyboard-first accessibility, and progressive enhancement by default.",
    icon: ZapIcon,
    tags: ["CWV", "a11y", "Motion"],
    span: "md:col-span-2 xl:col-span-6",
  },
];

export function Capabilities() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
      {CAPABILITIES.map(({ title, body, icon: Icon, tags, span }, i) => (
        <SpotlightCard key={title} index={i} className={cn("flex flex-col justify-between gap-8 p-7 sm:p-8", span)}>
          <div className="flex items-start gap-5">
            <GlassIconBadge size="md">
              <Icon size={26} strokeWidth={1.75} />
            </GlassIconBadge>
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <li key={t}>
                <GlassChip size="sm">{t}</GlassChip>
              </li>
            ))}
          </ul>
        </SpotlightCard>
      ))}
    </div>
  );
}
