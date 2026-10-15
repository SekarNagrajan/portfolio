"use client";

import { motion, useReducedMotion } from "motion/react";
import { CountUp, SpotlightCard } from "@/components/motion/Effects";
import { AwardIcon, GraduationCapIcon } from "@/components/icons/AnimatedIcons";
import { education, certifications } from "@/lib/data/education";

/** Pulls "8.9" and "10" out of a score like "CGPA 8.9 / 10". */
function parseScore(score: string) {
  const m = score.match(/([\d.]+)\s*\/\s*([\d.]+)/);
  return m ? { value: Number(m[1]), max: Number(m[2]) } : null;
}

/** Education + certifications, with an animated CGPA ring and a rotating seal. */
export function Credentials() {
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      {education.map((ed, i) => {
        const score = parseScore(ed.score);
        const [from, to] = ed.period.split(" – ");
        return (
          <SpotlightCard key={ed.id} index={i} lift={false} className="p-7 sm:p-9">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
              {score && (
                <div className="relative grid size-36 shrink-0 place-items-center self-center">
                  <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden>
                    <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" className="stroke-foreground/10" />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="stroke-accent [filter:drop-shadow(0_0_6px_var(--accent))]"
                      initial={reduce ? false : { pathLength: 0 }}
                      whileInView={{ pathLength: score.value / score.max }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    />
                  </svg>
                  <div className="text-center">
                    <p className="text-4xl font-semibold tracking-tight">
                      <CountUp to={score.value} decimals={1} />
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">CGPA / {score.max}</p>
                  </div>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                  <GraduationCapIcon size={15} /> Degree
                </span>
                <h3 className="mt-2 text-balance text-xl font-semibold tracking-tight sm:text-2xl">{ed.degree}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {ed.institution} · {ed.location}
                </p>

                {/* Four-year bar */}
                <div className="mt-6">
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-foreground/10">
                    <motion.span
                      className="absolute inset-0 origin-left rounded-full bg-linear-to-r from-accent/50 to-accent"
                      initial={reduce ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
                    <span>{from}</span>
                    <span className="text-accent">Graduated {to}</span>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>
        );
      })}

      {certifications.map((c, i) => (
        <SpotlightCard key={c.id} index={i + 1} lift={false} className="relative overflow-hidden p-7 sm:p-9">
          {/* Seal */}
          <div aria-hidden className="absolute right-4 top-4 size-16 opacity-90 sm:right-6 sm:top-6 sm:size-28">
            <motion.svg
              viewBox="0 0 100 100"
              className="size-full text-accent/25"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <path
                fill="currentColor"
                d={Array.from({ length: 24 }, (_, k) => {
                  const a = (k / 24) * Math.PI * 2;
                  const r = k % 2 ? 42 : 50;
                  return `${k ? "L" : "M"}${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
                }).join(" ") + "Z"}
              />
            </motion.svg>
            <span className="absolute inset-0 grid place-items-center text-accent">
              <AwardIcon size={30} strokeWidth={1.75} />
            </span>
          </div>

          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            <AwardIcon size={15} /> Certification
          </span>
          <h3 className="mt-2 max-w-[calc(100%-4.5rem)] text-balance text-xl font-semibold tracking-tight sm:max-w-[80%] sm:text-2xl">{c.title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{c.issuer}</p>
          <p className="mt-6 inline-flex rounded-full border border-border/70 px-3 py-1 font-mono text-xs text-muted-foreground">{c.period}</p>
        </SpotlightCard>
      ))}
    </div>
  );
}
