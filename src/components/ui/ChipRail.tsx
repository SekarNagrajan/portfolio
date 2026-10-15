"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Horizontal chip/tab scroller with mobile affordances: snap points, an
 * edge fade that hints at overflow, a hidden scrollbar, and auto-scroll
 * that keeps the active chip in view when `activeKey` changes.
 *
 * Children opt in with `snap-start shrink-0` and mark the current chip
 * with `data-active="true"`.
 */
export function ChipRail({
  children,
  className,
  label,
  activeKey,
  role = "group",
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  activeKey?: string | number | null;
  role?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (activeKey === undefined) return;
    const rail = ref.current;
    const chip = rail?.querySelector<HTMLElement>('[data-active="true"]');
    if (!rail || !chip) return;
    // Only scroll the rail — never the page.
    const pad = 24; // breathing room past the edge fade
    const left = chip.offsetLeft - rail.offsetLeft;
    const right = left + chip.offsetWidth;
    let to: number | null = null;
    if (left < rail.scrollLeft + pad) to = left - pad;
    else if (right > rail.scrollLeft + rail.clientWidth - pad)
      to = right - rail.clientWidth + pad;
    if (to !== null)
      rail.scrollTo({ left: Math.max(0, to), behavior: reduce ? "auto" : "smooth" });
  }, [activeKey, reduce]);

  return (
    <div
      ref={ref}
      role={role}
      aria-label={label}
      className={cn(
        "flex min-w-0 snap-x gap-1 overflow-x-auto overscroll-x-contain edge-fade-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
