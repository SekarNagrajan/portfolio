"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { SpotlightCard } from "@/components/motion/Effects";
import { GlassChip, GlassIconBadge } from "@/components/ui/glass";
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
  GithubIcon,
  GlobeIcon,
  LayersIcon,
  ShieldIcon,
  SparklesIcon,
  type AnimatedIconProps,
} from "@/components/icons/AnimatedIcons";
import type { Project } from "@/lib/data/projects";
import { cn } from "@/lib/utils";

const PROJECT_ICONS: Record<string, ComponentType<AnimatedIconProps>> = {
  crm: SparklesIcon,
  anchor: GlobeIcon,
  "pams-ecommerce": LayersIcon,
  "pams-legacy": ShieldIcon,
};

/**
 * Project card — spotlight surface with a draw-in domain icon, numbered
 * index, highlight checklist, and tech chips. Hovering anywhere on the
 * card animates every icon inside it.
 */
export function ProjectCard({
  project,
  index = 0,
  compact = false,
}: {
  project: Project;
  index?: number;
  compact?: boolean;
}) {
  const Icon = PROJECT_ICONS[project.id] ?? LayersIcon;
  const highlights = project.highlights.slice(0, compact ? 3 : 5);

  return (
    <SpotlightCard as="article" index={index} className="flex h-full flex-col p-7 sm:p-8">
      <header className="flex items-start justify-between gap-6">
        <GlassIconBadge size="md" className="shadow-glass">
          <Icon size={26} strokeWidth={1.75} />
        </GlassIconBadge>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-muted-foreground/70">{String(index + 1).padStart(2, "0")}</span>
          <span className="grid size-10 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors group-hover:border-accent/60 group-hover:bg-accent group-hover:text-accent-foreground">
            <ArrowUpRightIcon size={16} />
          </span>
        </div>
      </header>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{project.domain}</p>
        <h3 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-foreground xl:text-[1.65rem]">
          {/* Stretched link: the title is the accessible link; ::after covers the card. */}
          <Link
            href={`/projects/${project.id}`}
            data-track="case_study_open"
            data-track-label={project.id}
            className="outline-none after:absolute after:inset-0 after:z-0 after:rounded-[inherit] after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{project.period}</p>
      </div>

      <p className="mt-5 text-pretty text-base leading-relaxed text-foreground/85">{project.tagline}</p>
      {!compact && (
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{project.description}</p>
      )}

      <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm text-muted-foreground">
        {highlights.map((h) => (
          <li key={h} className="flex gap-3">
            <CheckCircleIcon size={16} className="mt-0.5 text-accent" />
            <span className="leading-relaxed">{h}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-7 flex flex-wrap gap-1.5 border-t border-border/60 pt-5">
        {project.techStack.map((t) => (
          <li key={t}>
            <GlassChip size="md" className="transition-colors group-hover:border-border">
              {t}
            </GlassChip>
          </li>
        ))}
      </ul>

      <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
        Read the case study
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </p>

      {(project.githubUrl || project.liveUrl) && (
        <div className="relative z-10 mt-6 flex items-center gap-4">
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground")}
            >
              <GithubIcon size={16} /> Source
            </Link>
          )}
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowUpRightIcon size={16} /> Live demo
            </Link>
          )}
        </div>
      )}
    </SpotlightCard>
  );
}
