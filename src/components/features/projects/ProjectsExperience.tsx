"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Maximize2, UserRound, X } from "lucide-react";
import { CountUp } from "@/components/motion/Effects";
import { ProjectPreview } from "@/components/features/home/ProjectPreviews";
import { TechLogo, logoForTech, monogramFor } from "@/components/icons/TechLogos";
import { LayersIcon } from "@/components/icons/AnimatedIcons";
import { projects, type Project } from "@/lib/data/projects";
import { getCaseStudy } from "@/lib/data/case-studies";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Derived data — every number and tag here is computed from          */
/* projects.ts / case-studies.ts, never typed in by hand.             */
/* ------------------------------------------------------------------ */

const text = (p: Project) => [p.description, ...p.highlights].join(" ");
const shortName = (p: Project) => p.title.split(" — ")[0];
const subtitle = (p: Project) => p.title.split(" — ")[1] ?? p.domain;

type Facet = { id: string; label: string; test: (p: Project) => boolean };

const FACETS: readonly Facet[] = [
  { id: "all", label: "All", test: () => true },
  { id: "maritime", label: "Maritime", test: (p) => /maritime/i.test(p.domain) },
  { id: "ai", label: "AI-powered", test: (p) => /\bAI\b|openai|chatbot/i.test(text(p)) },
  { id: "tenant", label: "Multi-tenant", test: (p) => /multi-tenant/i.test(text(p)) },
  { id: "react", label: "React stack", test: (p) => p.techStack.some((t) => /^(react|next)/i.test(t)) },
  { id: "javaee", label: "Java EE", test: (p) => p.techStack.includes("Java EE") },
];

const tagsFor = (p: Project) => FACETS.slice(1).filter((f) => f.test(p)).map((f) => f.label);

const STATS = [
  { to: projects.length, label: "Production products" },
  { to: projects.filter((p) => /maritime/i.test(p.domain)).length, label: "Serving maritime operators" },
  {
    to: new Set(projects.flatMap((p) => p.techStack.map((t) => t.replace(/\s+\d+(\.\d+)?$/, "")))).size,
    label: "Distinct technologies",
  },
  { to: Math.min(...projects.map((p) => Number(p.period.match(/\d{4}/)?.[0] ?? 9999))), label: "Shipping since", plain: true },
];

/** Timeline axis: first project year → "Now". */
const START = STATS[3].to;
const SPAN = 3; // years shown before "Now"
function span(p: Project) {
  const years = p.period.match(/\d{4}/g)?.map(Number) ?? [START];
  const from = (years[0] - START) / SPAN;
  const present = /present/i.test(p.period);
  const to = present ? 1 : (Math.min((years[1] ?? years[0]) + 1, START + SPAN) - START) / SPAN;
  return { from, to, present };
}

const noop = () => () => {};
const useIsClient = () => useSyncExternalStore(noop, () => true, () => false);

function Logo({ name, size = 14 }: { name: string; size?: number }) {
  return <TechLogo name={logoForTech(name)} fallback={monogramFor(name)} size={size} />;
}

/* ------------------------------------------------------------------ */

export function ProjectsExperience() {
  const [facet, setFacet] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const gridRef = useRef<HTMLElement>(null);

  const list = projects.filter(FACETS.find((f) => f.id === facet)!.test);
  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((id: string) => setOpen(id), []);

  const jumpTo = (id: string) => {
    setFacet("all");
    requestAnimationFrame(() =>
      document.getElementById(`project-${id}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }),
    );
  };

  return (
    <LayoutGroup>
      <Hero onPick={jumpTo} />

      {/* Numbers */}
      <section className="shell relative pt-14">
        <dl className="glass grid grid-cols-2 overflow-hidden rounded-2xl lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "p-6 sm:p-8",
                i % 2 === 1 && "border-l border-border/60",
                i >= 2 && "border-t border-border/60 lg:border-t-0",
                i === 2 && "lg:border-l",
              )}
            >
              <dd className="text-4xl font-semibold tracking-tight text-gradient sm:text-5xl">
                {s.plain ? s.to : <CountUp to={s.to} />}
              </dd>
              <dt className="mt-2 text-sm text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Gallery */}
      <section id="projects" ref={gridRef} className="shell relative scroll-mt-24 py-16 sm:py-24">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">The work, up close.</h2>
            <p className="mt-2 max-w-xl text-pretty text-muted-foreground">
              Filter by what you care about, then open a quick view for the challenge, what I did, and the impact.
            </p>
          </div>
          <div role="group" aria-label="Filter projects" className="glass flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none]">
            {FACETS.map((f) => {
              const on = f.id === facet;
              const n = projects.filter(f.test).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFacet(f.id)}
                  className={cn(
                    "relative isolate inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
                    on ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="project-facet"
                      transition={reduce ? { duration: 0 } : spring.snappy}
                      className="absolute inset-0 -z-10 rounded-full bg-accent shadow-[0_0_24px_-6px_var(--accent)]"
                    />
                  )}
                  {f.label}
                  <span className={cn("rounded-full px-1.5 font-mono text-[10px]", on ? "bg-accent-foreground/15" : "bg-muted")}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.ul layout className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <ProjectTile key={p.id} project={p} index={projects.indexOf(p)} order={i} onOpen={() => setOpen(p.id)} hidden={open === p.id} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </section>

      <QuickView id={open} list={list} onClose={close} onMove={move} />
    </LayoutGroup>
  );
}

/* ------------------------------------------------------------------ */
/* Hero with the project timeline                                     */
/* ------------------------------------------------------------------ */

function Hero({ onPick }: { onPick: (id: string) => void }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<string | null>(null);
  const ticks = [...Array.from({ length: SPAN }, (_, k) => String(START + k)), "Now"];
  const hovered = projects.find((p) => p.id === hover);

  return (
    <section aria-labelledby="projects-title" className="shell relative pt-[max(6rem,calc(env(safe-area-inset-top)+4.5rem))] lg:pt-40">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] xl:gap-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.soft}
          className="flex flex-col items-start gap-6"
        >
          <p className="glass-sm inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <LayersIcon size={14} trigger="mount" /> Projects
          </p>
          <h1 id="projects-title" className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Enterprise platforms, <span className="text-gradient">end-to-end</span>.
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {projects.length} production systems I&apos;ve architected and shipped, each framed in the real maritime and
            enterprise domain it serves, with the stack and the architectural choices that mattered.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring.soft, delay: 0.15 }}
          className="glass rounded-3xl p-5 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Timeline</p>
            <p className="font-mono text-[10px] text-muted-foreground">click a bar to jump</p>
          </div>

          <div className="relative mt-5">
            {/* Year grid */}
            <div aria-hidden className="absolute inset-y-0 left-[7.5rem] right-0">
              {ticks.map((t, k) => (
                <span key={t} className="absolute inset-y-0 border-l border-dashed border-border/60" style={{ left: `${(k / SPAN) * 100}%` }} />
              ))}
              <span className="absolute inset-y-0 right-0 w-px bg-accent/60 shadow-[0_0_10px_var(--accent)]" />
            </div>

            <ul className="relative flex flex-col gap-3">
              {projects.map((p, i) => {
                const { from, to, present } = span(p);
                const on = hover === p.id;
                return (
                  <li key={p.id} className="flex items-center gap-3">
                    <span className={cn("w-[6.75rem] shrink-0 text-right text-xs font-medium leading-tight transition-colors", on ? "text-foreground" : "text-muted-foreground")}>
                      {shortName(p)}
                    </span>
                    <div className="relative h-8 flex-1">
                      <motion.button
                        type="button"
                        aria-label={`${shortName(p)}, ${p.period}. Jump to project`}
                        onClick={() => onPick(p.id)}
                        onPointerEnter={() => setHover(p.id)}
                        onPointerLeave={() => setHover(null)}
                        onFocus={() => setHover(p.id)}
                        onBlur={() => setHover(null)}
                        initial={reduce ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 + i * 0.12 }}
                        style={{ left: `${from * 100}%`, width: `${(to - from) * 100}%`, originX: 0 }}
                        className={cn(
                          "absolute inset-y-0 flex items-center justify-end overflow-hidden rounded-lg px-2 font-mono text-[10px] transition-[box-shadow,filter] duration-300",
                          on ? "shadow-[0_0_24px_-4px_var(--accent)] brightness-110" : "",
                        )}
                      >
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-linear-to-r from-accent/35 to-accent"
                          style={{ opacity: hover && !on ? 0.4 : 1 }}
                        />
                        {present && (
                          <motion.span
                            aria-hidden
                            className="absolute inset-y-0 right-0 w-8 bg-linear-to-r from-transparent to-white/40"
                            animate={reduce ? undefined : { opacity: [0.2, 0.8, 0.2] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                          />
                        )}
                        <span className="relative font-semibold text-accent-foreground">{present ? "live" : ""}</span>
                      </motion.button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Axis */}
            <div className="relative ml-[7.5rem] mt-3 h-4">
              {ticks.map((t, k) => (
                <span
                  key={t}
                  className={cn("absolute -translate-x-1/2 font-mono text-[10px]", t === "Now" ? "translate-x-[-100%] text-accent" : "text-muted-foreground")}
                  style={{ left: `${(k / SPAN) * 100}%` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 min-h-[2.75rem] rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-xs">
            {hovered ? (
              <motion.p key={hovered.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                <span className="font-mono text-accent">{hovered.period}</span> · {hovered.domain}
                <span className="mt-0.5 block truncate font-semibold text-foreground">{hovered.tagline}</span>
              </motion.p>
            ) : (
              <p className="text-muted-foreground">
                Overlapping bars are products I worked on in parallel. <span className="text-foreground">Live</span> ones are still in production.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ProjectTile({
  project: p,
  index,
  order,
  onOpen,
  hidden,
}: {
  project: Project;
  index: number;
  order: number;
  onOpen: () => void;
  hidden: boolean;
}) {
  const reduce = useReducedMotion();
  const cs = getCaseStudy(p.id)?.study;
  const tags = tagsFor(p);

  return (
    <motion.li
      id={`project-${p.id}`}
      layout
      initial={reduce ? false : { opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ ...spring.soft, delay: reduce ? 0 : order * 0.06 }}
      className="scroll-mt-28"
    >
      <article className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--accent)_45%,transparent)]">
        {/* Preview */}
        <motion.div
          layoutId={`preview-${p.id}`}
          className={cn("relative border-b border-border/60 bg-background/30", hidden && "opacity-0")}
        >
          <div aria-hidden className="aspect-[4/3] sm:aspect-[16/10]">
            {/* Scaled up on large cards so the vignette fills the frame. */}
            <div className="size-full lg:[zoom:1.15] xl:[zoom:1.3]">
              <ProjectPreview id={p.id} />
            </div>
          </div>
          <button
            type="button"
            onClick={onOpen}
            className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium text-foreground/90 opacity-100 backdrop-blur transition-[opacity,border-color] duration-300 hover:border-accent/60 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
          >
            <Maximize2 size={12} /> Quick view
          </button>
        </motion.div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            <span className="font-mono text-muted-foreground">{String(index + 1).padStart(2, "0")} · </span>
            {p.domain}
          </p>
          <h3 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {shortName(p)} <span className="text-muted-foreground/70">· {subtitle(p)}</span>
          </h3>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{p.period}</p>
          <p className="mt-4 text-pretty text-base leading-relaxed text-foreground/85">{p.tagline}</p>

          {cs && (
            <p className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-xs text-foreground/85">
              <UserRound size={13} className="text-accent" />
              {cs.role}
            </p>
          )}

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <li key={t} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent">
                {t}
              </li>
            ))}
          </ul>

          {cs && cs.stats.length > 0 && (
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-border/60 pt-5">
              {cs.stats.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <dd className="text-2xl font-semibold tracking-tight">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </dd>
                  <dt className="text-xs text-muted-foreground">{s.label}</dt>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-7">
            <ul className="flex items-center" aria-label="Key technologies">
              {p.techStack.slice(0, 5).map((t, k) => (
                <li
                  key={t}
                  title={t}
                  className="-ml-1.5 grid size-8 place-items-center rounded-full border border-border/70 bg-card text-foreground/80 transition-[margin] duration-300 first:ml-0 group-hover:ml-0.5 group-hover:first:ml-0"
                  style={{ zIndex: 5 - k }}
                >
                  <Logo name={t} size={14} />
                  <span className="sr-only">{t}</span>
                </li>
              ))}
              {p.techStack.length > 5 && (
                <li className="ml-2 font-mono text-[11px] text-muted-foreground">+{p.techStack.length - 5}</li>
              )}
            </ul>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpen}
                className="rounded-full border border-border/70 px-4 py-2 text-sm font-medium transition-colors hover:border-accent/50"
              >
                Quick view
              </button>
              <Link
                href={`/projects/${p.slug ?? p.id}`}
                data-track="case_study_open"
                data-track-label={p.id}
                className="group/cta inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
              >
                Case study
                <ArrowRight size={14} className="transition-transform duration-300 group-hover/cta:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/* Quick view dialog                                                  */
/* ------------------------------------------------------------------ */

function QuickView({
  id,
  list,
  onClose,
  onMove,
}: {
  id: string | null;
  list: readonly Project[];
  onClose: () => void;
  onMove: (id: string) => void;
}) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const p = projects.find((x) => x.id === id) ?? null;
  const cs = p ? getCaseStudy(p.id)?.study : null;
  const at = p ? list.findIndex((x) => x.id === p.id) : -1;
  const prev = at > 0 ? list[at - 1] : null;
  const next = at >= 0 && at < list.length - 1 ? list[at + 1] : null;

  // Focus, scroll lock, and keyboard: Esc closes, ←/→ step through projects.
  useEffect(() => {
    if (!p) return;
    returnTo.current ??= document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && next) onMove(next.id);
      else if (e.key === "ArrowLeft" && prev) onMove(prev.id);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [p, prev, next, onClose, onMove]);

  useEffect(() => {
    if (p) return;
    returnTo.current?.focus({ preventScroll: true });
    returnTo.current = null;
  }, [p]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {p && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" aria-label="Close quick view" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-background/70 backdrop-blur-md" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
            initial={reduce ? false : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: 30, opacity: 0 }}
            transition={spring.soft}
            className="relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-glass-lg sm:rounded-3xl"
          >
            {/* Header bar */}
            <div className="flex items-center gap-3 border-b border-border/60 px-5 py-3">
              <span className="font-mono text-xs text-muted-foreground">
                {String(projects.indexOf(p) + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
              <span className="truncate text-sm font-semibold">{shortName(p)}</span>
              <div className="ml-auto flex items-center gap-1.5">
                <NavButton label="Previous project" disabled={!prev} onClick={() => prev && onMove(prev.id)}>
                  <ArrowLeft size={14} />
                </NavButton>
                <NavButton label="Next project" disabled={!next} onClick={() => next && onMove(next.id)}>
                  <ArrowRight size={14} />
                </NavButton>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close quick view"
                  className="ml-1 grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={p.id}
                  initial={reduce ? false : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: -24 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
                >
                  {/* Left: preview + facts */}
                  <div className="border-b border-border/60 p-5 sm:p-7 lg:border-b-0 lg:border-r">
                    <motion.div layoutId={`preview-${p.id}`} className="overflow-hidden rounded-2xl border border-border/60 bg-background/30">
                      <div aria-hidden className="aspect-[4/3]">
                        <ProjectPreview id={p.id} />
                      </div>
                    </motion.div>
                    <p className="mt-2 text-center text-[11px] text-muted-foreground/70">Illustrative preview. Not real customer data.</p>

                    <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">{p.domain}</p>
                    <h2 id="quick-view-title" className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                      {p.title}
                    </h2>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{p.period}</p>
                    {cs && (
                      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-xs">
                        <UserRound size={13} className="text-accent" /> {cs.role}
                      </p>
                    )}

                    <Block title="Stack">
                      <ul className="flex flex-wrap gap-1.5">
                        {p.techStack.map((t) => (
                          <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-1 text-xs text-foreground/85">
                            <Logo name={t} size={12} /> {t}
                          </li>
                        ))}
                      </ul>
                    </Block>
                  </div>

                  {/* Right: story */}
                  <div className="p-5 sm:p-7">
                    {cs ? (
                      <>
                        <Block title="The challenge" first>
                          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{cs.problem}</p>
                        </Block>
                        <Block title="What I did">
                          <ol className="flex flex-col gap-3">
                            {cs.approach.map((a, i) => (
                              <motion.li
                                key={a.title}
                                initial={reduce ? false : { opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ ...spring.soft, delay: 0.1 + i * 0.06 }}
                                className="flex gap-3"
                              >
                                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent/15 font-mono text-[10px] font-semibold text-accent">
                                  {i + 1}
                                </span>
                                <span>
                                  <span className="block text-sm font-semibold">{a.title}</span>
                                  <span className="mt-0.5 block text-pretty text-sm leading-relaxed text-muted-foreground">{a.body}</span>
                                </span>
                              </motion.li>
                            ))}
                          </ol>
                        </Block>
                        <Block title="Impact">
                          <ul className="flex flex-col gap-2">
                            {cs.impact.map((line) => (
                              <li key={line} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
                                <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                                  <Check size={10} strokeWidth={3} />
                                </span>
                                {line}
                              </li>
                            ))}
                          </ul>
                        </Block>
                        <Block title="Architecture">
                          <div className="flex flex-col gap-1.5">
                            {cs.architecture.map((layer, i) => (
                              <motion.div
                                key={layer.label}
                                initial={reduce ? false : { opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ ...spring.soft, delay: 0.15 + i * 0.07 }}
                                className="grid grid-cols-[6.5rem_1fr] items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2"
                              >
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">{layer.label}</span>
                                <span className="text-xs text-foreground/80">{layer.items.join(" · ")}</span>
                              </motion.div>
                            ))}
                          </div>
                        </Block>
                      </>
                    ) : (
                      <Block title="Highlights" first>
                        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                          {p.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      </Block>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/projects/${p.slug ?? p.id}`}
                        onClick={onClose}
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background"
                      >
                        Read the full case study <ArrowRight size={15} />
                      </Link>
                      <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">← → to browse · Esc to close</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function NavButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Block({ title, children, first = false }: { title: string; children: ReactNode; first?: boolean }) {
  return (
    <div className={first ? "" : "mt-7"}>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}
