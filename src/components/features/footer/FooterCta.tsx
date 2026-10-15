"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { SpotlightCard, Magnetic } from "@/components/motion/Effects";
import { CopyEmailButton } from "@/components/features/CopyEmailButton";
import { Glass } from "@/components/ui/glass";
import {
  ArrowUpRightIcon,
  DownloadIcon,
  MailIcon,
  MapPinIcon,
  MotionAnchor,
  MotionLink,
  hoverTrigger,
} from "@/components/icons/AnimatedIcons";
import { profile } from "@/lib/data/profile";

const HEADLINE = ["Let's", "build", "something"] as const;

/** Big closing call-to-action with a contact panel recruiters can act on. */
export function FooterCta() {
  const reduce = useReducedMotion();
  // The contact page is this call-to-action, so don't repeat it there.
  if (usePathname() === "/contact") return null;

  return (
    <SpotlightCard lift={false} className="p-0">
      {/* minmax(0,…) tracks so the long email truncates instead of widening the card. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Pitch */}
        <div className="flex flex-col gap-7 p-7 sm:p-10 lg:p-12">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {profile.availability}
          </span>

          <motion.h2
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ staggerChildren: 0.08 }}
            className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl"
          >
            {HEADLINE.map((w) => (
              <Word key={w}>{w}</Word>
            ))}
            <Word className="text-gradient animate-shimmer">remarkable.</Word>
          </motion.h2>

          <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Hiring for a senior full-stack or architecture role, or have a
            product that needs building? Let&apos;s talk.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <MotionLink
                href="/contact"
                {...hoverTrigger}
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-foreground pl-6 pr-2 text-base font-semibold text-background active:scale-95"
              >
                Start a conversation
                <span className="grid size-10 place-items-center rounded-full bg-background text-foreground transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRightIcon size={18} />
                </span>
              </MotionLink>
            </Magnetic>
            <Glass intensity="md" interactive rounded="full" asChild>
              <MotionAnchor
                href="/resume.pdf"
                download="Sekar_Nagarajan_Resume.pdf"
                data-track="cv_download"
                data-track-label="footer"
                {...hoverTrigger}
                className="inline-flex h-14 items-center gap-2.5 px-6 text-base font-semibold text-foreground active:scale-95"
              >
                <DownloadIcon size={18} /> Download CV
              </MotionAnchor>
            </Glass>
          </div>
        </div>

        {/* Contact panel */}
        <div className="flex flex-col justify-center gap-5 border-t border-border/60 bg-foreground/[0.02] p-7 sm:p-10 lg:border-l lg:border-t-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Reach me directly
          </p>

          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/40 p-3 pl-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/12 text-accent">
              <MailIcon size={18} />
            </span>
            <a
              href={profile.socials.email}
              data-track="profile_click"
              data-track-label="Email"
              className="min-w-0 flex-1 truncate text-sm font-medium text-foreground underline-offset-4 hover:underline sm:text-base"
            >
              {profile.email}
            </a>
            <CopyEmailButton source="footer" />
          </div>

          <LocalTime />

          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinIcon size={16} trigger="self" className="text-accent" />{" "}
            {profile.location}
          </p>
        </div>
      </div>
    </SpotlightCard>
  );
}

function Word({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  // The space sits outside the clipping box, or it collapses inside it.
  return (
    <>
      <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
        <motion.span
          className={`inline-block ${className ?? ""}`}
          variants={{
            hidden: { y: "105%", rotate: 3 },
            show: {
              y: "0%",
              rotate: 0,
              transition: { type: "spring", stiffness: 120, damping: 18 },
            },
          }}
        >
          {children}
        </motion.span>
      </span>{" "}
    </>
  );
}

const TZ = "Asia/Kolkata";
const timeFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
});
const hourFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  hourCycle: "h23",
});
const minuteFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  minute: "numeric",
});

/**
 * Live local time in Chennai, so recruiters in other time zones know when
 * to expect a reply. Reads the clock only after mount — never during
 * prerender — so the static shell stays deterministic.
 */
export function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 15_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const hour = now ? Number(hourFmt.format(now)) : null;
  const working = hour !== null && hour >= 9 && hour < 19;
  const minutes = now ? Number(minuteFmt.format(now)) : 0;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/40 p-3 pl-4">
      <ClockFace hour={hour ?? 10} minute={minutes} ready={now !== null} />
      <div className="min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-semibold tabular-nums">
            {now ? timeFmt.format(now) : "--:--"}
          </span>{" "}
          <span className="text-muted-foreground">
            in Chennai · IST (UTC+5:30)
          </span>
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className={`size-1.5 rounded-full ${working ? "bg-accent" : "bg-muted-foreground/50"}`}
          />
          {now
            ? working
              ? "Within my working hours"
              : "Outside my working hours"
            : "Checking local time…"}
        </p>
      </div>
    </div>
  );
}

function ClockFace({
  hour,
  minute,
  ready,
}: {
  hour: number;
  minute: number;
  ready: boolean;
}) {
  const reduce = useReducedMotion();
  const hourDeg = ((hour % 12) + minute / 60) * 30;
  const minuteDeg = minute * 6;
  return (
    <span
      aria-hidden
      className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-accent/12 text-accent"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="9.5" />
        <motion.line
          x1="12"
          y1="12"
          x2="12"
          y2="7.5"
          style={{ transformOrigin: "12px 12px" }}
          initial={false}
          animate={{ rotate: ready ? hourDeg : 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 60, damping: 14 }
          }
        />
        <motion.line
          x1="12"
          y1="12"
          x2="12"
          y2="5"
          style={{ transformOrigin: "12px 12px" }}
          initial={false}
          animate={{ rotate: ready ? minuteDeg : 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 60, damping: 14, delay: 0.1 }
          }
        />
      </svg>
    </span>
  );
}
