"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Scroll progress — hairline gradient bar pinned to the top edge.    */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Count-up number — animates once when scrolled into view.           */
/* ------------------------------------------------------------------ */
export function CountUp({
  to,
  suffix = "",
  decimals = 0,
  duration = 1.6,
  className,
}: {
  to: number;
  suffix?: string;
  /** Fraction digits to show, e.g. 1 for a CGPA of 8.9. */
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = `${to.toFixed(decimals)}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${v.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, decimals, duration, reduce]);

  // Server-render the final value so no-JS / crawlers see real numbers.
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {to.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic — child drifts toward the cursor, springs back on leave.  */
/* ------------------------------------------------------------------ */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 250, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 250, damping: 18, mass: 0.4 });

  if (reduce) return <div className={cn("inline-flex", className)}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={cn("inline-flex", className)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Spotlight card — reveals on scroll, lifts on hover, tracks a radial */
/* glow + border light under the cursor, and cascades the `hidden` /  */
/* `rest` / `hover` variant labels to animated icons inside it.       */
/* ------------------------------------------------------------------ */
export function SpotlightCard({
  children,
  className,
  as = "div",
  index = 0,
  lift = true,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li" | "section";
  /** Position in a grid — staggers the entrance. */
  index?: number;
  lift?: boolean;
}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const glow = useMotionTemplate`radial-gradient(520px circle at ${mx}px ${my}px, color-mix(in oklab, var(--accent) 13%, transparent), transparent 45%)`;
  const ring = useMotionTemplate`radial-gradient(320px circle at ${mx}px ${my}px, color-mix(in oklab, var(--accent) 60%, transparent), transparent 60%)`;
  const Comp = motion[as];

  return (
    <Comp
      initial="hidden"
      whileInView="rest"
      whileHover="hover"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={
        reduce
          ? { hidden: { opacity: 1 }, rest: { opacity: 1 } }
          : {
              hidden: { opacity: 0, y: 32 },
              rest: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 140, damping: 20, delay: (index % 4) * 0.08 },
              },
              hover: lift ? { y: -6, transition: { type: "spring", stiffness: 380, damping: 24 } } : {},
            }
      }
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return; // hover-only effect — skip touch
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className={cn(
        "glass group relative isolate overflow-hidden rounded-2xl",
        className,
      )}
    >
      {/* Border light — a gradient masked down to a 1px ring. */}
      <motion.div
        aria-hidden
        style={{ background: ring }}
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] p-px opacity-0 transition-opacity duration-300 [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] group-hover:opacity-100"
      />
      <motion.div
        aria-hidden
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {children}
    </Comp>
  );
}

export { RotatingText } from "./RotatingText";
