"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { Badge } from "@/components/ui/badge";
import { fadeUp, spring } from "@/lib/motion";
import type { Project } from "@/lib/data/projects";

/**
 * Interactive project card.
 * - Mouse-tracked radial spotlight via CSS variables mutated on the DOM
 *   directly (no React re-renders) — stays on the GPU compositor.
 * - Spring hover lift on `transform: translateY` only.
 * - Entrance via `fadeUp` when scrolled into view.
 */
export function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      variants={reduce ? undefined : fadeUp}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={spring.snappy}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-colors hover:border-border/80"
      style={{ willChange: "transform" }}
    >
      {/* Mouse-tracked radial spotlight — zero React re-renders. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), color-mix(in oklab, var(--accent) 10%, transparent), transparent 40%)",
        }}
      />
      {/* Hairline inner ring that lights up on hover. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent transition-colors duration-300 group-hover:ring-accent/20"
      />

      <div className="relative z-10 flex h-full flex-col">
        <header className="flex flex-col gap-1.5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
            {project.domain}
          </p>
          <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground">{project.period}</p>
        </header>

        <p className="mt-4 text-base leading-relaxed text-foreground/85">
          {project.tagline}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
          {project.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex gap-2">
              <span
                aria-hidden
                className="mt-2 inline-block h-1 w-1 flex-none rounded-full bg-accent/70"
              />
              <span className="leading-relaxed">{h}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.techStack.map((t) => (
            <Badge key={t} variant="tech">
              {t}
            </Badge>
          ))}
        </div>

        {(project.githubUrl || project.liveUrl) && (
          <div className="mt-6 flex items-center gap-4 border-t border-border/60 pt-4">
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <GithubIcon size={16} /> Source
              </Link>
            )}
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink className="size-4" /> Live demo
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
