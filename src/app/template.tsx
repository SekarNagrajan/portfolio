"use client";

import { useRef } from "react";
import { motion } from "motion/react";

/**
 * Route transition — templates remount on every navigation, so each
 * page enters with a short lift. (No blur: animating filter over the
 * whole page is the most expensive thing a navigation can do, and the
 * lift reads the same.) Once the entry settles, the residual transform
 * is cleared so `position: fixed` inside pages anchors to the viewport
 * again instead of this wrapper.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        if (ref.current) ref.current.style.transform = "none";
      }}
    >
      {children}
    </motion.div>
  );
}
