"use client";

import { useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { TechLogo } from "@/components/icons/TechLogos";
import { stack, stackCount, type StackItem } from "@/lib/data/stack";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Plain-English framing per layer, so a non-engineer knows why it matters. */
const LAYER_COPY: Record<string, { plain: string; why: string }> = {
  frontend: { plain: "What people see and click", why: "Screens sales reps, port agents and customers use every day." },
  backend: { plain: "Business rules & security", why: "Checks who can do what and keeps every request safe." },
  data: { plain: "Where the records live", why: "Operational and financial data, plus the reports built on it." },
  ai: { plain: "Removes manual work", why: "Turns voice, photos and questions into finished work." },
  tools: { plain: "How I ship reliably", why: "Versioning, builds, testing and delivery tracking." },
};

/**
 * Tech stack — two endless logo rails for an at-a-glance read, then
 * five layer cards. Picking a layer reveals what each tool is used for.
 */
export function StackShowcase() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(stack[0].id);
  const layer = stack.find((c) => c.id === active) ?? stack[0];

  const railsRef = useRef<HTMLDivElement>(null);
  const railsInView = useInView(railsRef, { margin: "10% 0px" });
  const all = stack.flatMap((c) => c.items);
  const half = Math.ceil(all.length / 2);

  return (
    <div className="flex flex-col gap-10">
      {/* Logo rails — paused while off-screen (endless blurred pills are
          the costliest thing on this page for phone GPUs). */}
      <div
        ref={railsRef}
        aria-hidden
        className={cn(
          "flex flex-col gap-3 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]",
          !railsInView && "[&_.animate-marquee]:[animation-play-state:paused]",
        )}
      >
        <Rail items={all.slice(0, half)} duration={46} />
        <Rail items={all.slice(half)} duration={52} reverse />
      </div>

      {/* Layer picker */}
      <div>
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{stackCount} tools</span> across five layers. Pick one to see how I use it.
          </p>
        </div>
        <div role="tablist" aria-label="Stack layers" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stack.map((c, i) => {
            const selected = c.id === active;
            const copy = LAYER_COPY[c.id];
            return (
              <motion.button
                key={c.id}
                type="button"
                role="tab"
                id={`layer-tab-${c.id}`}
                aria-selected={selected}
                aria-controls="layer-panel"
                onClick={() => {
                  setActive(c.id);
                  if (window.innerWidth < 1024)
                    document.getElementById("layer-panel")?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
                }}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ ...spring.soft, delay: i * 0.06 }}
                whileHover={reduce ? undefined : { y: -4 }}
                className={cn(
                  "group relative isolate flex flex-col items-start gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-[border-color,background-color,box-shadow] duration-300 sm:p-5",
                  i === stack.length - 1 && "col-span-2 sm:col-span-1",
                  selected
                    ? "border-accent/60 bg-accent/[0.07] shadow-[0_0_40px_-16px_var(--accent)]"
                    : "glass-sm hover:border-accent/30",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="layer-glow"
                    transition={reduce ? { duration: 0 } : spring.snappy}
                    className="absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent via-accent to-transparent"
                  />
                )}
                <LogoFan items={c.items} open={selected} />
                <span className="flex w-full flex-col gap-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={cn("font-mono text-[10px] uppercase tracking-[0.18em]", selected ? "text-accent" : "text-muted-foreground")}>
                      {c.label}
                    </span>
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground/70">{c.items.length}</span>
                  </span>
                  <span className="text-pretty text-sm font-semibold leading-snug tracking-tight text-foreground sm:text-[15px]">
                    {copy?.plain}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div
          id="layer-panel"
          role="tabpanel"
          aria-labelledby={`layer-tab-${active}`}
          className="glass mt-3 min-h-[24rem] overflow-hidden rounded-2xl sm:min-h-[16.5rem] lg:min-h-[13.75rem]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={layer.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 sm:p-6"
            >
              <p className="mb-5 max-w-2xl text-pretty text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{layer.label}.</span> {LAYER_COPY[layer.id]?.why}
              </p>
              <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {layer.items.map((item, i) => (
                  <motion.li
                    key={item.name}
                    initial={reduce ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring.soft, delay: reduce ? 0 : 0.04 * i }}
                    className="group/item flex items-center gap-3"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border/60 bg-background/40 text-foreground transition-[color,border-color] duration-300 group-hover/item:border-accent/50 group-hover/item:text-accent">
                      <TechLogo name={item.logo} fallback={item.monogram} size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold tracking-tight text-foreground">{item.name}</span>
                      <span className="block text-pretty text-xs leading-snug text-muted-foreground">{item.use}</span>
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** One endless rail. Content renders twice so the -50% loop is seamless. */
function Rail({ items, duration, reverse = false }: { items: readonly StackItem[]; duration: number; reverse?: boolean }) {
  return (
    <div className="group/rail flex overflow-hidden">
      <div
        className="animate-marquee flex w-max shrink-0 gap-3 pr-3 group-hover/rail:[animation-play-state:paused]"
        style={{ "--marquee-duration": `${duration}s`, animationDirection: reverse ? "reverse" : "normal" } as CSSProperties}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item.name}-${i}`}
            className="glass-sm flex shrink-0 items-center gap-2.5 rounded-full py-2 pl-2 pr-4 text-sm font-medium text-foreground/85"
          >
            <span className="grid size-8 place-items-center rounded-full bg-background/50 text-foreground">
              <TechLogo name={item.logo} fallback={item.monogram} size={16} />
            </span>
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Overlapping logo stack that fans out when its layer is selected or hovered. */
function LogoFan({ items, open }: { items: readonly StackItem[]; open: boolean }) {
  const shown = items.slice(0, 3);
  const extra = items.length - shown.length;
  return (
    <span className="flex items-center">
      {shown.map((item, i) => (
        <span
          key={item.name}
          className={cn(
            "-ml-2 grid size-9 place-items-center rounded-xl border bg-card text-foreground shadow-glass transition-[margin,transform,color,border-color] duration-300 ease-out first:ml-0 group-hover:ml-1 group-hover:first:ml-0",
            open ? "ml-1 border-accent/40 text-accent first:ml-0" : "border-border/70",
          )}
          style={{ zIndex: shown.length - i, transitionDelay: `${i * 30}ms` }}
        >
          <TechLogo name={item.logo} fallback={item.monogram} size={17} />
        </span>
      ))}
      {extra > 0 && <span className="ml-2 font-mono text-[10px] text-muted-foreground">+{extra}</span>}
    </span>
  );
}
