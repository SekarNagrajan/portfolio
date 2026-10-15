import type { Transition, Variants } from "motion/react";

/**
 * Centralized motion presets.
 * Only `transform`, `opacity`, `filter`, and SVG `pathLength` are animated
 * across the app — compositor-friendly, no layout reflows.
 */
export const spring = {
  /** Snappy UI feedback — hover lifts, button taps. */
  snappy: { type: "spring", stiffness: 380, damping: 26 } satisfies Transition,

  /** Soft entrance — hero + section reveals. */
  soft: { type: "spring", stiffness: 160, damping: 22, mass: 0.8 } satisfies Transition,

  /** Gentle — layout transitions and card expansions. */
  gentle: { type: "spring", stiffness: 110, damping: 20, mass: 1 } satisfies Transition,

  /** Bouncy — icon micro-interactions. */
  bouncy: { type: "spring", stiffness: 500, damping: 14 } satisfies Transition,
} as const;

/** Expo-out curve for non-spring tweens. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: spring.soft },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: easeOutExpo } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: spring.soft },
};

/**
 * Staggered reveal — give to a parent with `initial="hidden"`
 * `whileInView="show"`. Children with `fadeUp` cascade.
 */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerFast: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
};

/** Shared viewport config — reveal once, slightly before fully in view. */
export const inViewOnce = { once: true, margin: "0px 0px -12% 0px" } as const;

/**
 * Spread on a motion parent (e.g. <MotionLink>) so animated icons inside
 * react to hover / tap.
 */
export const hoverTrigger = {
  initial: "rest",
  animate: "rest",
  whileHover: "hover",
  whileTap: "hover",
} as const;

/** Spread on a motion parent for icon draw-in on scroll, plus hover. */
export const revealTrigger = {
  initial: "hidden",
  whileInView: "rest",
  whileHover: "hover",
  viewport: { once: true, margin: "0px 0px -10% 0px" },
} as const;
