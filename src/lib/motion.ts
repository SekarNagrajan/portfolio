import type { Transition, Variants } from "motion/react";

/**
 * Centralized spring presets.
 * Only `transform` + `opacity` are animated across the app — hardware
 * accelerated on the GPU compositor so no layout reflows occur.
 */
export const spring = {
  /** Snappy UI feedback — hover lifts, button taps. */
  snappy: {
    type: "spring",
    stiffness: 350,
    damping: 25,
  } satisfies Transition,

  /** Soft entrance — hero + section reveals. */
  soft: {
    type: "spring",
    stiffness: 180,
    damping: 22,
    mass: 0.8,
  } satisfies Transition,

  /** Gentle — layout transitions and card expansions. */
  gentle: {
    type: "spring",
    stiffness: 120,
    damping: 20,
    mass: 1,
  } satisfies Transition,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: spring.soft },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

/**
 * Staggered reveal — give to a parent `motion.div` with `initial="hidden"`
 * `whileInView="show"`. Children with `fadeUp` cascade.
 */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};
