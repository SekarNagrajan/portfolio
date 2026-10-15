"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Award, Boxes, MapPin, Pause, Play } from "lucide-react";
import { SpotlightCard } from "@/components/motion/Effects";
import { ViewAllLink } from "@/components/features/ViewAllLink";
import { experiences } from "@/lib/data/experiences";
import { cn } from "@/lib/utils";

const ROTATE_MS = 5500;

/**
 * Current role — who I work for, what that company is, and a rotating
 * reel of what I've shipped there.
 */
export function NowBand() {
  const job = experiences[0];
  const facts = job.companyFacts;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();

  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const paused = userPaused ?? Boolean(reduce);
  const running = inView && !hold && !paused;
  const total = job.achievements.length;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setI((n) => (n + 1) % total), ROTATE_MS);
    return () => clearTimeout(id);
  }, [running, i, total]);

  return (
    <SpotlightCard lift={false} className="p-0">
      <div ref={ref} className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Who & where */}
        <div className="flex flex-col gap-6 p-7 sm:p-10">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            Currently · {job.period}
          </span>

          <div>
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              {job.role} at{" "}
              <a
                href={job.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gradient underline-offset-4 hover:underline"
              >
                {job.company}
              </a>
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">{job.summary}</p>
          </div>

          {facts && (
            <dl className="grid gap-4 border-t border-border/60 pt-6 sm:grid-cols-2">
              <Fact icon={<Boxes size={14} />} label="Company">
                Maritime enterprise software since 2003 · {facts.products}
              </Fact>
              <Fact icon={<Award size={14} />} label="Certified">
                {facts.credentials.join(" · ")}
              </Fact>
              <Fact icon={<MapPin size={14} />} label="Offices" className="sm:col-span-2">
                <span className="mt-1 flex flex-wrap gap-1.5">
                  {facts.offices.map((city, n) => (
                    <motion.span
                      key={city}
                      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 + n * 0.06 }}
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs",
                        n === 0 ? "border-accent/50 bg-accent/10 text-accent" : "border-border/70 text-foreground/80",
                      )}
                    >
                      {city}
                      {n === 0 && <span className="text-accent/70"> · HQ</span>}
                    </motion.span>
                  ))}
                </span>
              </Fact>
            </dl>
          )}

          <div className="mt-auto">
            <ViewAllLink href="/experience">See the full timeline</ViewAllLink>
          </div>
        </div>

        {/* What I've shipped there */}
        <div
          className="relative flex flex-col border-t border-border/60 bg-foreground/[0.02] p-7 sm:p-10 lg:border-l lg:border-t-0"
          onPointerEnter={(e) => e.pointerType === "mouse" && setHold(true)}
          onPointerLeave={() => setHold(false)}
          onFocus={() => setHold(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHold(false)}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">What I&apos;ve shipped here</p>
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
                <span className="text-muted-foreground/50"> / {String(total).padStart(2, "0")}</span>
              </span>
              <button
                type="button"
                onClick={() => setUserPaused(!paused)}
                aria-label={paused ? "Play highlights" : "Pause highlights"}
                className="grid size-7 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-foreground"
              >
                {paused ? <Play size={11} /> : <Pause size={11} />}
              </button>
            </span>
          </div>

          <div className="relative mt-6 flex min-h-[10rem] flex-1 items-center">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-4 right-0 select-none font-mono text-[7rem] font-bold leading-none text-foreground/[0.04] sm:text-[9rem]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={i}
                initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? undefined : { opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative text-pretty text-lg font-medium leading-relaxed text-foreground sm:text-xl xl:text-2xl xl:leading-snug"
              >
                {job.achievements[i]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Segment progress — click to jump */}
          <div className="mt-6 flex gap-1.5">
            {job.achievements.map((a, n) => (
              <button
                key={n}
                type="button"
                aria-label={`Highlight ${n + 1}`}
                aria-current={n === i ? "true" : undefined}
                onClick={() => setI(n)}
                className="group relative h-6 flex-1"
              >
                <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-foreground/10 transition-colors group-hover:bg-foreground/20">
                  {n < i && <span className="absolute inset-0 bg-accent/60" />}
                  {n === i && (
                    <motion.span
                      key={`${i}-${running}`}
                      className="absolute inset-0 origin-left bg-accent"
                      initial={{ scaleX: running ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: running ? ROTATE_MS / 1000 : 0, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          <ul className="mt-6 flex flex-wrap gap-1.5">
            {job.technologies.slice(0, 8).map((t) => (
              <li key={t} className="rounded-md bg-foreground/[0.05] px-2 py-0.5 font-mono text-[10.5px] text-muted-foreground">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SpotlightCard>
  );
}

function Fact({
  icon,
  label,
  className,
  children,
}: {
  icon: ReactNode;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <span className="text-accent">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1.5 text-sm text-foreground/85">{children}</dd>
    </div>
  );
}
