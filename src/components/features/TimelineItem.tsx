"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import type { Experience } from "@/lib/data/experiences";
import { Badge } from "@/components/ui/badge";

/**
 * One entry in the Experience timeline — animates in on scroll.
 */
export function TimelineItem({ exp }: { exp: Experience }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      variants={reduce ? undefined : fadeUp}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-100px" }}
      className="relative pl-8 pb-14 last:pb-0"
    >
      {/* Rail */}
      <span
        aria-hidden
        className="absolute left-[7px] top-2 h-full w-px bg-gradient-to-b from-accent/60 via-border to-transparent"
      />
      {/* Node */}
      <span
        aria-hidden
        className="absolute left-0 top-2 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-accent/60 bg-background"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      </span>

      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-lg font-semibold text-foreground sm:text-xl">
            {exp.role}
          </h3>
          <span className="text-sm text-muted-foreground">·</span>
          {exp.companyUrl ? (
            <Link
              href={exp.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-base font-medium text-accent hover:underline"
            >
              {exp.company} <ExternalLink className="size-3.5" />
            </Link>
          ) : (
            <span className="text-base font-medium text-foreground">
              {exp.company}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          <span className="font-mono">{exp.period}</span> · {exp.location}
        </p>

        {exp.companyContext && (
          <p className="mt-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              About {exp.company.split(" ")[0]}:
            </span>{" "}
            {exp.companyContext}
          </p>
        )}

        <p className="mt-2 text-base leading-relaxed text-foreground/90">
          {exp.summary}
        </p>

        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {exp.achievements.map((a) => (
            <li key={a} className="flex gap-2">
              <span
                aria-hidden
                className="mt-2 inline-block h-1 w-1 flex-none rounded-full bg-accent/70"
              />
              <span>{a}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {exp.technologies.map((t) => (
            <Badge key={t} variant="tech">
              {t}
            </Badge>
          ))}
        </div>
      </div>
    </motion.li>
  );
}
