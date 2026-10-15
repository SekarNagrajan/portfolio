"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { Check, Expand, FileText, Link2, Minimize, Printer } from "lucide-react";
import { CopyEmailButton } from "@/components/features/CopyEmailButton";
import {
  ArrowUpRightIcon,
  DownloadIcon,
  FileTextIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons/AnimatedIcons";
import { profile } from "@/lib/data/profile";
import { experiences } from "@/lib/data/experiences";
import { projects } from "@/lib/data/projects";
import { skillGroups } from "@/lib/data/skills";
import { education, certifications } from "@/lib/data/education";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const job = experiences[0];
const skillCount = skillGroups.reduce((n, g) => n + g.items.length, 0);

type Props = { src: string; filename: string };

export function ResumeExperience({ src, filename }: Props) {
  const [view, setView] = useState<"read" | "pdf">("read");
  const reduce = useReducedMotion();

  return (
    <>
      <Hero src={src} filename={filename} />

      <section id="resume" className="shell relative scroll-mt-24 pb-16 pt-12 sm:pb-24">
        {/* Phone / tablet: choose a view — embedded PDFs are unreliable on mobile. */}
        <LayoutGroup id="resume-view">
          <div role="tablist" aria-label="Resume view" className="glass mb-5 grid grid-cols-2 gap-1 rounded-full p-1.5 lg:hidden">
            {(
              [
                ["read", "Quick read"],
                ["pdf", "PDF"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={view === id}
                onClick={() => setView(id)}
                className={cn(
                  "relative isolate h-10 rounded-full text-sm font-medium transition-colors",
                  view === id ? "text-accent-foreground" : "text-muted-foreground",
                )}
              >
                {view === id && (
                  <motion.span
                    layoutId="resume-view-pill"
                    transition={reduce ? { duration: 0 } : spring.snappy}
                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                  />
                )}
                {label}
              </button>
            ))}
          </div>
        </LayoutGroup>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] xl:gap-8">
          <div className={cn(view !== "read" && "hidden lg:block")}>
            <QuickRead />
          </div>
          <div className={cn("lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)]", view !== "pdf" && "hidden lg:block")}>
            <PdfWindow src={src} filename={filename} />
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero({ src, filename }: Props) {
  const reduce = useReducedMotion();
  const inside = [
    { n: experiences.length, label: experiences.length === 1 ? "role" : "roles" },
    { n: projects.length, label: "products" },
    { n: skillCount, label: "skills" },
    { n: education.length + certifications.length, label: "credentials" },
  ];

  return (
    <section aria-labelledby="resume-title" className="shell relative pt-[max(6rem,calc(env(safe-area-inset-top)+4.5rem))] lg:pt-40">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:gap-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.soft}
          className="flex flex-col items-start gap-6"
        >
          <p className="glass-sm inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <FileTextIcon size={14} trigger="mount" /> Resume
          </p>
          <h1 id="resume-title" className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Latest CV, <span className="text-gradient">preview and download</span>.
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Skim the quick read for the highlights, check the full PDF alongside it, or share it with your hiring team in
            one click.
          </p>

          <ul className="flex flex-wrap gap-2">
            {inside.map((x, i) => (
              <motion.li
                key={x.label}
                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring.bouncy, delay: 0.25 + i * 0.07 }}
                className="glass-sm inline-flex items-baseline gap-1.5 rounded-full px-3.5 py-1.5 text-sm"
              >
                <span className="font-semibold text-foreground">{x.n}</span>
                <span className="text-muted-foreground">{x.label}</span>
              </motion.li>
            ))}
          </ul>

          <Actions src={src} filename={filename} />
        </motion.div>

        <PaperStack src={src} filename={filename} />
      </div>
    </section>
  );
}

function Actions({ src, filename, compact = false }: Props & { compact?: boolean }) {
  const [state, setState] = useState<"idle" | "started">("idle");
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const copyLink = async () => {
    const url = new URL(src, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Resume link copied. Paste it anywhere to share.");
      later(() => setCopied(false), 2000);
    } catch {
      toast.error(`Couldn't copy. The link is ${url}`);
    }
  };

  const size = compact ? "h-10 px-4 text-xs" : "h-12 px-6 text-sm";

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Native download attribute: works without JS. */}
      <a
        href={src}
        download={filename}
        data-track="cv_download"
        data-track-label={compact ? "resume_viewer" : "resume_page"}
        onClick={() => {
          setState("started");
          later(() => setState("idle"), 2400);
        }}
        className={cn(
          "relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground font-semibold text-background transition-transform active:scale-95",
          size,
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={state}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-2"
          >
            {state === "idle" ? (
              <>
                <DownloadIcon size={compact ? 14 : 17} /> Download CV
              </>
            ) : (
              <>
                <Check size={compact ? 14 : 17} strokeWidth={3} /> Download started
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </a>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        data-track="cv_open"
        className={cn("glass inline-flex items-center gap-2 rounded-full font-semibold transition-colors hover:border-accent/50", size)}
      >
        Open <ArrowUpRightIcon size={compact ? 14 : 16} />
      </a>
      <button
        type="button"
        onClick={copyLink}
        className={cn("glass inline-flex items-center gap-2 rounded-full font-semibold transition-colors hover:border-accent/50", size)}
      >
        {copied ? <Check size={compact ? 14 : 16} className="text-accent" /> : <Link2 size={compact ? 14 : 16} />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

/** Three sheets that fan out on hover; the top one "writes" its lines in. */
function PaperStack({ src, filename }: Props) {
  const reduce = useReducedMotion();
  const lines = [92, 70, 84, 58, 76, 64, 88, 50];

  return (
    <motion.a
      href={src}
      download={filename}
      aria-label="Download CV"
      data-track="cv_download"
      data-track-label="resume_art"
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring.soft, delay: 0.2 }}
      whileHover="fan"
      className="group relative mx-auto block aspect-[4/5] w-full max-w-[360px] [perspective:1200px]"
    >
      {[2, 1].map((k) => (
        <motion.span
          key={k}
          aria-hidden
          variants={{ fan: { rotate: k === 2 ? -9 : 5, x: k === 2 ? -26 : 20, y: k * 4 } }}
          initial={{ rotate: k === 2 ? -4 : 2.5, x: 0, y: k * 6 }}
          transition={spring.soft}
          className="absolute inset-0 rounded-2xl border border-border/80 bg-card shadow-glass"
          style={{ opacity: k === 2 ? 0.55 : 0.8 }}
        />
      ))}

      <motion.span
        variants={{ fan: { y: -10, rotate: -1 } }}
        transition={spring.soft}
        className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-glass-lg"
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent/40 via-accent to-accent/40" />
        <span className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-linear-to-br from-accent to-accent/60 text-sm font-bold text-background">
            SN
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold">{profile.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{profile.title}</span>
          </span>
        </span>

        {["Experience", "Projects", "Skills"].map((h, s) => (
          <span key={h} className="mt-5 block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">{h}</span>
            <span className="mt-2 flex flex-col gap-1.5">
              {lines.slice(s * 2, s * 2 + 3).map((w, i) => (
                <motion.span
                  key={i}
                  className="h-1.5 rounded-full bg-foreground/15"
                  initial={reduce ? false : { width: "0%" }}
                  animate={{ width: `${w}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 + s * 0.25 + i * 0.08 }}
                />
              ))}
            </span>
          </span>
        ))}

        {/* Scan line */}
        {!reduce && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 h-16 bg-linear-to-b from-transparent via-accent/15 to-transparent"
            initial={{ top: "-20%" }}
            animate={{ top: ["-20%", "110%"] }}
            transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut", delay: 1.8 }}
          />
        )}

        <span className="mt-auto flex items-center justify-between pt-4">
          <span className="rounded-md border border-border/70 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">PDF</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition-transform duration-300 group-hover:-translate-y-0.5">
            <DownloadIcon size={13} /> Download
          </span>
        </span>
      </motion.span>
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/* Quick read — the resume as scannable text, from the site's data.   */
/* ------------------------------------------------------------------ */

const SECTIONS = ["Summary", "Experience", "Products", "Skills", "Education"] as const;
type SectionId = (typeof SECTIONS)[number];

function QuickRead() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<SectionId>("Summary");

  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="border-b border-border/60 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Quick read</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.title}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
            <span className="size-1.5 rounded-full bg-accent" /> Open to roles
          </span>
        </div>
        <ul className="mt-4 flex flex-col gap-2 text-sm">
          <li className="flex items-center gap-2.5 text-foreground/85">
            <MapPinIcon size={15} className="text-accent" /> {profile.location}
          </li>
          <li className="flex items-center gap-2.5">
            <MailIcon size={15} className="shrink-0 text-accent" />
            <a href={profile.socials.email} className="min-w-0 truncate text-foreground/85 hover:underline">
              {profile.email}
            </a>
            <CopyEmailButton source="resume" className="size-7" />
          </li>
          <li className="flex items-center gap-2.5 text-foreground/85">
            <PhoneIcon size={15} className="text-accent" />
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="hover:underline">
              {profile.phone}
            </a>
          </li>
        </ul>
      </div>

      <LayoutGroup id="quick-read">
        <div role="tablist" aria-label="Resume sections" className="flex gap-1 overflow-x-auto border-b border-border/60 px-3 py-2 [scrollbar-width:none]">
          {SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              id={`qr-tab-${s}`}
              aria-selected={tab === s}
              aria-controls="qr-panel"
              onClick={() => setTab(s)}
              className={cn(
                "relative isolate h-9 shrink-0 rounded-full px-3.5 text-sm font-medium transition-colors",
                tab === s ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab === s && (
                <motion.span
                  layoutId="qr-pill"
                  transition={reduce ? { duration: 0 } : spring.snappy}
                  className="absolute inset-0 -z-10 rounded-full bg-muted ring-1 ring-inset ring-border"
                />
              )}
              {s}
            </button>
          ))}
        </div>
      </LayoutGroup>

      <div id="qr-panel" role="tabpanel" aria-labelledby={`qr-tab-${tab}`} className="min-h-[24rem] p-5 sm:p-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab === "Summary" && <SummaryPane />}
            {tab === "Experience" && <ExperiencePane />}
            {tab === "Products" && <ProductsPane />}
            {tab === "Skills" && <SkillsPane />}
            {tab === "Education" && <EducationPane />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stagger({ i, children, className }: { i: number; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...spring.soft, delay: 0.04 * i }}
      className={className}
    >
      {children}
    </motion.li>
  );
}

function SummaryPane() {
  return (
    <div>
      <p className="text-pretty leading-relaxed text-foreground/85">{profile.summary}</p>
      <ul className="mt-5 grid grid-cols-2 gap-2">
        {[
          ["Current role", `${job.role} · ${job.company.split(" ")[0]}`],
          ["Since", job.period.split(" – ")[0]],
          ["Degree", `B.E. CSE · ${education[0].score.replace("CGPA ", "")}`],
          ["Open to", profile.availability.replace(/^Open to /, "")],
        ].map(([k, v], i) => (
          <Stagger key={k} i={i} className="rounded-xl border border-border/60 bg-background/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
            <p className="mt-0.5 text-sm font-medium first-letter:uppercase">{v}</p>
          </Stagger>
        ))}
      </ul>
    </div>
  );
}

function ExperiencePane() {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold">
          {job.role} · <span className="text-accent">{job.company}</span>
        </h3>
        <span className="font-mono text-xs text-muted-foreground">{job.period}</span>
      </div>
      <ul className="mt-4 flex flex-col gap-2.5">
        {job.achievements.map((a, i) => (
          <Stagger key={a} i={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
            <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
              <Check size={10} strokeWidth={3} />
            </span>
            {a}
          </Stagger>
        ))}
      </ul>
      <Link href="/experience" className="mt-5 inline-flex text-sm font-semibold text-accent hover:underline">
        Full experience →
      </Link>
    </div>
  );
}

function ProductsPane() {
  return (
    <ul className="flex flex-col gap-2">
      {projects.map((p, i) => (
        <Stagger key={p.id} i={i}>
          <Link
            href={`/projects/${p.slug ?? p.id}`}
            className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3 transition-colors hover:border-accent/50"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 font-mono text-xs font-semibold text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{p.title.split(" — ")[0]}</span>
              <span className="block truncate text-xs text-muted-foreground">{p.tagline}</span>
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">{p.period}</span>
          </Link>
        </Stagger>
      ))}
    </ul>
  );
}

function SkillsPane() {
  return (
    <ul className="flex flex-col gap-4">
      {skillGroups.map((g, i) => (
        <Stagger key={g.id} i={i}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {g.label} <span className="text-muted-foreground/60">· {g.items.length}</span>
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{g.items.join(" · ")}</p>
        </Stagger>
      ))}
    </ul>
  );
}

function EducationPane() {
  return (
    <ul className="flex flex-col gap-3">
      {education.map((e, i) => (
        <Stagger key={e.id} i={i} className="rounded-xl border border-border/60 bg-background/40 p-4">
          <p className="font-semibold">{e.degree}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {e.institution} · {e.location}
          </p>
          <p className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="font-mono text-muted-foreground">{e.period}</span>
            <span className="rounded-full bg-accent/15 px-2 py-0.5 font-medium text-accent">{e.score}</span>
          </p>
        </Stagger>
      ))}
      {certifications.map((c, i) => (
        <Stagger key={c.id} i={education.length + i} className="rounded-xl border border-border/60 bg-background/40 p-4">
          <p className="font-semibold">{c.title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{c.issuer}</p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">{c.period}</p>
        </Stagger>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* PDF window — embedded preview with a real toolbar                  */
/* ------------------------------------------------------------------ */

function PdfWindow({ src, filename }: Props) {
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void frameRef.current?.requestFullscreen?.();
  };

  // Opens the PDF in the browser's own viewer, which has a reliable print button.
  const print = () => {
    const w = window.open(src, "_blank");
    if (w) w.opener = null;
    else toast.message("Pop-up blocked. Use Open, then print from there.");
  };

  return (
    <motion.div
      ref={frameRef}
      initial={reduce ? false : { opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
      className={cn(
        "glass relative flex flex-col overflow-hidden rounded-3xl shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8),0_0_80px_-40px_var(--accent)]",
        full && "rounded-none",
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
        <span className="hidden gap-1.5 sm:flex">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-3 rounded-full bg-muted-foreground/30" />
          ))}
        </span>
        <span className="ml-1 inline-flex min-w-0 items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <FileText size={13} className="shrink-0 text-accent" />
          <span className="truncate">{filename}</span>
        </span>
        <div className="ml-auto flex items-center gap-1">
          <ToolButton label="Print" onClick={print}>
            <Printer size={15} />
          </ToolButton>
          <ToolButton label={full ? "Exit full screen" : "Full screen"} onClick={toggleFull}>
            {full ? <Minimize size={15} /> : <Expand size={15} />}
          </ToolButton>
          <a
            href={src}
            download={filename}
            data-track="cv_download"
            data-track-label="resume_viewer"
            className="ml-1 inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground px-3 text-xs font-semibold text-background"
          >
            <DownloadIcon size={13} /> Download
          </a>
        </div>
      </div>

      <div className={cn("relative bg-background", full ? "flex-1" : "h-[min(78dvh,980px)]")}>
        {/* Skeleton sits behind the PDF; the viewer paints over it once loaded. */}
        <div aria-hidden className="absolute inset-0 flex justify-center overflow-hidden p-6">
          <div className="flex w-full max-w-[640px] flex-col gap-3 rounded-lg border border-border/60 bg-card p-8">
            {[40, 90, 70, 85, 0, 30, 95, 80, 88, 60, 0, 30, 92, 76, 84].map((w, i) =>
              w === 0 ? (
                <span key={i} className="h-3" />
              ) : (
                <span key={i} className="relative h-2.5 overflow-hidden rounded-full bg-foreground/10" style={{ width: `${w}%` }}>
                  {!reduce && <span className="animate-shimmer absolute inset-0 bg-linear-to-r from-transparent via-foreground/10 to-transparent bg-[length:200%_100%]" />}
                </span>
              ),
            )}
          </div>
        </div>
        <object
          data={`${src}#view=FitH&toolbar=1&navpanes=0`}
          type="application/pdf"
          aria-label={`${profile.name} resume preview`}
          className="relative size-full"
        >
          <div className="relative flex h-full flex-col items-center justify-center gap-4 bg-card p-10 text-center text-sm text-muted-foreground">
            <FileText size={36} className="text-accent" />
            <p className="max-w-xs">This browser can&apos;t show the PDF inline. Download it or open it in a new tab.</p>
            <Actions src={src} filename={filename} compact />
          </div>
        </object>
      </div>
    </motion.div>
  );
}

function ToolButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
    >
      {children}
    </button>
  );
}
