"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
  type Variants,
} from "motion/react";

const letter: Variants = {
  hidden: { y: "60%", opacity: 0 },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { type: "spring", stiffness: 90, damping: 16, delay: i * 0.07 },
  }),
};

/**
 * Oversized outlined wordmark. Letters rise in on view; a spotlight
 * fills them in the accent under the cursor (or sweeps on its own on
 * touch screens).
 */
export function Wordmark({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -5% 0px" });
  const reduce = useReducedMotion();
  const hovering = useRef(false);
  const resume = useRef<() => void>(undefined);
  const mx = useMotionValue(-1000);
  const my = useMotionValue(0);
  const mask = useMotionTemplate`radial-gradient(clamp(140px, 22vw, 360px) circle at ${mx}px ${my}px, #000 25%, transparent 70%)`;

  // Idle sweep so the effect still reads without a mouse.
  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    // Phones: the sweep repaints a viewport-wide text mask every frame.
    if (window.matchMedia("(hover: none)").matches) return;
    let ctrl: AnimationPlaybackControls | undefined;
    const start = () => {
      if (hovering.current) return;
      ctrl?.stop();
      const { width, height } = el.getBoundingClientRect();
      my.set(height * 0.55);
      ctrl = animate(mx, [width * 0.05, width * 0.95], {
        duration: 7,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      });
    };
    resume.current = start;
    const id = window.setTimeout(start, 900);
    return () => {
      clearTimeout(id);
      ctrl?.stop();
      resume.current = undefined;
    };
  }, [inView, reduce, mx, my]);

  const letters = [...text];
  const layer = (filled: boolean) =>
    letters.map((ch, i) => (
      <motion.span
        key={i}
        custom={i}
        variants={reduce ? undefined : letter}
        className={filled ? "inline-block bg-linear-to-b from-accent to-accent/25 bg-clip-text text-transparent" : "inline-block"}
      >
        {ch}
      </motion.span>
    ));

  return (
    <motion.div
      ref={ref}
      aria-hidden
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        hovering.current = true;
        mx.stop();
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        hovering.current = false;
        mx.set(-1000);
        resume.current?.();
      }}
      className="relative select-none overflow-hidden whitespace-nowrap text-center text-[24vw] font-black leading-[0.8] tracking-tighter lg:text-[18vw]"
    >
      <p className="text-transparent [-webkit-text-stroke:1px_color-mix(in_oklab,var(--foreground)_14%,transparent)]">{layer(false)}</p>
      <motion.p
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className="absolute inset-0"
      >
        {layer(true)}
      </motion.p>
    </motion.div>
  );
}
