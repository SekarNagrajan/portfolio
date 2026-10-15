"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { TechLogo } from "@/components/icons/TechLogos";
import { stack, stackCount } from "@/lib/data/stack";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ALL = "all";

/**
 * Tabbed tech-stack showcase. A shared-layout pill slides between
 * category tabs; tiles re-flow with layout animation and pop in/out as
 * the filter changes. Hovering a tile lights its logo in the accent.
 */
export function TechStack() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>(ALL);

  const tabs = [{ id: ALL, label: "All", count: stackCount }].concat(
    stack.map((c) => ({ id: c.id, label: c.label, count: c.items.length })),
  );
  const items = stack.flatMap((c) =>
    active === ALL || active === c.id ? c.items.map((item) => ({ ...item, category: c.label })) : [],
  );

  return (
    <div>
      {/* Tabs */}
      <LayoutGroup id="stack-tabs">
        <div
          role="tablist"
          aria-label="Technology categories"
          className="glass mb-10 inline-flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none]"
        >
          {tabs.map((t) => {
            const selected = t.id === active;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`stack-tab-${t.id}`}
                aria-selected={selected}
                aria-controls="stack-panel"
                onClick={() => setActive(t.id)}
                className={cn(
                  "relative isolate inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-medium transition-colors",
                  selected ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="stack-tab-pill"
                    transition={reduce ? { duration: 0 } : spring.snappy}
                    className="absolute inset-0 rounded-full bg-accent shadow-[0_0_24px_-6px_var(--accent)]"
                  />
                )}
                <span className="relative inline-flex items-center gap-2">
                  {t.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 font-mono text-[10px] tabular-nums",
                      selected ? "bg-accent-foreground/15" : "bg-muted",
                    )}
                  >
                    {t.count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      {/* Tiles */}
      <motion.ul
        id="stack-panel"
        role="tabpanel"
        aria-labelledby={`stack-tab-${active}`}
        layout
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item, i) => (
            <motion.li
              key={item.name}
              layout
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ ...spring.soft, delay: reduce ? 0 : Math.min(i * 0.025, 0.3) }}
              whileHover={reduce ? undefined : { y: -6 }}
              className="glass-sm group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-5 transition-colors hover:border-accent/50"
            >
              {/* Accent wash that rises from the bottom on hover. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-full translate-y-full bg-gradient-to-t from-accent/12 to-transparent transition-transform duration-500 ease-out group-hover:translate-y-0"
              />
              <div className="relative flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-xl border border-border/60 bg-background/40 text-foreground transition-all duration-300 group-hover:scale-110 group-hover:border-accent/50 group-hover:text-accent group-hover:shadow-glass">
                  <TechLogo name={item.logo} fallback={item.monogram} size={24} />
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
                  {item.category}
                </span>
              </div>
              <div className="relative">
                <p className="font-semibold tracking-tight text-foreground">{item.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.use}</p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
