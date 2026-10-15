"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Check, UserRound } from "lucide-react";
import { CountUp } from "@/components/motion/Effects";
import { ProjectPreview } from "@/components/features/home/ProjectPreviews";
import { featuredProjects, type Project } from "@/lib/data/projects";
import { getCaseStudy } from "@/lib/data/case-studies";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Selected work as a scroll story. On large screens a sticky device
 * frame on the right swaps to an animated vignette of whichever project
 * is centred on the left; on phones each project carries its own.
 */
export function ProjectShowcase() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const chapterRefs = useRef<(HTMLLIElement | null)[]>([]);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  const goTo = (i: number) =>
    chapterRefs.current[i]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });

  return (
    <div className="relative lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 xl:gap-20">
      {/* Chapters */}
      <div className="relative">
        {/* Progress rail */}
        <div aria-hidden className="absolute bottom-[12vh] left-0 top-[12vh] hidden w-px bg-border lg:block">
          <motion.div style={{ scaleY: progress }} className="absolute inset-0 origin-top bg-accent" />
        </div>

        <ol ref={listRef} className="flex flex-col gap-14 lg:gap-0 lg:pl-10">
          {featuredProjects.map((p, i) => (
            <Chapter
              key={p.id}
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
              project={p}
              index={i}
              active={active === i}
              onActive={() => setActive(i)}
            />
          ))}
        </ol>
      </div>

      {/* Sticky preview */}
      <div className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-offset)+3rem)]">
          <DeviceFrame
            label={featuredProjects[active].title.split(" — ")[0]}
            index={active}
            count={featuredProjects.length}
            onPick={goTo}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={featuredProjects[active].id}
                initial={reduce ? false : { opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={reduce ? undefined : { opacity: 0, scale: 1.02, filter: "blur(6px)" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="size-full [zoom:1.22] xl:[zoom:1.32]"
              >
                <ProjectPreview id={featuredProjects[active].id} />
              </motion.div>
            </AnimatePresence>
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
}

function Chapter({
  ref,
  project,
  index,
  active,
  onActive,
}: {
  ref: (el: HTMLLIElement | null) => void;
  project: Project;
  index: number;
  active: boolean;
  onActive: () => void;
}) {
  const local = useRef<HTMLLIElement>(null);
  // "Active" = this chapter crosses the middle band of the viewport.
  const centred = useInView(local, { margin: "-45% 0px -45% 0px" });
  const reduce = useReducedMotion();
  const cs = getCaseStudy(project.id)?.study;
  const name = project.title.split(" — ")[0];
  // Phones: the challenge/impact detail starts collapsed to keep each
  // chapter around one screen; desktop always shows everything.
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (centred) onActive();
  }, [centred, onActive]);

  return (
    <li
      ref={(el) => {
        local.current = el;
        ref(el);
      }}
      className={cn(
        "relative flex flex-col justify-center transition-opacity duration-500 lg:min-h-[78vh]",
        !active && "lg:opacity-35",
      )}
    >
      {/* Rail dot */}
      <span
        aria-hidden
        className={cn(
          "absolute -left-10 top-1/2 hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-500 lg:block",
          active ? "scale-125 border-accent bg-accent shadow-[0_0_16px_var(--accent)]" : "border-border bg-background",
        )}
      />

      {/* Inline preview on phones / tablets */}
      <div className="mb-6 lg:hidden">
        <DeviceFrame label={name} index={index} count={featuredProjects.length}>
          <ProjectPreview id={project.id} />
        </DeviceFrame>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={spring.soft}
      >
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-8 bg-border" />
          <span className="uppercase tracking-[0.16em] text-muted-foreground">{project.domain}</span>
        </div>

        <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          <Link
            href={`/projects/${project.id}`}
            data-track="case_study_open"
            data-track-label={project.id}
            className="transition-colors hover:text-accent"
          >
            {name}
          </Link>
        </h3>
        <p className="mt-3 text-pretty text-lg leading-relaxed text-foreground/85">{project.tagline}</p>

        {cs && (
          <>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              aria-expanded={expanded}
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground/85 lg:hidden"
            >
              {expanded ? "Hide the full story" : "Read the full story"}
              <span className={cn("transition-transform duration-300", expanded && "rotate-90")}>→</span>
            </button>
            <div className={cn("lg:contents", expanded ? "contents" : "hidden")}>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">The challenge</p>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{cs.problem}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">What changed</p>
                <ul className="mt-2 flex flex-col gap-2">
                  {cs.impact.map((line, i) => (
                    <motion.li
                      key={line}
                      initial={reduce ? false : { opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ ...spring.soft, delay: 0.15 + i * 0.08 }}
                      className="flex gap-2 text-sm leading-relaxed text-foreground/85"
                    >
                      <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                        <Check size={10} strokeWidth={3} />
                      </span>
                      {line}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-xs text-foreground/85">
              <UserRound size={13} className="text-accent" />
              <span className="text-muted-foreground">My role:</span> {cs.role}
            </p>
            </div>

            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
              {cs.stats.map((s) => (
                <div key={s.label}>
                  <dd className="text-3xl font-semibold tracking-tight text-foreground">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </dd>
                  <dt className="mt-0.5 text-xs text-muted-foreground">{s.label}</dt>
                </div>
              ))}
            </dl>
          </>
        )}

        <Link
          href={`/projects/${project.id}`}
          className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent"
        >
          Read the case study
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </motion.div>
    </li>
  );
}

function DeviceFrame({
  label,
  index,
  count,
  onPick,
  children,
}: {
  label: string;
  index: number;
  count: number;
  onPick?: (i: number) => void;
  children: ReactNode;
}) {
  return (
    <figure className="m-0">
      <div className="glass-lg shadow-glass-lg relative overflow-hidden rounded-3xl">
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-2.5">
          <span className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2.5 rounded-full bg-muted-foreground/25" />
            ))}
          </span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-full bg-foreground/[0.05] px-3 py-0.5 font-mono text-[11px] text-foreground/85"
            >
              {label}
            </motion.span>
          </AnimatePresence>
          <span className="ml-auto flex items-center gap-1.5">
            {Array.from({ length: count }, (_, i) =>
              onPick ? (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to project ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => onPick(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-5 bg-accent" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground",
                  )}
                />
              ) : (
                <span
                  key={i}
                  aria-hidden
                  className={cn("h-1.5 rounded-full", i === index ? "w-5 bg-accent" : "w-1.5 bg-muted-foreground/40")}
                />
              ),
            )}
          </span>
        </div>
        <div aria-hidden className="aspect-[4/3] sm:aspect-[16/11]">
          {children}
        </div>
      </div>
      <figcaption className="mt-3 text-center text-[11px] text-muted-foreground/70">
        Illustrative preview of the product flow. Not real customer data.
      </figcaption>
    </figure>
  );
}
