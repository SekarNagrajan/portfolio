"use client";

import { motion, useReducedMotion } from "motion/react";
import { staggerContainer } from "@/lib/motion";
import { SkillBadge } from "@/components/features/SkillBadge";

export function SkillGroupList({ items }: { items: readonly string[] }) {
  const reduce = useReducedMotion();
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={reduce ? undefined : staggerContainer}
      className="flex flex-wrap gap-2"
    >
      {items.map((label, i) => (
        <SkillBadge key={label} label={label} index={i} />
      ))}
    </motion.ul>
  );
}
