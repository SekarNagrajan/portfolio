"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { profile } from "@/lib/data/profile";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { CountUp, Magnetic, RotatingText } from "@/components/motion/Effects";
import { HeroVisual } from "@/components/features/HeroVisual";
import { Glass } from "@/components/ui/glass";
import {
  ArrowRightIcon,
  DownloadIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  MotionAnchor,
  MotionLink,
  hoverTrigger,
} from "@/components/icons/AnimatedIcons";

const ROLES = [
  "multi-tenant SaaS",
  "enterprise design systems",
  "Spring Boot services",
  "AI-powered workflows",
] as const;

const STATS = [
  { value: 3, suffix: "+", label: "Years experience" },
  { value: 4, suffix: "", label: "Platforms in production" },
  { value: 40, suffix: "+", label: "Screens architected" },
  { value: 80, suffix: "%", label: "ANCHOR frontend owned" },
] as const;

const SOCIALS = [
  { href: profile.socials.github, label: "GitHub", icon: GithubIcon, external: true },
  { href: profile.socials.linkedin, label: "LinkedIn", icon: LinkedinIcon, external: true },
  { href: profile.socials.email, label: "Email", icon: MailIcon, external: false },
] as const;

/** Word-level mask reveal: each word slides up from behind a clip. */
function SplitWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", rotate: 4 },
              show: {
                y: "0%",
                rotate: 0,
                transition: { type: "spring", stiffness: 120, damping: 18, delay: delay + i * 0.08 },
              },
            }}
          >
            {word}
            {" "}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const yVisual = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);

  const [first, ...rest] = profile.name.split(" ");

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-dvh items-center overflow-hidden pt-[max(6rem,calc(env(safe-area-inset-top)+4.5rem))] pb-[calc(var(--tab-bar-height)+env(safe-area-inset-bottom)+1.5rem)] lg:pt-28 lg:pb-16"
    >
      {/* Hero-local spotlight on top of the global aurora. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_22%,transparent),transparent)]" />
      </div>

      <div className="shell grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16 xl:gap-24">
        <motion.div
          style={{ y: yText, opacity: fade }}
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="flex flex-col items-start gap-6 sm:gap-7"
        >
          <motion.span
            variants={fadeUp}
            className="glass-sm inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium text-foreground/90"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {profile.availability}
          </motion.span>

          <h1
            id="hero-title"
            className="text-balance text-[clamp(2.25rem,11vw,7.5rem)] font-bold leading-[0.95] tracking-tighter"
          >
            <SplitWords text={first} />
            <SplitWords text={rest.join(" ")} className="text-gradient" delay={0.1} />
          </h1>

          <motion.p variants={fadeUp} className="text-xl font-medium text-foreground/90 sm:text-2xl lg:text-3xl">
            {profile.title} building{" "}
            <RotatingText words={ROLES} className="text-accent" />
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <MotionLink
                href="/projects"
                {...hoverTrigger}
                className="inline-flex h-13 items-center gap-2.5 rounded-full bg-foreground px-7 text-base font-semibold text-background shadow-glass transition-transform active:scale-95"
              >
                View projects <ArrowRightIcon size={18} />
              </MotionLink>
            </Magnetic>
            <Magnetic>
              <Glass intensity="md" interactive rounded="full" asChild>
                <MotionAnchor
                  href="/resume.pdf"
                  download="Sekar_Nagarajan_Resume.pdf"
                  data-track="cv_download"
                  data-track-label="hero"
                  {...hoverTrigger}
                  className="inline-flex h-13 items-center gap-2.5 px-7 text-base font-semibold text-foreground active:scale-95"
                >
                  <DownloadIcon size={18} /> Download CV
                </MotionAnchor>
              </Glass>
            </Magnetic>
            <div role="group" aria-label="Social links" className="flex items-center gap-2 sm:ml-2">
              {SOCIALS.map(({ href, label, icon: Icon, external }) => (
                <Glass key={label} intensity="sm" interactive rounded="full" asChild>
                  <MotionLink
                    href={href}
                    data-track="profile_click"
                    data-track-label={label}
                    {...hoverTrigger}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={label}
                    className="grid size-12 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon size={18} />
                  </MotionLink>
                </Glass>
              ))}
            </div>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="glass mt-2 grid w-full grid-cols-2 divide-x divide-y divide-border/50 overflow-hidden rounded-2xl sm:grid-cols-4 sm:divide-y-0"
          >
            {STATS.map((s) => (
              <div key={s.label} className="px-5 py-4">
                <dd className="text-3xl font-semibold tracking-tight text-foreground">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-1 text-xs text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div style={{ y: yVisual }} className="relative mx-auto w-full max-w-[460px] sm:max-w-[540px] lg:mx-0 lg:max-w-[660px]">
          <HeroVisual />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#stack"
        aria-label="Scroll to tech stack"
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground lg:flex"
      >
        Scroll
        <span className="relative h-10 w-6 rounded-full border border-border">
          <motion.span
            className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-accent"
            animate={reduce ? undefined : { y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
