"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ArchitectureLayer } from "@/lib/data/case-studies";
import { TechLogo, logoForTech } from "@/components/icons/TechLogos";
import { inViewOnce } from "@/lib/motion";

/**
 * Layered architecture diagram. Layers stack top (user-facing) to bottom
 * (data); each connector carries a pulse travelling downward to suggest
 * request flow. Layers slide in one after another on scroll.
 */
export function ArchitectureDiagram({ layers }: { layers: readonly ArchitectureLayer[] }) {
  const reduce = useReducedMotion();

  return (
    <motion.ol
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
      aria-label="Architecture layers, from user-facing to data"
      className="flex flex-col"
    >
      {layers.map((layer, i) => (
        <motion.li
          key={layer.label}
          variants={{
            hidden: { opacity: 0, x: -24 },
            show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 140, damping: 20 } },
          }}
          className="flex flex-col"
        >
          <div className="grid gap-4 rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm transition-colors hover:border-accent/50 sm:grid-cols-[11rem_1fr] sm:items-center">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg border border-accent/40 bg-accent/10 font-mono text-xs font-semibold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold uppercase tracking-widest text-foreground">{layer.label}</span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {layer.items.map((item) => {
                const logo = logoForTech(item);
                return (
                  <li
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-sm text-foreground/85"
                  >
                    {logo && <TechLogo name={logo} size={14} className="text-accent" />}
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Connector with a downward-travelling pulse */}
          {i < layers.length - 1 && (
            <div aria-hidden className="relative ml-[1.85rem] h-10 w-px bg-gradient-to-b from-accent/60 to-accent/10">
              {!reduce && (
                <motion.span
                  className="absolute -left-[3px] top-0 size-[7px] rounded-full bg-accent shadow-[0_0_12px_var(--accent)]"
                  animate={{ y: [0, 33], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 }}
                />
              )}
            </div>
          )}
        </motion.li>
      ))}
    </motion.ol>
  );
}
