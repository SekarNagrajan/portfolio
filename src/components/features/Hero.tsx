"use client";

import Link from "next/link";
import { ArrowRight, Download, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { spring, fadeUp, staggerContainer } from "@/lib/motion";
import { profile } from "@/lib/data/profile";

export function Hero() {
  const reduce = useReducedMotion();
  const container = reduce ? undefined : staggerContainer;
  const item = reduce ? undefined : fadeUp;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      {/* Ambient background — fully transformable, no reflow cost. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute right-[-10%] top-[20%] h-[380px] w-[380px] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 pb-20 pt-24 sm:pt-32"
      >
        <motion.div variants={item}>
          <Badge variant="accent" className="gap-2 px-3 py-1 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {profile.availability}
          </Badge>
        </motion.div>

        <motion.h1
          id="hero-title"
          variants={item}
          className="max-w-4xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          {profile.name}
          <span className="mt-3 block text-muted-foreground">
            {profile.title}
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-wrap items-center gap-3"
        >
          <motion.div
            whileHover={reduce ? undefined : { y: -2 }}
            transition={spring.snappy}
          >
            <Button asChild size="lg" className="gap-2">
              <Link href="/projects">
                View projects <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={reduce ? undefined : { y: -2 }}
            transition={spring.snappy}
          >
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/resume">
                <Download className="size-4" /> Download CV
              </Link>
            </Button>
          </motion.div>

          <div
            className="ml-1 flex items-center gap-1"
            role="group"
            aria-label="Social links"
          >
            <Link
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <GithubIcon size={16} />
            </Link>
            <Link
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <LinkedinIcon size={16} />
            </Link>
            <Link
              href={profile.socials.email}
              aria-label="Email"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <Mail className="size-4" />
            </Link>
          </div>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-8 grid w-full max-w-xl grid-cols-3 gap-4 border-t border-border/60 pt-8 text-sm sm:gap-6"
        >
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Experience
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-foreground">3+ yrs</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Platforms shipped
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-foreground">4</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Stack depth
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-foreground">Full</dd>
          </div>
        </motion.dl>
      </motion.div>
    </section>
  );
}
