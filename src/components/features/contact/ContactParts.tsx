"use client";

import { motion, useReducedMotion } from "motion/react";
import { Inbox, MailCheck, MessageSquareReply } from "lucide-react";
import { CopyEmailButton } from "@/components/features/CopyEmailButton";
import { LocalTime } from "@/components/features/footer/FooterCta";
import {
  ArrowUpRightIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  MotionLink,
  SendIcon,
  hoverTrigger,
} from "@/components/icons/AnimatedIcons";
import { profile } from "@/lib/data/profile";
import { spring } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

const HEAD = ["Let's", "build", "something"] as const;

export function ContactHero() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="contact-title" className="shell relative pt-[max(6rem,calc(env(safe-area-inset-top)+4.5rem))] lg:pt-40">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:gap-16">
        <div className="flex flex-col items-start gap-6">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-sm inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent"
          >
            <SendIcon size={14} trigger="mount" /> Contact
          </motion.p>
          <motion.h1
            id="contact-title"
            initial={reduce ? false : "hidden"}
            animate="show"
            transition={{ staggerChildren: 0.08 }}
            className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            {HEAD.map((w) => (
              <Word key={w}>{w}</Word>
            ))}
            <Word className="text-gradient">together.</Word>
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.soft, delay: 0.35 }}
            className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            Hiring, building something, or just want to compare notes? Send a message and it lands straight in my inbox.
            I usually reply within one working day.
          </motion.p>
          <motion.span
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring.bouncy, delay: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-sm font-medium text-accent"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {profile.availability}
          </motion.span>
        </div>

        <MailArt />
      </div>
    </section>
  );
}

function Word({ children, className }: { children: string; className?: string }) {
  return (
    <>
      <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
        <motion.span
          className={`inline-block ${className ?? ""}`}
          variants={{
            hidden: { y: "105%", rotate: 3 },
            show: { y: "0%", rotate: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
          }}
        >
          {children}
        </motion.span>
      </span>{" "}
    </>
  );
}

/** An envelope that seals, then a plane loops out of it along a dashed path. */
function MailArt() {
  const reduce = useReducedMotion();
  const path = "M60 170 C 120 60, 220 40, 300 90 S 380 40, 420 20";
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring.soft, delay: 0.2 }}
      className="glass relative mx-auto hidden aspect-[5/4] w-full max-w-[460px] overflow-hidden rounded-3xl sm:block"
    >
      <div className="absolute inset-0 bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_10%,transparent)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_85%)]" />

      <svg viewBox="0 0 460 368" className="absolute inset-0 size-full">
        <motion.path
          d={path}
          fill="none"
          strokeWidth={2}
          strokeDasharray="6 8"
          strokeLinecap="round"
          className="stroke-accent/50"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.9 }}
        />
        {!reduce && (
          <g className="text-accent">
            <animateMotion dur="3.6s" begin="1.6s" repeatCount="indefinite" rotate="auto" path={path} />
            <path d="M-12 -9 L14 0 L-12 9 L-6 0 Z" fill="currentColor" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="3.6s" begin="1.6s" repeatCount="indefinite" />
          </g>
        )}
      </svg>

      {/* Envelope */}
      <div className="absolute bottom-[14%] left-[9%] w-[46%]">
        <div className="relative aspect-[3/2] rounded-xl border border-border bg-card shadow-glass-lg">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 origin-top border-b border-border/80 bg-linear-to-b from-accent/25 to-transparent [clip-path:polygon(0_0,100%_0,50%_100%)]"
            initial={reduce ? false : { rotateX: 180 }}
            animate={{ rotateX: 0 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1], delay: 0.5 }}
            style={{ transformPerspective: 600 }}
          />
          <span className="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5">
            <span className="h-1.5 w-2/3 rounded-full bg-foreground/15" />
            <span className="h-1.5 w-1/2 rounded-full bg-foreground/10" />
          </span>
          <motion.span
            className="absolute -right-3 -top-3 grid size-9 place-items-center rounded-full bg-accent text-accent-foreground shadow-[0_0_24px_-4px_var(--accent)]"
            initial={reduce ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...spring.bouncy, delay: 1.2 }}
          >
            <MailIcon size={16} />
          </motion.span>
        </div>
      </div>

      {/* Inbox tile */}
      <motion.div
        className="absolute right-[8%] top-[10%] flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-glass"
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring.soft, delay: 1.3 }}
      >
        <Inbox size={16} className="text-accent" />
        <span className="text-xs font-medium">Sekar&apos;s inbox</span>
        <motion.span
          className="grid size-5 place-items-center rounded-full bg-accent font-mono text-[10px] font-semibold text-accent-foreground"
          animate={reduce ? undefined : { scale: [1, 1.25, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3.1, delay: 4.6 }}
        >
          1
        </motion.span>
      </motion.div>

      <span className="absolute bottom-[8%] right-[8%] rounded-full border border-border/70 bg-card/80 px-3 py-1 font-mono text-[11px] text-muted-foreground">
        reply ≤ 1 working day
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Side panel                                                         */
/* ------------------------------------------------------------------ */

const CHANNELS = [
  { href: profile.socials.email, label: "Email", value: profile.email, icon: MailIcon, external: false, note: "Best for detailed briefs" },
  { href: profile.socials.linkedin, label: "LinkedIn", value: "in/sekar-nagarajan07", icon: LinkedinIcon, external: true, note: "Best for recruiters" },
  { href: profile.socials.github, label: "GitHub", value: "SekarNagarajan07", icon: GithubIcon, external: true, note: "See my code" },
] as const;

export function Channels() {
  const reduce = useReducedMotion();
  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Prefer another channel?</p>
      <ul className="mt-4 flex flex-col gap-2">
        {CHANNELS.map(({ href, label, value, icon: Icon, external, note }, i) => (
          <motion.li
            key={label}
            initial={reduce ? false : { opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring.soft, delay: i * 0.07 }}
            className="group flex items-center rounded-2xl border border-border/60 bg-background/40 pr-2 transition-[border-color,background-color] duration-300 hover:border-accent/50 hover:bg-accent/[0.05]"
          >
            <MotionLink
              href={href}
              data-track="profile_click"
              data-track-label={label}
              {...hoverTrigger}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex min-w-0 flex-1 items-center gap-3 p-3"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-105">
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-foreground">{label}</span>
                  <span className="truncate text-[11px] text-muted-foreground">{note}</span>
                </span>
                <span className="block truncate font-mono text-xs text-muted-foreground">{value}</span>
              </span>
              <span className="text-muted-foreground transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent">
                <ArrowUpRightIcon size={16} />
              </span>
            </MotionLink>
            {label === "Email" && <CopyEmailButton source="contact" className="size-9" />}
          </motion.li>
        ))}
      </ul>
      <div className="mt-4">
        <LocalTime />
      </div>
    </div>
  );
}

const STEPS = [
  { icon: SendIcon, title: "You send a message", body: "Through the form or any channel above." },
  { icon: MailCheck, title: "You get a confirmation", body: "An automatic email confirms it arrived safely." },
  { icon: MessageSquareReply, title: "I reply personally", body: "Usually within one working day, from my own inbox." },
] as const;

export function NextSteps() {
  const reduce = useReducedMotion();
  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">What happens next</p>
      <ol className="relative mt-5 flex flex-col gap-5">
        <span aria-hidden className="absolute bottom-3 left-5 top-3 w-px bg-border">
          <motion.span
            className="absolute inset-0 origin-top bg-accent"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />
        </span>
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <motion.li
            key={title}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring.soft, delay: 0.2 + i * 0.2 }}
            className="relative flex gap-4"
          >
            <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 border-accent/60 bg-background text-accent">
              <Icon size={16} />
            </span>
            <span className="pt-1">
              <span className="block text-sm font-semibold">{title}</span>
              <span className="mt-0.5 block text-sm text-muted-foreground">{body}</span>
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
