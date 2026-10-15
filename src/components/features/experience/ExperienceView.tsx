"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Award, Building2, MapPin, Ship } from "lucide-react";
import { CountUp } from "@/components/motion/Effects";
import { TechLogo, logoForTech, monogramFor } from "@/components/icons/TechLogos";
import { BriefcaseIcon, DownloadIcon, MotionAnchor, hoverTrigger } from "@/components/icons/AnimatedIcons";
import { experiences, type Experience } from "@/lib/data/experiences";
import { projects } from "@/lib/data/projects";
import { spring } from "@/lib/motion";
import { ChipRail } from "@/components/ui/ChipRail";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Derived data — read from experiences.ts / projects.ts.             */
/* ------------------------------------------------------------------ */

const job = experiences[0];

/** Which product each achievement belongs to, by what the sentence names. */
const PRODUCT_RULES: readonly { id: string; label: string; test: RegExp }[] = [
  { id: "crm", label: "CRM", test: /\bCRM\b|Voice-to-Text|Image-to-Lead/ },
  { id: "anchor", label: "ANCHOR", test: /ANCHOR|EPDA|ERAX|VHS/ },
  { id: "pams-ecommerce", label: "PAMS E-Commerce", test: /PAMS E-Commerce/ },
  { id: "pams-legacy", label: "PAMS", test: /PAMS Legacy/ },
];

const KIND_RULES: readonly { label: string; test: RegExp }[] = [
  { label: "Architecture", test: /architect|shell|module gating/i },
  { label: "AI", test: /\bAI\b|OpenAI|Vision|chatbot/i },
  { label: "Security", test: /RBAC|role-based|LDAP/i },
  { label: "Backend", test: /backend|datasource|batch/i },
  { label: "Finance", test: /accounting|payment|invoice|EPDA/i },
];

type Achievement = { text: string; product: (typeof PRODUCT_RULES)[number]; kinds: string[] };

const ACHIEVEMENTS: readonly Achievement[] = job.achievements.map((text, i) => ({
  text,
  // Sentences that don't name a product continue the one before (e.g. "~20% backend on VHS").
  product: PRODUCT_RULES.find((r) => r.test.test(text)) ?? PRODUCT_RULES[Math.min(i, 1)],
  kinds: KIND_RULES.filter((k) => k.test.test(text)).map((k) => k.label),
}));

const family = (t: string) => t.replace(/\s+\d+(\.\d+)?$/, "").toLowerCase();

/** Role tools behind an achievement: named in the sentence, or in its product's stack. */
function toolsFor(a: Achievement): Set<string> {
  const stack = projects.find((p) => p.id === a.product.id)?.techStack.map(family) ?? [];
  const text = a.text.toLowerCase();
  return new Set(job.technologies.filter((t) => text.includes(family(t)) || stack.includes(family(t))));
}

/** Bold the numbers that carry weight: "~80%", "40+", "~20%". */
function Emphasis({ text }: { text: string }) {
  const parts = text.split(/(~?\d+%|\d+\+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^(~?\d+%|\d+\+)$/.test(part) ? (
          <strong key={i} className="font-semibold text-accent">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function startOf(period: string) {
  const [m, y] = period.split(" – ")[0].split(" ");
  return { month: MONTHS.indexOf(m), year: Number(y) };
}

/* ------------------------------------------------------------------ */

export function ExperienceView() {
  return (
    <>
      <Hero />
      <InsideTheRole />
      <Company />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero + live role card                                              */
/* ------------------------------------------------------------------ */

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="experience-title" className="shell relative pt-[max(6rem,calc(env(safe-area-inset-top)+4.5rem))] lg:pt-40">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:gap-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.soft}
          className="flex flex-col items-start gap-6"
        >
          <p className="glass-sm inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <BriefcaseIcon size={14} trigger="mount" /> Experience
          </p>
          <h1 id="experience-title" className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Shipping enterprise software for <span className="text-gradient">maritime operators</span>.
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">{job.summary}</p>
          <div className="flex flex-wrap items-center gap-3">
            <MotionAnchor
              href="/resume.pdf"
              download="Sekar_Nagarajan_Resume.pdf"
              data-track="cv_download"
              data-track-label="experience"
              {...hoverTrigger}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background active:scale-95"
            >
              <DownloadIcon size={16} /> Download CV
            </MotionAnchor>
            <Link
              href="/projects"
              className="group inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:border-accent/50"
            >
              See the products <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>

        <RoleCard role={job} />
      </div>
    </section>
  );
}

function RoleCard({ role }: { role: Experience }) {
  const reduce = useReducedMotion();
  const [now, setNow] = useState<Date | null>(null);

  // Read the clock only in the browser, so the prerendered shell stays static.
  useEffect(() => {
    const id = window.setTimeout(() => setNow(new Date()), 0);
    return () => clearTimeout(id);
  }, []);

  const start = startOf(role.period);
  const months = now ? Math.max(0, (now.getFullYear() - start.year) * 12 + now.getMonth() - start.month) : null;
  const years = months !== null ? Math.floor(months / 12) : null;
  const rest = months !== null ? months % 12 : null;

  const stats = [
    { to: projects.length, label: "Products shipped" },
    { to: role.achievements.length, label: "Key achievements" },
    { to: role.technologies.length, label: "Technologies" },
  ];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ ...spring.soft, delay: 0.15 }}
      className="glass relative overflow-hidden rounded-3xl p-6 sm:p-7"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent" />
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          Current role
        </span>
        <span className="font-mono text-xs text-muted-foreground">{role.period}</span>
      </div>

      <h2 className="mt-5 text-2xl font-semibold tracking-tight">{role.role}</h2>
      <a href={role.companyUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-gradient font-medium underline-offset-4 hover:underline">
        {role.company}
      </a>
      <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin size={14} className="text-accent" /> {role.location}
      </p>

      {/* Tenure */}
      <div className="mt-6 rounded-2xl border border-border/60 bg-background/40 p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Time in role</p>
          <p className="text-lg font-semibold tabular-nums tracking-tight">
            {years === null ? "—" : (
              <>
                {years}
                <span className="text-sm font-normal text-muted-foreground"> yr </span>
                {rest}
                <span className="text-sm font-normal text-muted-foreground"> mo</span>
              </>
            )}
          </p>
        </div>
        <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-foreground/10">
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-accent/40 to-accent"
            initial={false}
            animate={{ width: now ? "100%" : "0%" }}
            transition={{ duration: reduce ? 0 : 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          />
          {!reduce && now && (
            <motion.span
              aria-hidden
              className="absolute inset-y-0 w-10 bg-linear-to-r from-transparent via-white/50 to-transparent"
              animate={{ left: ["-10%", "110%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          )}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>{role.period.split(" – ")[0]}</span>
          <span className="text-accent">Today</span>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border/60 px-3 py-2.5">
            <dd className="text-2xl font-semibold tracking-tight">
              <CountUp to={s.to} />
            </dd>
            <dt className="text-[10.5px] leading-tight text-muted-foreground">{s.label}</dt>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Inside the role — achievements by product, with live stack panel   */
/* ------------------------------------------------------------------ */

function InsideTheRole() {
  const reduce = useReducedMotion();
  const [product, setProduct] = useState<string>("all");
  const [hover, setHover] = useState<number | null>(null);
  // Touch has no hover: a tap selects and PERSISTS until tapped again.
  const [selected, setSelected] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const active = hover ?? selected;

  const tabs = [
    { id: "all", label: "All", n: ACHIEVEMENTS.length },
    ...PRODUCT_RULES.map((r) => ({ id: r.id, label: r.label, n: ACHIEVEMENTS.filter((a) => a.product.id === r.id).length })),
  ];
  const list = ACHIEVEMENTS.map((a, i) => ({ ...a, i })).filter((a) => product === "all" || a.product.id === product);
  const focusTools = new Set((active !== null ? [ACHIEVEMENTS[active]] : list).flatMap((a) => [...toolsFor(a)]));

  return (
    <section id="experience" className="shell relative scroll-mt-24 py-16 sm:py-24">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="glass-sm mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <Ship size={14} /> Inside the role
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">What I&apos;ve shipped at {job.company.split(" ")[0]}.</h2>
          <p className="mt-2 max-w-xl text-pretty text-muted-foreground">
            Pick a product to focus. Select an achievement to light up the tools behind it.
          </p>
        </div>
        <LayoutGroup id="exp-tabs">
          <ChipRail label="Filter by product" activeKey={product} className="glass max-w-full rounded-full p-1.5">
            {tabs.map((t) => {
              const on = t.id === product;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  data-active={on || undefined}
                  onClick={() => setProduct(t.id)}
                  className={cn(
                    "relative isolate inline-flex h-10 shrink-0 snap-start items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors pointer-coarse:h-11",
                    on ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="exp-tab"
                      transition={reduce ? { duration: 0 } : spring.snappy}
                      className="absolute inset-0 -z-10 rounded-full bg-accent shadow-[0_0_24px_-6px_var(--accent)]"
                    />
                  )}
                  {t.label}
                  <span className={cn("rounded-full px-1.5 font-mono text-[10px]", on ? "bg-accent-foreground/15" : "bg-muted")}>{t.n}</span>
                </button>
              );
            })}
          </ChipRail>
        </LayoutGroup>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        {/* Achievements */}
        <motion.ol layout className="relative flex flex-col gap-3">
          <span aria-hidden className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-border" />
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((a, order) => (
              <motion.li
                key={a.i}
                layout
                initial={reduce ? false : { opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ ...spring.soft, delay: reduce ? 0 : order * 0.05 }}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHover(a.i)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
                onFocus={() => setHover(a.i)}
                onBlur={() => setHover(null)}
                onClick={() => {
                  // Tapping also focuses the card, which sets `hover` — clear
                  // both on toggle-off or the highlight never releases on touch.
                  setSelected((cur) => (cur === a.i ? null : a.i));
                  setHover((cur) => (cur === a.i && selected === a.i ? null : cur));
                }}
                tabIndex={0}
                className={cn(
                  "glass-sm group relative flex cursor-pointer gap-4 rounded-2xl p-4 pr-5 outline-none transition-[border-color,background-color] duration-300 sm:p-5",
                  active === a.i ? "border-accent/50 bg-accent/[0.05]" : "hover:border-accent/30",
                  order >= 4 && !showAll && "hidden lg:flex",
                )}
              >
                <span
                  className={cn(
                    "relative z-10 grid size-7 shrink-0 place-items-center rounded-full border-2 bg-background font-mono text-[10px] font-semibold transition-colors duration-300",
                    active === a.i ? "border-accent bg-accent text-accent-foreground" : "border-accent/50 text-accent",
                  )}
                >
                  {String(a.i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link
                      href={`/projects/${a.product.id}`}
                      className="rounded-full border border-border/70 px-2 py-0.5 font-mono text-[10.5px] font-semibold text-foreground/85 transition-colors hover:border-accent/60 hover:text-accent pointer-coarse:min-h-8 pointer-coarse:px-2.5 pointer-coarse:py-1 pointer-coarse:text-xs pointer-coarse:inline-flex pointer-coarse:items-center"
                    >
                      {a.product.label}
                    </Link>
                    {a.kinds.map((k) => (
                      <span key={k} className="rounded-full bg-accent/10 px-2 py-0.5 text-[10.5px] font-medium text-accent">
                        {k}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-pretty leading-relaxed text-foreground/85">
                    <Emphasis text={a.text} />
                  </p>
                  {selected === a.i && (
                    <ul aria-label="Tools behind this" className="mt-3 flex flex-wrap gap-1.5 lg:hidden">
                      {[...toolsFor(a)].map((t) => (
                        <li
                          key={t}
                          className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs text-accent"
                        >
                          <TechLogo name={logoForTech(t)} fallback={monogramFor(t)} size={12} />
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
          {!showAll && list.length > 4 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="glass-sm mt-1 inline-flex min-h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold text-foreground/85 lg:hidden"
            >
              Show all {list.length} achievements
            </button>
          )}
        </motion.ol>

        {/* Stack panel — desktop companion; phones get the inline chips above */}
        <aside aria-label="Stack in this role" className="hidden lg:block">
          <div className="glass lg:sticky lg:top-[calc(var(--header-offset)+2rem)] rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Stack in this role</p>
              <span className="font-mono text-[10px] text-muted-foreground">{hover !== null ? `#${String(hover + 1).padStart(2, "0")}` : product === "all" ? "all" : "filtered"}</span>
            </div>
            <ul className="mt-4 grid grid-cols-3 gap-2">
              {job.technologies.map((t, i) => {
                const lit = focusTools.has(t);
                return (
                  <motion.li
                    key={t}
                    initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ ...spring.bouncy, delay: i * 0.03 }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-[border-color,background-color,opacity,transform] duration-300",
                      lit ? "-translate-y-0.5 border-accent/60 bg-accent/10" : "border-border/60 opacity-45",
                    )}
                  >
                    <span className={cn("transition-colors", lit ? "text-accent" : "text-foreground/80")}>
                      <TechLogo name={logoForTech(t)} fallback={monogramFor(t)} size={20} />
                    </span>
                    <span className="text-[10px] leading-tight text-foreground/80">{t}</span>
                  </motion.li>
                );
              })}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">Lit tools are used in the products behind the achievements shown.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The company — offices, segments, credentials                       */
/* ------------------------------------------------------------------ */

/** Office coordinates (lat, lon) for the schematic route map. */
const OFFICE_COORDS: Record<string, [number, number]> = {
  Chennai: [13.08, 80.27],
  Dubai: [25.2, 55.27],
  Singapore: [1.35, 103.82],
  Hamburg: [53.55, 9.99],
  "Yeongwol-gun": [37.18, 128.46],
  "Rio de Janeiro": [-22.9, -43.2],
};

// Equirectangular, cropped to the band the offices sit in.
const LON0 = -60, LON1 = 140, LAT0 = 65, LAT1 = -35;
const toMap = ([lat, lon]: [number, number]) => ({
  x: ((lon - LON0) / (LON1 - LON0)) * 400,
  y: ((LAT0 - lat) / (LAT0 - LAT1)) * 200,
});

function Company() {
  const facts = job.companyFacts;
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { margin: "-10% 0px" });
  if (!facts) return null;

  const hq = toMap(OFFICE_COORDS[facts.offices[0]]);
  const offices = facts.offices.filter((o) => OFFICE_COORDS[o]).map((o) => ({ name: o, ...toMap(OFFICE_COORDS[o]) }));
  const [total, split] = facts.products.split(" · ");

  return (
    <section id="company" className="shell relative pb-16 sm:pb-24">
      <div className="mb-8">
        <p className="glass-sm mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          <Building2 size={14} /> The company
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          The platform behind the work.
        </h2>
        <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">
          {job.company.split(" ")[0]} has built maritime enterprise systems since 2003. My products run alongside theirs, on one shared data layer.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Route map */}
        <div className="@container glass relative overflow-hidden rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Offices</p>
            <p className="font-mono text-[10px] text-muted-foreground">{offices.length} cities · schematic</p>
          </div>
          <div ref={mapRef} className="@container relative mt-3 aspect-[2/1]">
            <div aria-hidden className="absolute inset-0 rounded-2xl bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_14%,transparent)_1px,transparent_1.5px)] [background-size:12px_12px] [mask-image:radial-gradient(ellipse_at_center,#000_45%,transparent_85%)]" />
            <svg viewBox="0 0 400 200" className="absolute inset-0 size-full overflow-visible" aria-hidden>
              {offices.slice(1).map((o, i) => {
                const mx = (hq.x + o.x) / 2;
                const my = Math.min(hq.y, o.y) - 30 - Math.abs(hq.x - o.x) * 0.12;
                const d = `M${hq.x} ${hq.y} Q${mx} ${my} ${o.x} ${o.y}`;
                const lit = active === null || active === o.name || active === facts.offices[0];
                return (
                  <g key={o.name} style={{ opacity: lit ? 1 : 0.2, transition: "opacity 250ms" }}>
                    <motion.path
                      d={d}
                      fill="none"
                      strokeWidth={1.4}
                      strokeLinecap="round"
                      className="stroke-accent/70"
                      initial={reduce ? false : { pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.3 + i * 0.15 }}
                    />
                    {!reduce && mapInView && (
                      <circle r={2.2} className="fill-accent [filter:drop-shadow(0_0_4px_var(--accent))]">
                        <animateMotion dur={`${2.6 + i * 0.3}s`} begin={`${1.8 + i * 0.4}s`} repeatCount="indefinite" path={d} />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>
            {offices.map((o, i) => {
              const isHq = i === 0;
              const below = o.y < 70;
              return (
                <motion.button
                  key={o.name}
                  type="button"
                  aria-label={isHq ? `${o.name}, headquarters` : o.name}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(o.name)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
                  onClick={() => setActive((cur) => (cur === o.name ? null : o.name))}
                  onFocus={() => setActive(o.name)}
                  initial={reduce ? false : { scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...spring.bouncy, delay: isHq ? 0.1 : 1 + i * 0.15 }}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(o.x / 400) * 100}%`, top: `${(o.y / 200) * 100}%` }}
                >
                  <span className={cn("relative grid place-items-center rounded-full", isHq ? "size-4 bg-accent" : "size-3 border-2 border-accent bg-background")}>
                    {isHq && mapInView && <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />}
                  </span>
                  <span
                    className={cn(
                      "pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-medium transition-colors",
                      below ? "top-5" : "bottom-5",
                      active === o.name || isHq ? "bg-accent text-accent-foreground" : "bg-card/90 text-foreground/80",
                      // Narrow maps label only the HQ and whichever city is touched.
                      !isHq && active !== o.name && "hidden @md:block",
                    )}
                  >
                    {o.name}
                    {isHq && " · HQ"}
                  </span>
                </motion.button>
              );
            })}
          </div>
          {/* Small maps hide most labels — name the cities in a tappable list. */}
          <ul className="mt-3 flex flex-wrap gap-1.5 @md:hidden" aria-label="Office cities">
            {offices.map((o, i) => (
              <li key={o.name}>
                <button
                  type="button"
                  onClick={() => setActive((cur) => (cur === o.name ? null : o.name))}
                  className={cn(
                    "inline-flex min-h-8 items-center rounded-full border px-2.5 py-1 text-xs transition-colors",
                    active === o.name || (i === 0 && active === null)
                      ? "border-accent/60 bg-accent/10 text-accent"
                      : "border-border/70 text-foreground/80",
                  )}
                >
                  {o.name}
                  {i === 0 && " · HQ"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Facts */}
        <div className="flex flex-col gap-5">
          <div className="glass rounded-3xl p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Product suite</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight text-gradient">
              <CountUp to={Number(total.match(/\d+/)?.[0] ?? 0)} />
            </p>
            <p className="text-sm text-muted-foreground">{total.replace(/^\d+\s*/, "")} · {split}</p>
            <ProductBar spec={split} />
          </div>

          <div className="glass rounded-3xl p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Operators served</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {facts.segments.map((s, i) => (
                <motion.li
                  key={s}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring.soft, delay: i * 0.05 }}
                  className="rounded-full border border-border/70 px-3 py-1 text-sm text-foreground/85"
                >
                  {s}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-3xl p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Certified</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {facts.credentials.map((c, i) => (
                <motion.li
                  key={c}
                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...spring.bouncy, delay: i * 0.08 }}
                  className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-xs font-medium"
                >
                  <Award size={14} className="shrink-0 text-accent" />
                  {c}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/** "31 operational + 5 AI" as an animated split bar. */
function ProductBar({ spec }: { spec: string }) {
  const reduce = useReducedMotion();
  const parts = [...spec.matchAll(/(\d+)\s+([A-Za-z]+)/g)].map((m) => ({ n: Number(m[1]), label: m[2] }));
  const sum = parts.reduce((a, p) => a + p.n, 0) || 1;
  return (
    <div className="mt-4">
      <div className="flex h-2.5 gap-1 overflow-hidden rounded-full">
        {parts.map((p, i) => (
          <motion.span
            key={p.label}
            className={cn("h-full rounded-full", i === 0 ? "bg-accent/60" : "bg-accent")}
            initial={reduce ? false : { width: 0 }}
            whileInView={{ width: `${(p.n / sum) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.2 }}
          />
        ))}
      </div>
      <ul className="mt-2 flex gap-4 text-xs text-muted-foreground">
        {parts.map((p, i) => (
          <li key={p.label} className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", i === 0 ? "bg-accent/60" : "bg-accent")} />
            {p.n} {p.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
