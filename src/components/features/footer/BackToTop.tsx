"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { ArrowUpIcon, MotionLink, hoverTrigger } from "@/components/icons/AnimatedIcons";

/** Back-to-top pill whose ring fills with page scroll progress. */
export function BackToTop() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <MotionLink
      href="#main"
      {...hoverTrigger}
      className="group inline-flex items-center gap-3 rounded-full border border-border/70 py-1.5 pl-4 pr-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
    >
      Back to top
      <span className="relative grid size-8 place-items-center rounded-full text-foreground">
        <svg aria-hidden viewBox="0 0 32 32" className="absolute inset-0 -rotate-90">
          <circle cx="16" cy="16" r="14" fill="none" strokeWidth="2" className="stroke-foreground/10" />
          <motion.circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            className="stroke-accent"
            style={{ pathLength: progress }}
          />
        </svg>
        <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
          <ArrowUpIcon size={14} />
        </span>
      </span>
    </MotionLink>
  );
}
