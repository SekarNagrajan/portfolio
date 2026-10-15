"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  Anchor,
  Check,
  FileText,
  Lock,
  Mic,
  Package,
  Receipt,
  Ship,
  Sparkles,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Building2, FileSpreadsheet } from "lucide-react";

/**
 * Illustrated, looping product vignettes for the home-page project
 * showcase. They depict what each product does — they are not
 * screenshots and show no real customer data.
 */

/** Cycles 0…steps-1 while the element is on screen (frozen on the last step for reduced motion). */
function usePhase(steps: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setPhase((p) => (p + 1) % steps), ms);
    return () => clearInterval(id);
  }, [inView, reduce, steps, ms]);

  return { ref, phase: reduce ? steps - 1 : phase };
}

export function ProjectPreview({ id }: { id: string }) {
  if (id === "crm") return <CrmPreview />;
  if (id === "anchor") return <AnchorPreview />;
  if (id === "pams-legacy") return <PamsLegacyPreview />;
  return <PamsPreview />;
}

/* ------------------------------------------------------------------ */
/* CRM — a voice note becomes a lead in the pipeline.                 */
/* ------------------------------------------------------------------ */

function CrmPreview() {
  // 0 listening · 1 transcribing · 2 lead created · 3 hold
  const { ref, phase } = usePhase(4, 1500);
  const created = phase >= 2;

  return (
    <div ref={ref} className="grid size-full grid-cols-[1fr_auto_1.15fr] items-center gap-3 p-4 sm:gap-4 sm:p-6">
      {/* Voice note */}
      <Panel title="Voice note" icon={<Mic size={12} />}>
        <div className="flex h-12 items-center gap-[3px]">
          {Array.from({ length: 18 }, (_, i) => (
            <motion.span
              key={i}
              className="w-1 flex-1 origin-center rounded-full bg-accent/70"
              animate={phase === 0 ? { scaleY: [0.25, 0.4 + ((i * 37) % 60) / 100, 0.25] } : { scaleY: 0.18 }}
              transition={phase === 0 ? { duration: 0.6, repeat: Infinity, delay: (i % 6) * 0.07 } : { duration: 0.3 }}
              style={{ height: "100%" }}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          {[92, 76, 54].map((w, i) => (
            <motion.span
              key={i}
              className="h-1.5 rounded-full bg-foreground/15"
              initial={false}
              animate={{ width: phase >= 1 ? `${w}%` : "0%" }}
              transition={{ duration: 0.5, delay: phase >= 1 ? i * 0.15 : 0, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>
        <p className="mt-3 font-mono text-[9.5px] text-muted-foreground">
          {phase === 0 ? "listening…" : phase === 1 ? "transcribing…" : "transcribed"}
        </p>
      </Panel>

      {/* AI hop */}
      <div className="flex flex-col items-center gap-1.5">
        <motion.span
          className="grid size-9 place-items-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/40"
          animate={phase === 1 ? { scale: [1, 1.15, 1], rotate: [0, 12, 0] } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, repeat: phase === 1 ? Infinity : 0 }}
        >
          <Sparkles size={15} />
        </motion.span>
        <span className="font-mono text-[9px] text-muted-foreground">AI</span>
      </div>

      {/* Pipeline */}
      <Panel title="Pipeline" icon={<FileText size={12} />}>
        <div className="grid grid-cols-2 gap-2">
          {["New", "Qualified"].map((col, c) => (
            <div key={col} className="flex flex-col gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{col}</span>
              <AnimatePresence initial={false}>
                {c === 0 && created && (
                  <motion.span
                    key="new"
                    initial={{ opacity: 0, y: -14, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    className="rounded-lg border border-accent/50 bg-accent/10 p-1.5 shadow-[0_0_20px_-8px_var(--accent)]"
                  >
                    <span className="flex items-center gap-1 text-[9.5px] font-semibold text-accent">
                      <Sparkles size={9} /> New lead
                    </span>
                    <span className="mt-1 block h-1 w-4/5 rounded-full bg-foreground/20" />
                  </motion.span>
                )}
              </AnimatePresence>
              {[0, 1].map((k) => (
                <span key={k} className="rounded-lg border border-border/60 bg-foreground/[0.03] p-1.5">
                  <span className="block h-1 w-3/4 rounded-full bg-foreground/15" />
                  <span className="mt-1 block h-1 w-1/2 rounded-full bg-foreground/10" />
                </span>
              ))}
            </div>
          ))}
        </div>
        <Outcome show={created}>No manual typing</Outcome>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ANCHOR — role-gated modules + ERAX answering with a chart.         */
/* ------------------------------------------------------------------ */

const MODULES = [
  { icon: Ship, label: "Husbanding" },
  { icon: FileText, label: "EPDA" },
  { icon: Wallet, label: "Accounting" },
  { icon: Receipt, label: "Payments", locked: true },
] as const;

const BARS = [42, 58, 50, 72, 64, 86];

function AnchorPreview() {
  // 0 question · 1 thinking · 2 SQL · 3 chart · 4 hold
  const { ref, phase } = usePhase(5, 1300);

  return (
    <div ref={ref} className="grid size-full grid-cols-[auto_1fr] gap-3 p-4 sm:gap-4 sm:p-6">
      {/* Module rail */}
      <div className="flex flex-col gap-1.5 rounded-2xl border border-border/60 bg-foreground/[0.03] p-2">
        <span className="mb-1 grid size-8 place-items-center rounded-lg bg-accent text-background">
          <Anchor size={15} />
        </span>
        {MODULES.map(({ icon: Icon, label, ...m }, i) => (
          <span
            key={label}
            className={cn(
              "relative flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px]",
              i === 0 ? "bg-accent/12 text-accent" : "text-muted-foreground",
              "locked" in m && "opacity-50",
            )}
          >
            <Icon size={12} />
            <span className="hidden sm:inline">{label}</span>
            {"locked" in m && <Lock size={9} className="ml-auto" />}
          </span>
        ))}
        <span className="mt-auto hidden font-mono text-[8.5px] leading-tight text-muted-foreground/70 sm:block">
          role-based
          <br />
          access
        </span>
      </div>

      {/* ERAX chat */}
      <div className="flex min-w-0 flex-col gap-2.5 rounded-2xl border border-border/60 bg-foreground/[0.02] p-3">
        <span className="flex items-center gap-1.5 font-mono text-[9.5px] text-muted-foreground">
          <Sparkles size={11} className="text-accent" /> ERAX assistant
        </span>
        <motion.span
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          className="self-end rounded-2xl rounded-br-md bg-foreground/90 px-3 py-1.5 text-[11px] font-medium text-background"
        >
          Port calls by month?
        </motion.span>

        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {phase === 1 && (
              <motion.span
                key="dots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex w-fit gap-1 rounded-2xl rounded-bl-md bg-foreground/[0.06] px-3 py-2"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-muted-foreground"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                  />
                ))}
              </motion.span>
            )}
            {phase >= 2 && (
              <motion.span
                key="sql"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-fit max-w-full truncate rounded-lg border border-border/60 bg-background/50 px-2 py-1 font-mono text-[9.5px] text-muted-foreground"
              >
                <span className="text-accent">SELECT</span> month, <span className="text-accent">COUNT</span>(*) …
              </motion.span>
            )}
          </AnimatePresence>

          <div className="flex flex-1 items-end gap-1.5 rounded-xl border border-border/50 bg-background/30 p-2">
            {BARS.map((v, i) => (
              <motion.span
                key={i}
                className="flex-1 origin-bottom rounded-t-md bg-linear-to-t from-accent/30 to-accent"
                style={{ height: `${v}%` }}
                initial={false}
                animate={{ scaleY: phase >= 3 ? 1 : 0.04 }}
                transition={{ type: "spring", stiffness: 160, damping: 18, delay: phase >= 3 ? i * 0.06 : 0 }}
              />
            ))}
          </div>
        </div>
        <Outcome show={phase >= 3}>Answer as a chart</Outcome>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAMS E-Commerce — a shipment moves Booking → B/L → Invoice.        */
/* ------------------------------------------------------------------ */

const STEPS = ["Booking", "Instructions", "B/L", "VGM", "Invoice"] as const;

function PamsPreview() {
  const { ref, phase } = usePhase(STEPS.length + 1, 1100);
  const step = Math.min(phase, STEPS.length - 1);
  const done = phase >= STEPS.length - 1;

  return (
    <div ref={ref} className="flex size-full flex-col gap-3 p-4 sm:gap-4 sm:p-6">
      {/* Brand bar */}
      <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-foreground/[0.03] px-3 py-2">
        <span className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-accent text-background">
            <Package size={14} />
          </span>
          <span className="text-[11px] font-semibold">Self-service portal</span>
        </span>
        <span className="flex gap-1">
          {["bg-accent", "bg-foreground/60", "bg-muted-foreground/40"].map((c, i) => (
            <span key={i} className={cn("size-2.5 rounded-full", c)} />
          ))}
        </span>
      </div>

      {/* Stepper */}
      <ol className="flex items-center">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center last:flex-none">
            <span className="flex flex-col items-center gap-1">
              <motion.span
                initial={false}
                animate={{ scale: i === step ? 1.12 : 1 }}
                className={cn(
                  "grid size-6 place-items-center rounded-full border text-[9px] font-semibold transition-colors duration-300 sm:size-7",
                  i < step || (done && i === step)
                    ? "border-accent bg-accent text-background"
                    : i === step
                      ? "border-accent text-accent shadow-[0_0_14px_-2px_var(--accent)]"
                      : "border-border text-muted-foreground",
                )}
              >
                {i < step || (done && i === step) ? <Check size={11} strokeWidth={3} /> : i + 1}
              </motion.span>
              <span className={cn("hidden text-[9px] sm:block", i <= step ? "text-foreground/80" : "text-muted-foreground/60")}>{s}</span>
            </span>
            {i < STEPS.length - 1 && (
              <span className="relative mx-1 mb-0 h-0.5 flex-1 overflow-hidden rounded-full bg-border sm:mb-4">
                <motion.span
                  className="absolute inset-0 origin-left bg-accent"
                  initial={false}
                  animate={{ scaleX: i < step ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </span>
            )}
          </li>
        ))}
      </ol>

      {/* Shipment */}
      <div className="flex flex-1 flex-col justify-center gap-3 rounded-2xl border border-border/60 bg-foreground/[0.02] p-3">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-semibold">Chennai</span>
          <span className="font-mono text-muted-foreground">{STEPS[step]}</span>
          <span className="font-semibold">Singapore</span>
        </div>
        <div className="relative h-6">
          <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-border" />
          <motion.span
            className="absolute top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-accent text-background shadow-[0_0_16px_-2px_var(--accent)]"
            initial={false}
            animate={{ left: `calc(${(step / (STEPS.length - 1)) * 100}% - ${(step / (STEPS.length - 1)) * 24}px)` }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          >
            <Ship size={12} />
          </motion.span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Container", "Vessel", "ETA"].map((l) => (
            <span key={l} className="rounded-lg bg-foreground/[0.04] px-2 py-1.5">
              <span className="block text-[8.5px] uppercase tracking-wider text-muted-foreground">{l}</span>
              <span className="mt-1 block h-1.5 w-3/4 rounded-full bg-foreground/20" />
            </span>
          ))}
        </div>
      </div>
      <Outcome show={done}>Customer did it themselves</Outcome>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAMS — manifests batch over EDI into a compliant invoice.          */
/* ------------------------------------------------------------------ */

const PRINCIPALS = ["Principal A", "Principal B", "Principal C"] as const;
const CHECKS = ["D&D", "GST", "VAT", "e-Invoice"] as const;

function PamsLegacyPreview() {
  // 0–2 records batch · 3 EDI sent · 4–7 compliance checks · 8 hold
  const { ref, phase } = usePhase(9, 900);
  const principal = Math.floor(phase / 3) % PRINCIPALS.length;
  const sent = phase >= 3;

  return (
    <div ref={ref} className="grid size-full grid-cols-[auto_1fr_auto_1fr] items-center gap-2 p-4 sm:gap-3 sm:p-6">
      {/* Principals */}
      <div className="flex flex-col gap-1.5">
        {PRINCIPALS.map((p, i) => (
          <span
            key={p}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] transition-colors duration-300",
              i === principal ? "border-accent/60 bg-accent/10 text-accent" : "border-border/60 text-muted-foreground",
            )}
          >
            <Building2 size={11} />
            <span className="hidden sm:inline">{p}</span>
            <span className="sm:hidden">{p.slice(-1)}</span>
          </span>
        ))}
      </div>

      {/* Manifest rows */}
      <Panel title="Manifest" icon={<FileSpreadsheet size={12} />}>
        <div className="flex flex-col gap-1.5">
          {[0, 1, 2].map((r) => (
            <motion.span
              key={r}
              className="flex items-center gap-1.5 rounded-md bg-foreground/[0.04] px-1.5 py-1"
              initial={false}
              animate={{ opacity: phase % 3 >= r || sent ? 1 : 0.3, x: sent ? 6 : 0 }}
              transition={{ duration: 0.3, delay: sent ? r * 0.05 : 0 }}
            >
              <span className="size-1.5 rounded-full bg-accent/70" />
              <span className="h-1 flex-1 rounded-full bg-foreground/20" />
              <span className="h-1 w-4 rounded-full bg-foreground/10" />
            </motion.span>
          ))}
        </div>
      </Panel>

      {/* EDI hop */}
      <div className="flex flex-col items-center gap-1">
        <motion.span
          className="grid h-8 place-items-center rounded-full bg-accent/15 px-2.5 font-mono text-[9px] font-semibold text-accent ring-1 ring-accent/40"
          animate={phase === 3 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          EDI
        </motion.span>
        <span className="font-mono text-[8.5px] text-muted-foreground">{sent ? "sent" : "batching"}</span>
      </div>

      {/* Invoice */}
      <Panel title="Export invoice" icon={<FileText size={12} />}>
        <span className="block h-1.5 w-3/4 rounded-full bg-foreground/20" />
        <span className="mt-1.5 block h-1.5 w-1/2 rounded-full bg-foreground/10" />
        <div className="mt-3 grid grid-cols-2 gap-1">
          {CHECKS.map((c, i) => {
            const ok = phase >= 4 + i;
            return (
              <span
                key={c}
                className={cn(
                  "flex items-center gap-1 rounded-md border px-1.5 py-1 text-[9px] font-medium transition-colors duration-300",
                  ok ? "border-accent/50 bg-accent/10 text-accent" : "border-border/60 text-muted-foreground/70",
                )}
              >
                {ok ? <Check size={9} strokeWidth={3} /> : <span className="size-[9px] rounded-full border border-current" />}
                {c}
              </span>
            );
          })}
        </div>
        <Outcome show={phase >= 7}>Compliant & sent</Outcome>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative flex min-w-0 flex-col justify-center rounded-2xl border border-border/60 bg-foreground/[0.03] p-3">
      <span className="mb-2.5 flex items-center gap-1.5 font-mono text-[9.5px] text-muted-foreground">
        <span className="text-accent">{icon}</span>
        {title}
      </span>
      {children}
    </div>
  );
}

function Outcome({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
          className="mt-2.5 inline-flex w-fit items-center gap-1 self-start rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent ring-1 ring-accent/30"
        >
          <Check size={10} strokeWidth={3} />
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
