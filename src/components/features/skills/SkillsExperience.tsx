"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Search, X } from "lucide-react";
import { CountUp } from "@/components/motion/Effects";
import { SKILL_ICONS } from "@/components/features/SkillGroupCard";
import { TechLogo, logoForTech, monogramFor } from "@/components/icons/TechLogos";
import { BriefcaseIcon, CodeIcon, SparklesIcon } from "@/components/icons/AnimatedIcons";
import { skillGroups } from "@/lib/data/skills";
import {
  dailyDrivers,
  pairedWith,
  productsWithEvidence,
  skillByName,
  skills,
  stackCount,
  type SkillInfo,
} from "@/lib/data/skill-evidence";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** What each layer means, in plain English. */
const PLAIN: Record<string, string> = {
  languages: "The languages I write production code in.",
  frontend: "What people see and click.",
  backend: "Business rules, security and APIs.",
  ai: "Automation that removes manual work.",
  database: "Where records live and how systems exchange them.",
  tools: "How I build, test and ship.",
};

/** Six accent strengths for the layer donut, strongest first. */
const SHADES = [100, 82, 66, 52, 40, 30];
const shade = (i: number) => `color-mix(in oklab, var(--accent) ${SHADES[i]}%, transparent)`;

const ALL = "all";
const total = skills.length;
const productName = (title: string) => title.split(" — ")[0];

function Logo({ name, size = 16, className }: { name: string; size?: number; className?: string }) {
  return <TechLogo name={logoForTech(name)} fallback={monogramFor(name)} size={size} className={className} />;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-accent/30 px-0.5 text-inherit">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

/* ------------------------------------------------------------------ */

export function SkillsExperience() {
  const reduce = useReducedMotion();
  const [layer, setLayer] = useState<string>(ALL);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>("React 19");
  const [sheetOpen, setSheetOpen] = useState(false);
  const explorerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const q = query.trim();
  const visible = useMemo(
    () =>
      skills.filter(
        (s) => (layer === ALL || s.group.id === layer) && (!q || s.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [layer, q],
  );

  // "/" focuses search; Escape clears it or closes the sheet.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "Escape") {
        setSheetOpen(false);
        if (document.activeElement === searchRef.current) setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toExplorer = () => explorerRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });

  const pick = (name: string, fromOutside = false) => {
    setSelected(name);
    setSheetOpen(true);
    if (fromOutside) {
      setLayer(ALL);
      setQuery("");
      toExplorer();
    }
  };

  return (
    <>
      <Hero
        hovered={layer}
        onLayer={(id) => {
          setLayer(id);
          setQuery("");
          toExplorer();
        }}
      />

      <section id="core" className="shell relative py-16 sm:py-20">
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="glass-sm mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <BriefcaseIcon size={14} trigger="self" /> Daily drivers
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              The tools in <span className="text-gradient">most of my products</span>.
            </h2>
          </div>
          <p className="max-w-md text-pretty text-sm text-muted-foreground">
            Ranked by how many shipped products list them in their tech stack. Click one to see where.
          </p>
        </div>
        <DailyDrivers onPick={(n) => pick(n, true)} />
      </section>

      <section id="skills" ref={explorerRef} className="shell relative scroll-mt-24 pb-16 sm:pb-24">
        <div className="mb-8">
          <p className="glass-sm mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <CodeIcon size={14} trigger="self" /> Skill explorer
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Every skill, with the receipts.</h2>
          <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
            Search or filter, then pick any skill to see the products where I used it. Skills marked{" "}
            <span className="inline-flex translate-y-px items-center gap-1 align-baseline text-foreground">
              <span className="size-1.5 rounded-full bg-accent" /> appear in a shipped product
            </span>
            .
          </p>
        </div>

        <Toolbar
          query={query}
          setQuery={setQuery}
          layer={layer}
          setLayer={setLayer}
          searchRef={searchRef}
          shown={visible.length}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="min-w-0">
            <LayoutGroup>
              <motion.div layout className="grid gap-5 md:grid-cols-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  {skillGroups.map((g, gi) => {
                    const items = visible.filter((s) => s.group.id === g.id);
                    if (items.length === 0) return null;
                    return (
                      <GroupCard
                        key={g.id}
                        id={g.id}
                        index={gi}
                        items={items}
                        query={q}
                        selected={selected}
                        onPick={(n) => pick(n)}
                        wide={layer !== ALL || items.length > 8}
                      />
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>

            {visible.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-10 text-center"
              >
                <p className="text-lg font-semibold">No skill matches “{q}”.</p>
                <p className="mt-1 text-sm text-muted-foreground">Try a broader term like “React”, “SQL” or “AI”.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setLayer(ALL);
                  }}
                  className="mt-5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-accent/50"
                >
                  Clear search
                </button>
              </motion.div>
            )}
          </div>

          {/* Inspector — sticky column on large screens */}
          <aside aria-label="Skill details" className="hidden lg:block">
            <div className="sticky top-[calc(var(--nav-height)+6.5rem)]">
              <Inspector name={selected} onPick={(n) => setSelected(n)} />
            </div>
          </aside>
        </div>
      </section>

      {/* Inspector — bottom sheet on phones and tablets */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 32 }}
            role="region"
            aria-label="Skill details"
            className="fixed inset-x-0 bottom-[calc(var(--tab-bar-height)+env(safe-area-inset-bottom))] z-40 max-h-[70vh] overflow-y-auto rounded-t-3xl border-t border-border bg-background/95 p-4 shadow-glass-lg backdrop-blur-xl lg:hidden"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="mx-auto h-1 w-10 rounded-full bg-border" />
            </div>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              aria-label="Close skill details"
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full border border-border text-muted-foreground"
            >
              <X size={14} />
            </button>
            <Inspector name={selected} onPick={(n) => setSelected(n)} compact />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero with the layer donut                                          */
/* ------------------------------------------------------------------ */

/** Donut geometry — static, so computed once. */
const R = 78;
const C = 2 * Math.PI * R;
const GAP = 3;
const ARCS = skillGroups.map((g, i) => {
  const before = skillGroups.slice(0, i).reduce((n, x) => n + x.items.length, 0);
  const len = (g.items.length / total) * C;
  return { g, i, len: Math.max(len - GAP, 0), start: (before / total) * C };
});

function Hero({ hovered, onLayer }: { hovered: string; onLayer: (id: string) => void }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<string | null>(null);
  const focus = hover ?? (hovered !== ALL ? hovered : null);
  const focusGroup = skillGroups.find((g) => g.id === focus);


  return (
    <section
      aria-labelledby="skills-title"
      className="shell relative pt-[max(6rem,calc(env(safe-area-inset-top)+4.5rem))] lg:pt-40"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:gap-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.soft}
          className="flex flex-col items-start gap-6"
        >
          <p className="glass-sm inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <SparklesIcon size={14} trigger="mount" /> Skills
          </p>
          <h1 id="skills-title" className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            A <span className="text-gradient">production-tested</span> technical matrix.
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Grouped by layer so recruiters, engineering managers and clients can scan quickly. Every skill links to the
            shipped products where it was used, not a self-rated score.
          </p>
          <dl className="flex flex-wrap gap-3">
            {[
              { to: total, label: "skills" },
              { to: skillGroups.length, label: "layers" },
              { to: productsWithEvidence, label: "shipped products as evidence" },
            ].map((s) => (
              <div key={s.label} className="glass-sm flex items-baseline gap-2 rounded-2xl px-4 py-2.5">
                <dd className="text-2xl font-semibold tracking-tight text-gradient">
                  <CountUp to={s.to} />
                </dd>
                <dt className="text-sm text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Donut */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring.soft, delay: 0.15 }}
          className="glass rounded-3xl p-5 sm:p-6"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Skills by layer</p>
          <div className="mt-4 grid items-center gap-6 sm:grid-cols-[11rem_1fr] lg:grid-cols-1 xl:grid-cols-[11rem_1fr]">
            <div className="relative mx-auto size-44">
              <svg viewBox="0 0 200 200" className="size-full -rotate-90" aria-hidden>
                <circle cx="100" cy="100" r={R} fill="none" strokeWidth="22" className="stroke-foreground/[0.06]" />
                {ARCS.map(({ g, i, len, start }) => (
                  <motion.circle
                    key={g.id}
                    cx="100"
                    cy="100"
                    r={R}
                    fill="none"
                    strokeWidth={focus === g.id ? 28 : 22}
                    strokeDashoffset={-start}
                    style={{ stroke: shade(i), transition: "stroke-width 250ms, opacity 250ms" }}
                    opacity={focus && focus !== g.id ? 0.35 : 1}
                    initial={reduce ? false : { strokeDasharray: `0 ${C}` }}
                    animate={{ strokeDasharray: `${len} ${C}` }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.12 }}
                    onPointerEnter={() => setHover(g.id)}
                    onPointerLeave={() => setHover(null)}
                    onClick={() => onLayer(g.id)}
                    className="cursor-pointer"
                  />
                ))}
              </svg>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={focus ?? "all"}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.18 }}
                  >
                    <p className="text-3xl font-semibold tracking-tight">{focusGroup ? focusGroup.items.length : total}</p>
                    <p className="max-w-[6.5rem] text-[10px] uppercase leading-tight tracking-wider text-muted-foreground">
                      {focusGroup ? focusGroup.label : "total skills"}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <ul className="flex flex-col gap-1">
              {skillGroups.map((g, i) => (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => onLayer(g.id)}
                    onPointerEnter={() => setHover(g.id)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover(g.id)}
                    onBlur={() => setHover(null)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-2.5 py-1.5 text-left text-sm transition-colors",
                      focus === g.id ? "bg-accent/10 text-foreground" : "text-foreground/80 hover:bg-foreground/[0.04]",
                    )}
                  >
                    <span className="size-2.5 shrink-0 rounded-sm" style={{ background: shade(i) }} />
                    <span className="min-w-0 flex-1 truncate">{g.label}</span>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">{g.items.length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Click a layer to filter the explorer.</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function DailyDrivers({ onPick }: { onPick: (name: string) => void }) {
  const reduce = useReducedMotion();
  const drivers = dailyDrivers(6);
  const max = Math.max(...drivers.map(stackCount));

  return (
    <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {drivers.map((s, i) => (
        <motion.li
          key={s.name}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ ...spring.soft, delay: i * 0.06 }}
        >
          <button
            type="button"
            onClick={() => onPick(s.name)}
            className="glass-sm group relative flex h-full w-full flex-col items-start gap-4 overflow-hidden rounded-2xl p-5 text-left transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent/50"
          >
            <span aria-hidden className="absolute right-4 top-4 font-mono text-xs text-muted-foreground/60">
              #{i + 1}
            </span>
            <span className="grid size-12 place-items-center rounded-xl border border-border/60 bg-background/50 text-foreground transition-[color,box-shadow,border-color] duration-300 group-hover:border-accent/50 group-hover:text-accent group-hover:shadow-[0_0_24px_-6px_var(--accent)]">
              <Logo name={s.name} size={24} />
            </span>
            <span>
              <span className="block font-semibold tracking-tight">{s.name}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                In {stackCount(s)} product{stackCount(s) === 1 ? "" : "s"}
              </span>
            </span>
            <span className="mt-auto flex w-full gap-1" aria-hidden>
              {Array.from({ length: max }, (_, k) => (
                <motion.span
                  key={k}
                  className={cn("h-1 flex-1 rounded-full", k < stackCount(s) ? "bg-accent" : "bg-foreground/10")}
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06 + k * 0.08 }}
                  style={{ originX: 0 }}
                />
              ))}
            </span>
          </button>
        </motion.li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */

function Toolbar({
  query,
  setQuery,
  layer,
  setLayer,
  searchRef,
  shown,
}: {
  query: string;
  setQuery: (q: string) => void;
  layer: string;
  setLayer: (l: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  shown: number;
}) {
  const reduce = useReducedMotion();
  const tabs = [{ id: ALL, label: "All", n: total }, ...skillGroups.map((g) => ({ id: g.id, label: g.label, n: g.items.length }))];

  return (
    <div className="glass sticky top-[calc(var(--nav-height)+0.75rem)] z-20 flex flex-col gap-2 rounded-2xl p-2 lg:flex-row lg:items-center">
      <label className="relative flex min-w-0 items-center lg:w-72 lg:shrink-0">
        <span className="sr-only">Search skills</span>
        <Search size={16} className="pointer-events-none absolute left-3.5 text-muted-foreground" />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills…"
          className="h-11 w-full rounded-xl border border-border/70 bg-background/50 pl-10 pr-16 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent/60 [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2 grid size-7 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-3 rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            /
          </kbd>
        )}
      </label>

      <div role="group" aria-label="Filter by layer" className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none]">
        {tabs.map((t) => {
          const on = t.id === layer;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={on}
              onClick={() => setLayer(t.id)}
              className={cn(
                "relative isolate inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-3.5 text-sm font-medium transition-colors",
                on ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {on && (
                <motion.span
                  layoutId="skill-layer-pill"
                  transition={reduce ? { duration: 0 } : spring.snappy}
                  className="absolute inset-0 -z-10 rounded-xl bg-accent shadow-[0_0_24px_-6px_var(--accent)]"
                />
              )}
              {t.label}
              <span className={cn("rounded-full px-1.5 font-mono text-[10px] tabular-nums", on ? "bg-accent-foreground/15" : "bg-muted")}>
                {t.n}
              </span>
            </button>
          );
        })}
      </div>

      <p className="hidden shrink-0 px-2 font-mono text-[11px] tabular-nums text-muted-foreground xl:block" aria-live="polite">
        {shown} / {total}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function GroupCard({
  id,
  index,
  items,
  query,
  selected,
  onPick,
  wide,
}: {
  id: string;
  index: number;
  items: SkillInfo[];
  query: string;
  selected: string;
  onPick: (name: string) => void;
  wide: boolean;
}) {
  const reduce = useReducedMotion();
  const group = skillGroups.find((g) => g.id === id)!;
  const Icon = SKILL_ICONS[id] ?? CodeIcon;
  const evidenced = items.filter((s) => s.evidence.length > 0).length;

  return (
    <motion.section
      layout
      initial={reduce ? false : { opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ ...spring.soft, delay: reduce ? 0 : index * 0.04 }}
      aria-labelledby={`layer-${id}`}
      className={cn("glass group/card relative flex flex-col overflow-hidden rounded-2xl p-6", wide && "md:col-span-2")}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-accent/30 bg-linear-to-br from-accent/20 via-accent/5 to-transparent text-accent">
            <Icon size={22} strokeWidth={1.75} trigger="self" />
          </span>
          <div className="min-w-0">
            <h3 id={`layer-${id}`} className="text-xl font-semibold tracking-tight">
              {group.label}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-accent">{PLAIN[id]}</p>
            <p className="mt-1 text-pretty text-sm text-muted-foreground">{group.description}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-border/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
          {items.length}
          {items.length !== group.items.length && <span className="text-muted-foreground/60">/{group.items.length}</span>}
        </span>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((s, i) => {
            const on = s.name === selected;
            const used = s.evidence.length > 0;
            return (
              <motion.li
                key={s.name}
                layout
                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 380, damping: 26, delay: reduce ? 0 : Math.min(i * 0.02, 0.2) }}
              >
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => onPick(s.name)}
                  title={used ? `Used in ${s.evidence.map((e) => productName(e.project.title)).join(", ")}` : "Listed on my resume"}
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm transition-[color,background-color,border-color,transform] duration-200 hover:-translate-y-0.5",
                    on
                      ? "border-accent bg-accent text-accent-foreground shadow-[0_0_24px_-6px_var(--accent)]"
                      : "border-border/70 bg-muted/40 text-foreground/80 hover:border-accent/60 hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-6 place-items-center rounded-full",
                      on ? "bg-accent-foreground/15" : "bg-background/60 text-foreground/80",
                    )}
                  >
                    <Logo name={s.name} size={13} />
                  </span>
                  <Highlight text={s.name} query={query} />
                  {used && (
                    <span
                      aria-label="used in a shipped product"
                      className={cn("size-1.5 rounded-full", on ? "bg-accent-foreground" : "bg-accent")}
                    />
                  )}
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <p className="mt-5 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{evidenced}</span> of {items.length} appear in shipped products
      </p>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */

function Inspector({ name, onPick, compact = false }: { name: string; onPick: (n: string) => void; compact?: boolean }) {
  const reduce = useReducedMotion();
  const s = skillByName.get(name);
  if (!s) return null;
  const paired = pairedWith(s, 6);

  return (
    <div className={cn(!compact && "glass rounded-3xl p-6")}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={s.name}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Skill inspector</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-accent/40 bg-accent/10 text-accent shadow-[0_0_40px_-12px_var(--accent)]">
              <Logo name={s.name} size={28} />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-xl font-semibold tracking-tight">{s.name}</h3>
              <p className="text-sm text-muted-foreground">
                {s.group.label} · <span className="text-accent">{PLAIN[s.group.id]}</span>
              </p>
            </div>
          </div>

          {s.atCurrentRole && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <BriefcaseIcon size={13} /> Part of my current role
            </p>
          )}

          <Block title="Where I've used it">
            {s.evidence.length ? (
              <ul className="flex flex-col gap-2">
                {s.evidence.map(({ project, as, kind }, i) => (
                  <motion.li
                    key={project.id}
                    initial={reduce ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring.soft, delay: 0.05 + i * 0.06 }}
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3 transition-colors hover:border-accent/50"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{productName(project.title)}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {kind === "stack" ? <>as {as}</> : <>described in the write-up</>} · {project.period}
                        </span>
                      </span>
                      <span className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent">
                        →
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-border/70 p-3 text-sm text-muted-foreground">
                Listed on my resume. Not tied to a specific product write-up yet.
              </p>
            )}
          </Block>

          {paired.length > 0 && (
            <Block title="Often paired with">
              <ul className="flex flex-wrap gap-1.5">
                {paired.map((p) => (
                  <li key={p.name}>
                    <button
                      type="button"
                      onClick={() => onPick(p.name)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-1 text-xs text-foreground/80 transition-colors hover:border-accent/50 hover:text-foreground"
                    >
                      <Logo name={p.name} size={11} />
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}
