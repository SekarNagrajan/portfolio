"use client";

import type { ComponentType } from "react";
import { SpotlightCard } from "@/components/motion/Effects";
import { CodeIcon, ShieldIcon, SparklesIcon, ZapIcon, type AnimatedIconProps } from "@/components/icons/AnimatedIcons";

type Principle = { icon: ComponentType<AnimatedIconProps>; title: string; body: string; practice: string };

const PRINCIPLES: readonly Principle[] = [
  {
    icon: ZapIcon,
    title: "Performance is a feature",
    body: "Strict Core Web Vitals budgets and motion that never leaves the compositor.",
    practice: "Motion on this site pauses off-screen and respects reduced-motion settings.",
  },
  {
    icon: ShieldIcon,
    title: "Secure by construction",
    body: "Tenant isolation, RBAC, and validated boundaries from day one.",
    practice: "Role-based module gating across CRM and ANCHOR.",
  },
  {
    icon: CodeIcon,
    title: "Systems over screens",
    body: "Reusable primitives that let 40 screens ship like 4.",
    practice: "One shared DataTable and transaction UI behind 40+ ANCHOR screens.",
  },
  {
    icon: SparklesIcon,
    title: "AI where it removes work",
    body: "Automation belongs wherever people are retyping things.",
    practice: "Voice and image lead capture in CRM; ERAX answers questions with charts.",
  },
];

/** "How I work" — each principle paired with where it shows up in real work. */
export function Principles() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {PRINCIPLES.map(({ icon: Icon, title, body, practice }, i) => (
        <SpotlightCard key={title} index={i} className="flex flex-col p-7">
          <div className="flex items-start justify-between">
            <div className="grid size-14 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
              <Icon size={26} strokeWidth={1.75} />
            </div>
            <span
              aria-hidden
              className="text-5xl font-bold tabular-nums leading-none tracking-tight text-transparent transition-colors duration-500 [-webkit-text-stroke:1px_color-mix(in_oklab,var(--foreground)_22%,transparent)] group-hover:text-accent/80 group-hover:[-webkit-text-stroke:1px_transparent] pointer-coarse:text-accent/80 pointer-coarse:[-webkit-text-stroke:1px_transparent]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-6 text-xl font-semibold tracking-tight">{title}</h3>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{body}</p>
          <div className="mt-auto pt-6">
            <div className="relative overflow-hidden rounded-xl border border-border/60 bg-foreground/[0.03] p-3.5">
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-accent transition-transform duration-500 group-hover:scale-y-100 pointer-coarse:scale-y-100"
              />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">In practice</p>
              <p className="mt-1 text-pretty text-sm leading-relaxed text-foreground/85">{practice}</p>
            </div>
          </div>
        </SpotlightCard>
      ))}
    </div>
  );
}
