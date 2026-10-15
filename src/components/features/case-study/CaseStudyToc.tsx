"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChipRail } from "@/components/ui/ChipRail";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Sticky "On this page" navigation. An IntersectionObserver tracks which
 * section is in the reading band; a shared-layout bar slides to it.
 */
export function CaseStudyToc({
  sections,
  variant = "list",
}: {
  sections: readonly { id: string; label: string }[];
  variant?: "list" | "rail";
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A band across the upper-middle of the viewport counts as "reading".
      { rootMargin: "-25% 0px -60% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  if (variant === "rail") {
    return (
      <nav aria-label="On this page">
        <ChipRail label="On this page" activeKey={active} className="glass rounded-full p-1.5">
          {sections.map(({ id, label }) => {
            const isActive = id === active;
            return (
              <a
                key={id}
                href={`#${id}`}
                data-active={isActive || undefined}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "inline-flex h-10 shrink-0 snap-start items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors",
                  isActive ? "bg-accent/15 text-accent" : "text-muted-foreground",
                )}
              >
                {label}
              </a>
            );
          })}
        </ChipRail>
      </nav>
    );
  }

  return (
    <nav aria-label="On this page" className="glass rounded-2xl p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">On this page</p>
      <ul className="relative space-y-1 border-l border-border/70">
        {sections.map(({ id, label }) => {
          const isActive = id === active;
          return (
            <li key={id} className="relative">
              {isActive && (
                <motion.span
                  layoutId="toc-indicator"
                  transition={reduce ? { duration: 0 } : spring.snappy}
                  className="absolute -left-px top-0 h-full w-0.5 bg-accent"
                />
              )}
              <a
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block py-1.5 pl-4 text-sm transition-colors",
                  isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
