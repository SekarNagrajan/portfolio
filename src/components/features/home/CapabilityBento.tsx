"use client";

import { useRef, type ComponentType, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Lock, Server, ShieldCheck, Sparkles } from "lucide-react";
import { SpotlightCard } from "@/components/motion/Effects";
import { GlassChip, GlassIconBadge } from "@/components/ui/glass";
import {
  CodeIcon,
  DatabaseIcon,
  ServerIcon,
  ShieldIcon,
  SparklesIcon,
  ZapIcon,
  type AnimatedIconProps,
} from "@/components/icons/AnimatedIcons";
import { cn } from "@/lib/utils";

type Capability = {
  title: string;
  /** What it means for the business — the line a recruiter reads. */
  plain: string;
  body: string;
  icon: ComponentType<AnimatedIconProps>;
  tags: readonly string[];
  span: string;
  Visual: ComponentType<{ live: boolean }>;
};

const CAPABILITIES: readonly Capability[] = [
  {
    title: "Frontend architecture",
    plain: "Apps that stay fast and consistent as they grow.",
    body: "App shells, RBAC with module gating, and reusable DataTable / transaction UI across 40+ lazy-loaded enterprise screens.",
    icon: CodeIcon,
    tags: ["React 19", "TanStack Router", "React Query", "AG Grid"],
    span: "md:col-span-2 xl:col-span-4",
    Visual: ScreensVisual,
  },
  {
    title: "Backend services",
    plain: "Reliable, secure services behind every screen.",
    body: "Spring Boot services on Java 21 over multi-datasource SQL Server.",
    icon: ServerIcon,
    tags: ["Spring Boot 4", "JPA", "REST"],
    span: "xl:col-span-2",
    Visual: RequestsVisual,
  },
  {
    title: "AI in the workflow",
    plain: "Automation that removes repetitive manual work.",
    body: "Voice-to-Text, Image-to-Lead, and NL→SQL chatbots integrated into existing product flows.",
    icon: SparklesIcon,
    tags: ["OpenAI", "Cloud Vision", "N8N"],
    span: "xl:col-span-2",
    Visual: AiVisual,
  },
  {
    title: "Data & integration",
    plain: "Clean, connected data across systems.",
    body: "Stored procedures, indexing, EDI batch pipelines, and document OCR at operational scale.",
    icon: DatabaseIcon,
    tags: ["SQL Server", "EDI", "Redis"],
    span: "xl:col-span-2",
    Visual: SyncVisual,
  },
  {
    title: "Security & tenancy",
    plain: "Each customer sees only their own data and brand.",
    body: "Per-tenant branding, LDAP / JWT auth, and agency-level isolation.",
    icon: ShieldIcon,
    tags: ["RBAC", "JWT", "LDAP"],
    span: "xl:col-span-2",
    Visual: TenantsVisual,
  },
  {
    title: "Performance & craft",
    plain: "Fast, accessible experiences for every user.",
    body: "Core Web Vitals budgets, compositor-friendly motion, keyboard-first accessibility, and progressive enhancement by default.",
    icon: ZapIcon,
    tags: ["CWV", "a11y", "Motion"],
    span: "md:col-span-2 xl:col-span-6",
    Visual: KeyboardVisual,
  },
];

/** Capabilities bento — every card carries a small looping vignette of the work. */
export function CapabilityBento() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
      {CAPABILITIES.map((c, i) => (
        <CapabilityCard key={c.title} capability={c} index={i} />
      ))}
    </div>
  );
}

function CapabilityCard({ capability: c, index }: { capability: Capability; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const wide = c.span.includes("xl:col-span-4") || c.span.includes("xl:col-span-6");

  return (
    <SpotlightCard index={index} className={cn("flex flex-col", c.span)}>
      <div ref={ref} className={cn("flex h-full flex-col gap-6 p-6 sm:p-7", wide && "xl:flex-row xl:items-stretch xl:gap-8")}>
        <div
          aria-hidden
          className={cn(
            "relative h-36 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-background/30",
            wide && "xl:order-2 xl:h-auto xl:w-[46%]",
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_8%,transparent)_1px,transparent_1px)] [background-size:14px_14px]" />
          <c.Visual live={inView && !reduce} />
        </div>

        <div className="flex flex-1 flex-col justify-between gap-5">
          <div className="flex items-start gap-4">
            <GlassIconBadge size="sm">
              <c.icon size={22} strokeWidth={1.75} />
            </GlassIconBadge>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{c.title}</h3>
              <p className="mt-1 text-pretty text-sm font-medium text-accent">{c.plain}</p>
              <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {c.tags.map((t) => (
              <li key={t}>
                <GlassChip size="sm">{t}</GlassChip>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SpotlightCard>
  );
}

/* ------------------------------------------------------------------ */
/* Vignettes. Each is decorative and pauses off-screen.               */
/* ------------------------------------------------------------------ */

const loop = (live: boolean, duration: number, delay = 0) =>
  live ? { duration, delay, repeat: Infinity, ease: "easeInOut" as const } : { duration: 0 };

function Centre({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("absolute inset-0 flex items-center justify-center p-4", className)}>{children}</div>;
}

/** 40+ screens light up in a wave. */
function ScreensVisual({ live }: { live: boolean }) {
  return (
    <Centre>
      <div className="grid grid-cols-8 gap-1.5 xl:gap-2.5">
        {Array.from({ length: 24 }, (_, i) => {
          const col = i % 8;
          const row = Math.floor(i / 8);
          return (
            <motion.span
              key={i}
              className="relative flex h-7 w-9 flex-col gap-0.5 rounded-[5px] border border-border/70 bg-card p-1 xl:h-11 xl:w-14 xl:gap-1 xl:rounded-md xl:p-1.5"
              animate={live ? { y: [0, -3, 0] } : undefined}
              transition={loop(live, 2.4, (col + row) * 0.12)}
            >
              <motion.span
                className="absolute -inset-px rounded-[inherit] ring-1 ring-accent"
                initial={{ opacity: 0 }}
                animate={live ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                transition={loop(live, 2.4, (col + row) * 0.12)}
              />
              <span className="h-0.5 w-3/4 rounded-full bg-foreground/25" />
              <span className="h-0.5 w-1/2 rounded-full bg-foreground/15" />
              <span className="mt-auto h-1.5 w-full rounded-sm bg-accent/25" />
            </motion.span>
          );
        })}
      </div>
      <span className="absolute bottom-2 right-3 font-mono text-[10px] text-muted-foreground">40+ screens</span>
    </Centre>
  );
}

/** Requests pass a security check into the service. */
function RequestsVisual({ live }: { live: boolean }) {
  return (
    <Centre className="justify-between px-6">
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-5 w-14 rounded-md border border-border/70 bg-card" />
        ))}
      </div>
      <div className="relative h-full flex-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]"
            animate={live ? { left: ["0%", "100%"], opacity: [0, 1, 1, 0] } : { left: "50%" }}
            transition={live ? { duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: "linear" } : { duration: 0 }}
          />
        ))}
        <span className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent/50 bg-card text-accent">
          <ShieldCheck size={16} />
        </span>
      </div>
      <span className="grid size-14 place-items-center rounded-xl border border-border/70 bg-card text-foreground/80">
        <Server size={22} />
      </span>
    </Centre>
  );
}

/** A voice waveform becomes written text. */
function AiVisual({ live }: { live: boolean }) {
  return (
    <Centre className="gap-4">
      <div className="flex h-12 items-center gap-[3px]">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.span
            key={i}
            className="h-full w-1 origin-center rounded-full bg-accent/70"
            animate={live ? { scaleY: [0.2, 0.35 + ((i * 41) % 60) / 100, 0.2] } : { scaleY: 0.4 }}
            transition={loop(live, 0.9, (i % 5) * 0.08)}
          />
        ))}
      </div>
      <motion.span
        className="grid size-8 place-items-center rounded-full bg-accent/15 text-accent"
        animate={live ? { rotate: [0, 15, -10, 0], scale: [1, 1.1, 1] } : undefined}
        transition={loop(live, 2.2)}
      >
        <Sparkles size={14} />
      </motion.span>
      <div className="flex w-20 flex-col gap-1.5">
        {[100, 80, 60].map((w, i) => (
          <motion.span
            key={i}
            className="h-1.5 rounded-full bg-foreground/25"
            animate={live ? { width: ["0%", `${w}%`, `${w}%`, "0%"] } : { width: `${w}%` }}
            transition={live ? { duration: 3, times: [0, 0.3, 0.85, 1], repeat: Infinity, delay: i * 0.2 } : { duration: 0 }}
          />
        ))}
      </div>
    </Centre>
  );
}

function Db({ label }: { label: string }) {
  return (
    <span className="flex flex-col items-center gap-1.5">
      <span className="relative h-14 w-11">
        {[0, 1, 2].map((r) => (
          <span key={r} className="absolute inset-x-0 h-4 rounded-[50%] border border-border/80 bg-card" style={{ top: r * 14 }} />
        ))}
      </span>
      <span className="font-mono text-[9px] text-muted-foreground">{label}</span>
    </span>
  );
}

/** Two systems exchange records. */
function SyncVisual({ live }: { live: boolean }) {
  return (
    <Centre className="justify-between px-8">
      <Db label="SQL" />
      <div className="relative mx-3 h-10 flex-1">
        {[0, 1].map((lane) => (
          <span key={lane} className="absolute inset-x-0 border-t border-dashed border-border" style={{ top: lane ? "70%" : "30%" }} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-3 -translate-y-1/2 rounded-sm bg-accent"
            style={{ top: i % 2 ? "70%" : "30%" }}
            animate={live ? { left: i % 2 ? ["100%", "0%"] : ["0%", "100%"], opacity: [0, 1, 1, 0] } : { left: "45%" }}
            transition={live ? { duration: 2, repeat: Infinity, delay: i * 0.5, ease: "linear" } : { duration: 0 }}
          />
        ))}
      </div>
      <Db label="EDI" />
    </Centre>
  );
}

/** Three tenants, each with its own brand, each locked to its own data. */
function TenantsVisual({ live }: { live: boolean }) {
  return (
    <Centre className="gap-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="relative flex h-20 w-16 flex-col gap-1 rounded-lg border border-border/70 bg-card p-1.5"
          animate={live ? { y: [0, -4, 0] } : undefined}
          transition={loop(live, 2.6, i * 0.3)}
          style={{ filter: `hue-rotate(${i * 70}deg)` }}
        >
          <span className="h-2 w-full rounded-sm bg-accent" />
          <span className="h-1 w-3/4 rounded-full bg-foreground/20" />
          <span className="h-1 w-1/2 rounded-full bg-foreground/15" />
          <motion.span
            className="absolute -bottom-2 -right-2 grid size-6 place-items-center rounded-full border border-border bg-background text-accent"
            animate={live ? { scale: [1, 1.15, 1] } : undefined}
            transition={loop(live, 2.6, i * 0.3 + 0.4)}
          >
            <Lock size={11} />
          </motion.span>
        </motion.span>
      ))}
    </Centre>
  );
}

/** A focus ring walks across controls, as a keyboard user would. */
function KeyboardVisual({ live }: { live: boolean }) {
  return (
    <Centre className="flex-col gap-4">
      <div className="relative flex gap-2">
        {["Search", "Filter", "Export", "Save"].map((l) => (
          <span key={l} className="w-14 rounded-lg border border-border/70 bg-card py-1.5 text-center text-[10px] text-muted-foreground">
            {l}
          </span>
        ))}
        <motion.span
          className="pointer-events-none absolute -inset-y-1 -left-1 w-16 rounded-xl ring-2 ring-accent"
          animate={live ? { x: [0, 64, 128, 192, 0] } : { x: 0 }}
          transition={live ? { duration: 4, repeat: Infinity, ease: [0.65, 0, 0.35, 1], times: [0, 0.25, 0.5, 0.75, 1] } : { duration: 0 }}
        />
      </div>
      <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
        <kbd className="rounded-md border border-border bg-card px-1.5 py-0.5">Tab</kbd>
        <span>to move</span>
        <kbd className="ml-2 rounded-md border border-border bg-card px-1.5 py-0.5">Enter</kbd>
        <span>to act</span>
      </div>
    </Centre>
  );
}
