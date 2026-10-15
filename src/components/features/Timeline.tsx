"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import type { Experience } from "@/lib/data/experiences";
import { SpotlightCard } from "@/components/motion/Effects";
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  MapPinIcon,
  revealTrigger,
} from "@/components/icons/AnimatedIcons";

/**
 * Experience timeline. The rail fills with a gradient as the reader
 * scrolls through it; each role's metadata pins on the left while its
 * achievements scroll on the right — using the full width on desktop.
 */
export function Timeline({ items }: { items: readonly Experience[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} aria-label="Professional experience timeline" className="relative space-y-20 pl-10 sm:pl-14">
      {/* Rail + scroll-linked fill */}
      <span aria-hidden className="absolute left-[15px] top-2 h-full w-px bg-border sm:left-[23px]" />
      <motion.span
        aria-hidden
        style={{ scaleY: reduce ? 1 : scaleY }}
        className="absolute left-[15px] top-2 h-full w-px origin-top bg-gradient-to-b from-accent to-accent/30 sm:left-[23px]"
      />

      {items.map((exp) => (
        <motion.li key={exp.id} {...revealTrigger} className="relative">
          {/* Node */}
          <span
            aria-hidden
            className="absolute -left-10 top-0 grid size-8 place-items-center rounded-full border border-accent/50 bg-background text-accent shadow-[0_0_24px_-4px_var(--accent)] sm:-left-14 sm:size-12"
          >
            <BriefcaseIcon size={18} />
          </span>

          <div className="grid gap-10 xl:grid-cols-[minmax(0,26rem)_1fr] xl:gap-16">
            {/* Pinned role summary */}
            <div className="xl:sticky xl:top-28 xl:self-start">
              <p className="font-mono text-sm text-accent">{exp.period}</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{exp.role}</h3>
              {exp.companyUrl ? (
                <Link
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-lg font-medium text-foreground/90 hover:text-accent"
                >
                  {exp.company} <ArrowUpRightIcon size={16} trigger="self" />
                </Link>
              ) : (
                <p className="mt-1 text-lg font-medium text-foreground/90">{exp.company}</p>
              )}
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <MapPinIcon size={15} /> {exp.location}
              </p>

              <p className="mt-6 text-pretty text-base leading-relaxed text-foreground/85">{exp.summary}</p>

              {exp.companyContext && (
                <p className="mt-6 rounded-2xl border border-border/60 bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">About {exp.company.split(" ")[0]} · </span>
                  {exp.companyContext}
                </p>
              )}

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {exp.technologies.map((t) => (
                  <li key={t} className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Achievements as a responsive card grid */}
            <ul className="grid gap-4 md:grid-cols-2">
              {exp.achievements.map((a, i) => (
                <SpotlightCard as="li" key={a} index={i} className="flex gap-4 p-6">
                  <CheckCircleIcon size={20} className="mt-0.5 text-accent" />
                  <p className="text-sm leading-relaxed text-foreground/85">{a}</p>
                </SpotlightCard>
              ))}
            </ul>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
