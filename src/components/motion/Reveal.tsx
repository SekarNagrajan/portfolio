"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { fadeUp, inViewOnce, scaleIn, staggerContainer, staggerFast } from "@/lib/motion";

type Tag = "div" | "section" | "ul" | "ol" | "li" | "article" | "header" | "aside" | "p" | "h2";

const variantMap = { fadeUp, scaleIn } satisfies Record<string, Variants>;

/**
 * Scroll-triggered reveal for Server Component pages. Wrap any block
 * and it fades / lifts in once when it enters the viewport.
 */
export function Reveal({
  children,
  className,
  as = "div",
  variant = "fadeUp",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  variant?: keyof typeof variantMap;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  if (reduce) return <Comp className={className}>{children}</Comp>;

  return (
    <Comp
      className={className}
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Comp>
  );
}

/** Parent that cascades `RevealItem` children in sequence. */
export function Stagger({
  children,
  className,
  as = "div",
  fast = false,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  fast?: boolean;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  if (reduce) return <Comp className={className}>{children}</Comp>;

  return (
    <Comp
      className={className}
      variants={fast ? staggerFast : staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
  variant = "fadeUp",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  variant?: keyof typeof variantMap;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp className={className} variants={reduce ? undefined : variantMap[variant]}>
      {children}
    </Comp>
  );
}
