"use client";

import { motion, useReducedMotion } from "motion/react";
import { spring, fadeUp } from "@/lib/motion";

/**
 * Interactive skill chip — spring hover lift + staggered entrance.
 */
export function SkillBadge({ label, index = 0 }: { label: string; index?: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      variants={reduce ? undefined : fadeUp}
      whileHover={reduce ? undefined : { y: -3, scale: 1.03 }}
      transition={spring.snappy}
      className="inline-flex cursor-default select-none items-center rounded-full border border-border/70 bg-muted/40 px-3.5 py-1.5 text-sm text-muted-foreground shadow-sm transition-colors hover:border-accent/50 hover:text-foreground"
      style={{
        willChange: "transform",
      }}
      aria-posinset={index + 1}
    >
      {label}
    </motion.li>
  );
}
