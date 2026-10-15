"use client";

import { useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import {
  AwardIcon,
  BriefcaseIcon,
  GlobeIcon,
  GraduationCapIcon,
  LayersIcon,
  ShieldIcon,
  SparklesIcon,
  ZapIcon,
  type AnimatedIconProps,
} from "@/components/icons/AnimatedIcons";
import { education, certifications } from "@/lib/data/education";
import { experiences } from "@/lib/data/experiences";
import { projects } from "@/lib/data/projects";
import { profile } from "@/lib/data/profile";
import { useIsMobile } from "@/lib/hooks";
import { spring } from "@/lib/motion";
import { CountUp } from "@/components/motion/Effects";
import { cn } from "@/lib/utils";

type Milestone = {
  when: string;
  title: string;
  body: string;
  icon: ComponentType<AnimatedIconProps>;
  tag: "Education" | "Career" | "Project" | "Now";
  href?: string;
};

const project = (id: string) => projects.find((p) => p.id === id)!;

function buildMilestones(): Milestone[] {
  const degree = education[0];
  const cert = certifications[0];
  const job = experiences[0];
  const [start, end] = degree.period.split(" – ");
  const pams = project("pams-legacy");
  const anchor = project("anchor");
  const ecom = project("pams-ecommerce");
  const crm = project("crm");

  return [
    { when: start, tag: "Education", icon: GraduationCapIcon, title: "Started a B.E. in Computer Science", body: `${degree.institution}, ${degree.location.split(",")[0]}.` },
    { when: end, tag: "Education", icon: GraduationCapIcon, title: `Graduated with ${degree.score}`, body: "Bachelor of Engineering, Computer Science and Engineering." },
    { when: cert.period, tag: "Education", icon: AwardIcon, title: "Certified in React & Spring Boot", body: `${cert.issuer}: the two stacks I now ship with every day.` },
    { when: job.period.split(" – ")[0], tag: "Career", icon: BriefcaseIcon, title: `Joined ${job.company.split(" ")[0]} as a ${job.role}`, body: "Maritime enterprise software used by shipping lines and port agents." },
    { when: pams.period, tag: "Project", icon: ShieldIcon, title: "PAMS: port-agency operations", body: "Rate requests, tariffs, invoicing and compliance, with EDI batches automating manifests.", href: `/projects/${pams.id}` },
    { when: anchor.period, tag: "Project", icon: GlobeIcon, title: "ANCHOR: architected ~80% of the frontend", body: "40+ screens on one shared foundation, plus ERAX, an assistant that answers questions with charts.", href: `/projects/${anchor.id}` },
    { when: ecom.period, tag: "Project", icon: LayersIcon, title: "PAMS E-Commerce: customer self-service", body: "Shipping customers book, file instructions and track invoices themselves, under multiple brands.", href: `/projects/${ecom.id}` },
    { when: crm.period, tag: "Project", icon: SparklesIcon, title: "CRM: AI that removed manual data entry", body: "Leads captured from voice notes and photos, in a multi-tenant sales platform.", href: `/projects/${crm.id}` },
    { when: "Today", tag: "Now", icon: ZapIcon, title: profile.availability, body: "Tell me what you're building. I'd like to hear about it." },
  ];
}

const TAG_STYLE: Record<Milestone["tag"], string> = {
  Education: "border-border/70 text-muted-foreground",
  Career: "border-accent/40 bg-accent/10 text-accent",
  Project: "border-border/70 text-foreground/80",
  Now: "border-accent bg-accent text-accent-foreground",
};

/** Career timeline whose spine draws itself as you scroll. */
export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  // Phones start with the five formative milestones; the rest expand on demand.
  const [showAll, setShowAll] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  const milestones = buildMilestones();

  return (
    <>
    <ol ref={ref} className="relative flex flex-col gap-6 lg:gap-0">
      {/* Spine */}
      <div aria-hidden className="absolute bottom-2 left-5 top-2 w-px bg-border lg:left-1/2">
        <motion.div style={{ scaleY: reduce ? 1 : fill }} className="absolute inset-0 origin-top bg-linear-to-b from-accent via-accent to-accent/40" />
      </div>

      {milestones.map((m, i) => {
        const right = i % 2 === 1;
        const Icon = m.icon;
        return (
          // On large screens alternate rows overlap, so the two columns interleave.
          <li
            key={m.title}
            id={`milestone-${i}`}
            className={cn(
              "relative grid scroll-mt-32 grid-cols-[2.5rem_1fr] gap-4 lg:grid-cols-2 lg:gap-16 lg:py-4",
              i > 0 && "lg:-mt-16",
              i >= 5 && !showAll && "max-lg:hidden",
            )}
          >
            {/* Node */}
            <motion.span
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -35% 0px" }}
              transition={spring.bouncy}
              className={cn(
                "relative z-10 grid size-10 place-items-center self-start rounded-full border-2 bg-background lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2",
                m.tag === "Now" ? "border-accent bg-accent text-accent-foreground shadow-[0_0_24px_var(--accent)]" : "border-accent/60 text-accent",
              )}
            >
              <Icon size={17} trigger="self" />
            </motion.span>

            <motion.div
              initial={reduce ? false : isMobile ? { opacity: 0, y: 24 } : { opacity: 0, x: right ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={spring.soft}
              className={cn("lg:col-start-1 lg:text-right", right && "lg:col-start-2 lg:text-left")}
            >
              <MilestoneCard m={m} align={right ? "left" : "right"} />
            </motion.div>
          </li>
        );
      })}
    </ol>
    {!showAll && (
      <button
        type="button"
        onClick={() => setShowAll(true)}
        className="glass-sm mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-4 text-sm font-semibold text-foreground/85 lg:hidden"
      >
        Show all {milestones.length} milestones
      </button>
    )}
    </>
  );
}

function MilestoneCard({ m, align }: { m: Milestone; align: "left" | "right" }) {
  const body = (
    <>
      <div className={cn("flex flex-wrap items-center gap-2", align === "right" && "lg:justify-end")}>
        <span className="font-mono text-xs text-accent">{m.when}</span>
        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", TAG_STYLE[m.tag])}>
          {m.tag}
        </span>
      </div>
      <h3 className="mt-2 text-balance text-lg font-semibold tracking-tight text-foreground sm:text-xl">{m.title}</h3>
      <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">{m.body}</p>
      {m.href && (
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          Case study <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      )}
    </>
  );

  const shell = cn(
    "group block rounded-2xl border p-5 transition-[border-color,background-color,transform] duration-300 sm:p-6",
    m.tag === "Now" ? "border-accent/50 bg-accent/[0.07] shadow-[0_0_40px_-18px_var(--accent)]" : "glass-sm hover:-translate-y-1 hover:border-accent/40",
  );

  return m.href ? (
    <Link href={m.href} className={shell}>
      {body}
    </Link>
  ) : (
    <div className={shell}>{body}</div>
  );
}

/* ------------------------------------------------------------------ */
/* Journey at a glance — header art that doubles as navigation.       */
/* ------------------------------------------------------------------ */

/** Milestones plotted on the overview, with their short labels. */
const KEY_POINTS = [
  { index: 0, short: "B.E. starts" },
  { index: 1, short: "Graduated" },
  { index: 3, short: "Solverminds" },
  { index: 5, short: "ANCHOR" },
  { index: 7, short: "CRM + AI" },
  { index: 8, short: "Today" },
] as const;

/** Rising path, in SVG units of a 300 × 200 viewBox. */
const POINTS = [
  [24, 172],
  [78, 146],
  [126, 128],
  [176, 92],
  [226, 66],
  [276, 28],
] as const;

/** Catmull-Rom through every point, as cubic Béziers. */
function smoothPath(pts: readonly (readonly [number, number])[]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const PATH = smoothPath(POINTS);

export function JourneyOverview() {
  const reduce = useReducedMotion();
  const milestones = buildMilestones();
  const [hover, setHover] = useState<number | null>(null);

  const counts = (["Education", "Career", "Project"] as const).map((tag) => ({
    tag,
    n: milestones.filter((m) => m.tag === tag).length,
  }));

  const jump = (index: number) =>
    document
      .getElementById(`milestone-${index}`)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });

  const active = hover !== null ? milestones[KEY_POINTS[hover].index] : null;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={spring.soft}
      className="glass relative overflow-hidden rounded-3xl p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Journey at a glance</p>
        <span className="rounded-full border border-border/70 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {milestones[0].when.split(" ").pop()} → Today
        </span>
      </div>

      <div className="relative mt-3 aspect-[3/2]">
        {/* Graph paper */}
        <div aria-hidden className="absolute inset-0 rounded-2xl bg-[linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_6%,transparent)_1px,transparent_1px)] [background-size:25px_25px] [mask-image:radial-gradient(ellipse_at_center,#000_50%,transparent_90%)]" />

        <svg aria-hidden viewBox="0 0 300 200" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <linearGradient id="journey-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area under the curve */}
          <motion.path
            d={`${PATH} L276 200 L24 200 Z`}
            fill="url(#journey-fill)"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1 }}
          />
          <path d={PATH} fill="none" strokeWidth={2} className="stroke-foreground/10" />
          <motion.path
            d={PATH}
            fill="none"
            strokeWidth={2.5}
            strokeLinecap="round"
            className="stroke-accent [filter:drop-shadow(0_0_6px_var(--accent))]"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
          />
          {/* Comet looping up the path */}
          {!reduce && (
            <circle r={4} className="fill-accent [filter:drop-shadow(0_0_6px_var(--accent))]">
              <animateMotion dur="4.5s" begin="2s" repeatCount="indefinite" path={PATH} keyTimes="0;1" keySplines="0.45 0 0.55 1" calcMode="spline" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="4.5s" begin="2s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>

        {/* Milestone dots */}
        {KEY_POINTS.map((k, i) => {
          const [x, y] = POINTS[i];
          const m = milestones[k.index];
          const now = m.tag === "Now";
          const below = i % 2 === 0 && i !== 0;
          return (
            <motion.button
              key={k.index}
              type="button"
              aria-label={`Jump to: ${m.title} (${m.when})`}
              onClick={() => jump(k.index)}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ...spring.bouncy, delay: 0.5 + i * 0.22 }}
              className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: `${(x / 300) * 100}%`, top: `${(y / 200) * 100}%` }}
            >
              <span
                className={cn(
                  "relative grid size-4 place-items-center rounded-full border-2 transition-transform duration-300 group-hover:scale-150",
                  now ? "border-accent bg-accent" : "border-accent bg-background",
                  hover === i && "scale-150",
                )}
              >
                {now && <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-70" />}
              </span>
              <span
                className={cn(
                  "pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-1.5 py-0.5 text-center font-mono text-[9.5px] leading-tight transition-colors",
                  below ? "top-6" : "bottom-6",
                  i === 0 && "left-0 translate-x-0",
                  i === KEY_POINTS.length - 1 && "left-auto right-0 translate-x-0",
                  hover === i || now ? "bg-accent text-accent-foreground" : "bg-card/90 text-muted-foreground",
                )}
              >
                <span className="block font-semibold">{k.short}</span>
                {m.when !== k.short && <span className="block opacity-80">{m.when.split(" – ")[0]}</span>}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Readout */}
      <div className="mt-4 flex min-h-[3.4rem] flex-col justify-center rounded-xl border border-border/60 bg-background/40 px-3 py-2">
        {active ? (
          <motion.p key={active.title} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-xs">
            <span className="font-mono text-accent">{active.when}</span>
            <span className="mt-0.5 block truncate font-semibold text-foreground">{active.title}</span>
          </motion.p>
        ) : (
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Tip:</span> click any point to jump to it in the timeline.
          </p>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2">
        {counts.map(({ tag, n }, i) => (
          <div key={tag} className="rounded-xl border border-border/60 px-3 py-2">
            <dd className="text-xl font-semibold tabular-nums tracking-tight">
              <CountUp to={n} duration={1 + i * 0.2} />
            </dd>
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {tag === "Project" ? "Products" : tag === "Career" ? "Role" : "Education"}
            </dt>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}
