"use client";

import type { ComponentType } from "react";
import { motion } from "motion/react";
import { SpotlightCard } from "@/components/motion/Effects";
import {
  CodeIcon,
  DatabaseIcon,
  ServerIcon,
  SettingsIcon,
  SparklesIcon,
  TerminalIcon,
  type AnimatedIconProps,
} from "@/components/icons/AnimatedIcons";
import type { SkillGroup } from "@/lib/data/skills";
import { cn } from "@/lib/utils";

export const SKILL_ICONS: Record<string, ComponentType<AnimatedIconProps>> = {
  languages: TerminalIcon,
  frontend: CodeIcon,
  backend: ServerIcon,
  ai: SparklesIcon,
  database: DatabaseIcon,
  tools: SettingsIcon,
};

/**
 * One skill layer as a bento tile. Chips cascade in after the card
 * reveals (they inherit the card's `rest` label), and lift on hover.
 */
export function SkillGroupCard({
  group,
  index = 0,
  className,
}: {
  group: SkillGroup;
  index?: number;
  className?: string;
}) {
  const Icon = SKILL_ICONS[group.id] ?? CodeIcon;

  return (
    <SpotlightCard as="section" index={index} lift={false} className={cn("flex flex-col p-7 sm:p-8", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="grid size-14 place-items-center rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/20 via-accent/5 to-transparent text-accent">
          <Icon size={26} strokeWidth={1.75} />
        </div>
        <span className="rounded-full border border-border/70 px-3 py-1 font-mono text-xs text-muted-foreground">
          {String(group.items.length).padStart(2, "0")} skills
        </span>
      </div>

      <h3 id={`group-${group.id}`} className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
        {group.label}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.description}</p>

      <motion.ul
        aria-labelledby={`group-${group.id}`}
        variants={{ hidden: {}, rest: { transition: { staggerChildren: 0.03, delayChildren: 0.25 } } }}
        className="mt-6 flex flex-wrap gap-2"
      >
        {group.items.map((label) => (
          <motion.li
            key={label}
            variants={{
              hidden: { opacity: 0, y: 10, scale: 0.9 },
              rest: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 22 } },
            }}
            whileHover={{ y: -3, scale: 1.05 }}
            className="cursor-default select-none rounded-full border border-border/70 bg-muted/40 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent/60 hover:bg-accent/10 hover:text-foreground"
          >
            {label}
          </motion.li>
        ))}
      </motion.ul>
    </SpotlightCard>
  );
}
