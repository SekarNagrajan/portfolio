"use client";

import { useState, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "motion/react";
import { RotateCcw } from "lucide-react";
import { CopyEmailButton } from "@/components/features/CopyEmailButton";
import {
  ArrowRightIcon,
  AwardIcon,
  BriefcaseIcon,
  FileTextIcon,
  GithubIcon,
  GraduationCapIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  MotionLink,
  PhoneIcon,
  UserIcon,
  hoverTrigger,
} from "@/components/icons/AnimatedIcons";
import { profile } from "@/lib/data/profile";
import { education, certifications } from "@/lib/data/education";
import { experiences } from "@/lib/data/experiences";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const word: Variants = {
  hidden: { y: "110%", rotate: 3 },
  show: { y: "0%", rotate: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

function Words({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span variants={word} className={cn("inline-block", className)}>
              {w}
            </motion.span>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

/** About-page hero: introduction on the left, a hanging ID badge on the right. */
export function AboutHero() {
  const degree = education[0];
  const job = experiences[0];

  const facts = [
    { icon: MapPinIcon, label: profile.location },
    { icon: BriefcaseIcon, label: "3+ years in production" },
    { icon: GraduationCapIcon, label: `B.E. CSE · ${degree.score.replace(" / 10", "")}` },
    { icon: AwardIcon, label: "React & Spring Boot certified" },
  ];

  return (
    <section
      aria-labelledby="about-title"
      className="shell relative pt-[max(6rem,calc(env(safe-area-inset-top)+4.5rem))] lg:pt-40"
    >
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] xl:gap-14">
        <motion.div initial="hidden" animate="show" variants={staggerContainer} className="flex flex-col items-start gap-6">
          <motion.p
            variants={fadeUp}
            className="glass-sm inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent"
          >
            <UserIcon size={14} trigger="mount" /> About
          </motion.p>

          <h1 id="about-title" className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            <motion.span variants={staggerContainer} className="block">
              <Words text={`Hi, I'm ${profile.firstName}.`} />
            </motion.span>
            <motion.span variants={staggerContainer} className="mt-2 block text-[0.62em] leading-tight text-foreground/90">
              <Words text="I build" />
              <Words text="enterprise software" className="text-gradient" />
              <Words text="that feels effortless." />
            </motion.span>
          </h1>

          <motion.p variants={fadeUp} className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {profile.summary}
          </motion.p>

          <motion.ul variants={staggerContainer} className="flex flex-wrap gap-2">
            {facts.map(({ icon: Icon, label }) => (
              <motion.li
                key={label}
                variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } } }}
                className="glass-sm inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-foreground/85"
              >
                <Icon size={15} className="text-accent" />
                {label}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-2">
            <MotionLink
              {...hoverTrigger}
              href="/contact"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background active:scale-95"
            >
              Say hello <ArrowRightIcon size={16} />
            </MotionLink>
            <MotionLink
              {...hoverTrigger}
              href="/resume"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:border-accent/50"
            >
              <FileTextIcon size={16} /> Resume
            </MotionLink>
            <CopyEmailButton source="about" className="size-12" />
          </motion.div>
        </motion.div>

        <IdBadge currentRole={`${job.role} · ${job.company.split(" ")[0]}`} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* ID badge — swings in on its lanyard, tilts with the cursor, flips. */
/* ------------------------------------------------------------------ */

function IdBadge({ currentRole }: { currentRole: string }) {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const rx = useSpring(0, { stiffness: 150, damping: 16 });
  const ry = useSpring(0, { stiffness: 150, damping: 16 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(30);
  const sheen = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 55%)`;

  const extras = (
    [
      ["Work authorization", profile.workAuth],
      ["Work mode", profile.workMode],
      ["Notice", profile.notice],
    ] as const
  ).filter(([, v]) => v.length > 0);

  return (
    <div className="relative mx-auto w-full max-w-[400px] lg:max-w-none">
      {/* Fills its column on large screens; capped on phones so it stays card-shaped. */}
      {/* Lanyard */}
      <motion.div
        aria-hidden
        initial={reduce ? false : { scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="mx-auto h-16 w-10 origin-top bg-[repeating-linear-gradient(90deg,var(--accent)_0_3px,color-mix(in_oklab,var(--accent)_55%,transparent)_3px_6px)] opacity-80 [clip-path:polygon(0_0,100%_0,62%_100%,38%_100%)]"
      />
      <motion.div
        initial={reduce ? false : { y: -60, rotate: -9, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, damping: 7, mass: 1.1, delay: 0.35 }}
        style={{ transformOrigin: "50% -4rem" }}
        className="[perspective:1200px]"
      >
        {/* Clip */}
        <div aria-hidden className="relative z-10 mx-auto -mb-3 h-6 w-16 rounded-md border border-border bg-card shadow-glass">
          <span className="absolute inset-x-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border" />
        </div>

        <motion.div
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          onPointerMove={(e) => {
            if (reduce || e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            ry.set((px - 0.5) * 18);
            rx.set(-(py - 0.5) * 14);
            gx.set(px * 100);
            gy.set(py * 100);
          }}
          onPointerLeave={() => {
            rx.set(0);
            ry.set(0);
          }}
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 15 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative grid"
          >
            {/* Front */}
            <Face hidden={flipped} sheen={sheen}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Engineer profile</span>
                <span className="grid size-6 place-items-center rounded-md bg-accent font-mono text-[10px] font-bold text-background">SN</span>
              </div>

              <div className="mt-6 flex flex-col items-center text-center">
                <div className="relative grid size-28 place-items-center overflow-hidden rounded-full">
                  <motion.span
                    aria-hidden
                    className="absolute -inset-2 bg-[conic-gradient(from_0deg,var(--accent),transparent_30%,transparent_55%,var(--accent)_80%,var(--accent))]"
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                  <span aria-hidden className="absolute inset-[3px] rounded-full bg-card" />
                  <span className="relative grid size-[5.75rem] place-items-center rounded-full bg-linear-to-br from-accent to-accent/60 text-3xl font-bold text-background shadow-[0_0_40px_-12px_var(--accent)]">
                    SN
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">{profile.title}</p>
                <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                  </span>
                  Open to new roles
                </span>
              </div>

              <dl className="mt-6 divide-y divide-border/60 rounded-xl border border-border/60 text-sm">
                <Row label="Based in">{profile.location}</Row>
                <Row label="Currently">{currentRole}</Row>
                <Row label="Experience">3+ years</Row>
              </dl>

              <div className="mt-5 flex items-end justify-between gap-4">
                <span aria-hidden className="flex h-8 items-end gap-[2px]">
                  {[3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1].map((w, i) => (
                    <span key={i} className="h-full bg-foreground/50" style={{ width: w }} />
                  ))}
                </span>
                <FlipButton onClick={() => setFlipped(true)} label="See contact details" />
              </div>
            </Face>

            {/* Back */}
            <Face back hidden={!flipped} sheen={sheen}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Contact & credentials</span>
                <span className="grid size-6 place-items-center rounded-md bg-accent font-mono text-[10px] font-bold text-background">SN</span>
              </div>

              <ul className="mt-6 flex flex-col gap-2 text-sm">
                <li className="flex items-center gap-3 rounded-xl border border-border/60 p-2.5">
                  <MailIcon size={16} className="shrink-0 text-accent" />
                  <a href={profile.socials.email} className="min-w-0 flex-1 truncate hover:underline">
                    {profile.email}
                  </a>
                  <CopyEmailButton source="about-badge" className="size-8" />
                </li>
                <li className="flex items-center gap-3 rounded-xl border border-border/60 p-2.5">
                  <PhoneIcon size={16} className="shrink-0 text-accent" />
                  <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="hover:underline">
                    {profile.phone}
                  </a>
                </li>
                <li className="grid grid-cols-2 gap-2">
                  <SocialLink href={profile.socials.linkedin} icon={<LinkedinIcon size={15} />} label="LinkedIn" />
                  <SocialLink href={profile.socials.github} icon={<GithubIcon size={15} />} label="GitHub" />
                </li>
              </ul>

              <dl className="mt-5 divide-y divide-border/60 rounded-xl border border-border/60 text-sm">
                <Row label="Degree">B.E. CSE · {education[0].score.replace("CGPA ", "")}</Row>
                <Row label="Certified">{certifications[0].title.split(" — ")[0]}</Row>
                <Row label="Core stack">React · Spring Boot · Java 21</Row>
                {extras.map(([label, value]) => (
                  <Row key={label} label={label}>
                    {value}
                  </Row>
                ))}
              </dl>

              <div className="mt-auto flex justify-end pt-5">
                <FlipButton onClick={() => setFlipped(false)} label="Back to profile" />
              </div>
            </Face>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Face({
  back = false,
  hidden,
  sheen,
  children,
}: {
  back?: boolean;
  hidden: boolean;
  sheen: ReturnType<typeof useMotionTemplate>;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden={hidden}
      inert={hidden}
      className={cn(
        "relative col-start-1 row-start-1 flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-glass-lg [backface-visibility:hidden]",
        back && "[transform:rotateY(180deg)]",
      )}
    >
      <motion.span aria-hidden style={{ background: sheen }} className="pointer-events-none absolute inset-0" />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent" />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-3 py-2.5">
      <dt className="shrink-0 text-xs text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{children}</dd>
    </div>
  );
}

function FlipButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
    >
      <RotateCcw size={12} className="transition-transform duration-500 group-hover:-rotate-180" />
      {label}
    </button>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-track="profile_click"
      data-track-label={label}
      className="flex items-center justify-center gap-2 rounded-xl border border-border/60 p-2.5 text-sm transition-colors hover:border-accent/50 hover:text-accent"
    >
      {icon}
      {label}
    </a>
  );
}
