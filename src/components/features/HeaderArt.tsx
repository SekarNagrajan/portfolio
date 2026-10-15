"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import {
  AwardIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  CodeIcon,
  DatabaseIcon,
  DownloadIcon,
  FileTextIcon,
  GithubIcon,
  GlobeIcon,
  GraduationCapIcon,
  LayersIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SendIcon,
  ServerIcon,
  SettingsIcon,
  ShieldIcon,
  SparklesIcon,
  TerminalIcon,
  UserIcon,
  ZapIcon,
  type AnimatedIconProps,
} from "@/components/icons/AnimatedIcons";
import { TechLogo, type TechLogoName } from "@/components/icons/TechLogos";
import { cn } from "@/lib/utils";

type Icon = ComponentType<AnimatedIconProps>;
type Satellite = { label: string; icon?: Icon; logo?: TechLogoName; monogram?: string };

/**
 * Page-themed configs. Kept in this client module (component references
 * can't cross the server → client boundary), selected by a string key.
 */
const VARIANTS = {
  about: {
    center: UserIcon,
    satellites: [
      { label: "Chennai", icon: MapPinIcon },
      { label: "B.E. CSE", icon: GraduationCapIcon },
      { label: "Certified", icon: AwardIcon },
      { label: "Full-stack", icon: CodeIcon },
      { label: "Performance", icon: ZapIcon },
      { label: "Security", icon: ShieldIcon },
    ],
  },
  skills: {
    center: SparklesIcon,
    satellites: [
      { label: "Languages", icon: TerminalIcon },
      { label: "Frontend", icon: CodeIcon },
      { label: "Backend", icon: ServerIcon },
      { label: "Data", icon: DatabaseIcon },
      { label: "Tooling", icon: SettingsIcon },
      { label: "Architecture", icon: LayersIcon },
    ],
  },
  projects: {
    center: LayersIcon,
    satellites: [
      { label: "Maritime", icon: GlobeIcon },
      { label: "AI", icon: SparklesIcon },
      { label: "RBAC", icon: ShieldIcon },
      { label: "SQL Server", icon: DatabaseIcon },
      { label: "Frontend", icon: CodeIcon },
      { label: "Services", icon: ServerIcon },
    ],
  },
  experience: {
    center: BriefcaseIcon,
    satellites: [
      { label: "Chennai", icon: MapPinIcon },
      { label: "Maritime", icon: GlobeIcon },
      { label: "Frontend lead", icon: CodeIcon },
      { label: "Backend", icon: ServerIcon },
      { label: "4 platforms", icon: LayersIcon },
      { label: "AI workflows", icon: SparklesIcon },
    ],
  },
  contact: {
    center: SendIcon,
    satellites: [
      { label: "Email", icon: MailIcon },
      { label: "LinkedIn", icon: LinkedinIcon },
      { label: "GitHub", icon: GithubIcon },
      { label: "Phone", icon: PhoneIcon },
      { label: "IST", icon: MapPinIcon },
      { label: "Quick reply", icon: CheckCircleIcon },
    ],
  },
  resume: {
    center: FileTextIcon,
    satellites: [
      { label: "PDF", icon: DownloadIcon },
      { label: "Experience", icon: BriefcaseIcon },
      { label: "Education", icon: GraduationCapIcon },
      { label: "Certifications", icon: AwardIcon },
      { label: "Skills", icon: CodeIcon },
      { label: "Profile", icon: UserIcon },
    ],
  },
} satisfies Record<string, { center: Icon; satellites: readonly Satellite[] }>;

export type HeaderArtVariant = keyof typeof VARIANTS;

const CASE_STUDY_CENTERS: Record<string, Icon> = {
  crm: SparklesIcon,
  anchor: GlobeIcon,
  "pams-ecommerce": LayersIcon,
  "pams-legacy": ShieldIcon,
};

/** Satellite anchor points (% of the square), clockwise from top-left. */
const POSITIONS = [
  [20, 13],
  [80, 11],
  [94, 50],
  [79, 88],
  [21, 87],
  [6, 50],
] as const;

const CYCLE_MS = 1700;

/**
 * Decorative header illustration: a glowing centre tile with the page's
 * main icon, orbited by topic tiles joined with dashed connectors.
 * - Tiles pop in, float independently, and shift with the cursor (depth).
 * - A spotlight walks around the tiles, playing each icon's hover
 *   animation in turn; hovering a tile takes over the spotlight.
 * Purely decorative — hidden from assistive tech.
 */
export function HeaderArt(
  props:
    | { variant: HeaderArtVariant; className?: string }
    | { variant: "case-study"; project: string; logos: readonly { name?: TechLogoName; label: string; monogram?: string }[]; className?: string },
) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useSpring(0, { stiffness: 80, damping: 18 });
  const py = useSpring(0, { stiffness: 80, damping: 18 });

  const Center: Icon =
    props.variant === "case-study" ? (CASE_STUDY_CENTERS[props.project] ?? LayersIcon) : VARIANTS[props.variant].center;
  const satellites: readonly Satellite[] =
    props.variant === "case-study"
      ? props.logos.slice(0, 6).map((l) => ({ label: l.label, logo: l.name, monogram: l.monogram }))
      : VARIANTS[props.variant].satellites;

  // -1 = centre tile; 0..n-1 = satellites.
  const [active, setActive] = useState(-1);
  const [hovering, setHovering] = useState<number | null>(null);
  useEffect(() => {
    if (reduce || hovering !== null) return;
    const id = setInterval(() => setActive((a) => (a + 2) % (satellites.length + 1) - 1), CYCLE_MS);
    return () => clearInterval(id);
  }, [reduce, hovering, satellites.length]);
  const lit = hovering ?? active;

  return (
    <div
      ref={ref}
      aria-hidden
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
        py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className={cn("relative mx-auto aspect-square w-full max-w-[30rem] select-none", props.className)}
    >
      {/* Rings */}
      <div className="absolute inset-[14%] animate-spin-slow rounded-full border border-dashed border-border/80 [animation-duration:50s]" />
      <div className="absolute inset-[30%] animate-spin-slow rounded-full border border-border/50 [animation-direction:reverse] [animation-duration:35s]" />
      <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_22%,transparent),transparent)]" />

      {/* Connectors */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        {satellites.map((_, i) => {
          const [x, y] = POSITIONS[i]!;
          return (
            <motion.line
              key={i}
              x1={50}
              y1={50}
              x2={x}
              y2={y}
              stroke="var(--accent)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              strokeDasharray="3 5"
              initial={{ opacity: 0 }}
              animate={{ opacity: lit === i ? 0.9 : 0.28, strokeDashoffset: reduce ? 0 : [0, -16] }}
              transition={{
                opacity: { duration: 0.4, delay: lit === i ? 0 : 0.3 + i * 0.08 },
                strokeDashoffset: { duration: 1.2, repeat: Infinity, ease: "linear" },
              }}
            />
          );
        })}
      </svg>

      {/* Centre tile */}
      <Depth px={px} py={py} depth={8} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 16, delay: 0.1 }}
          onHoverStart={() => setHovering(-1)}
          onHoverEnd={() => setHovering(null)}
        >
          <motion.div
            initial="hidden"
            animate={lit === -1 ? ["rest", "hover"] : "rest"}
            className={cn(
              "grid size-28 place-items-center rounded-[2rem] border border-border/70 bg-card text-accent transition-shadow duration-500 xl:size-32",
              lit === -1 ? "shadow-[0_0_70px_-6px_var(--accent)]" : "shadow-[0_0_44px_-12px_var(--accent)]",
            )}
          >
            <Center size={52} strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </Depth>

      {/* Satellites */}
      {satellites.map((s, i) => {
        const [x, y] = POSITIONS[i]!;
        const Icon = s.icon;
        const on = lit === i;
        return (
          <Depth
            key={s.label}
            px={px}
            py={py}
            depth={18 + (i % 3) * 6}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.45 + i * 0.1 }}
            >
              {/* CSS keyframe float (not a Motion/WAAPI loop — Chrome intermittently
                  dropped paint for one looping WAAPI transform layer). Negative
                  delays desync the tiles. */}
              <motion.div
                onHoverStart={() => setHovering(i)}
                onHoverEnd={() => setHovering(null)}
                style={{ animationDuration: `${5 + (i % 3) * 0.8}s`, animationDelay: `-${i * 0.7}s` }}
                className="flex animate-float flex-col items-center gap-2"
              >
                <motion.span
                  initial="hidden"
                  animate={on ? ["rest", "hover"] : "rest"}
                  className={cn(
                    "grid size-14 place-items-center rounded-2xl border bg-card transition-[color,border-color,box-shadow] duration-300",
                    on
                      ? "border-accent/60 text-accent shadow-[0_0_32px_-4px_var(--accent)]"
                      : "border-border/70 text-foreground/80",
                  )}
                >
                  {Icon ? <Icon size={24} /> : <TechLogo name={s.logo} fallback={s.monogram} size={24} />}
                </motion.span>
                <span
                  className={cn(
                    "whitespace-nowrap rounded-full border border-border/50 bg-background px-2 py-0.5 text-[11px] font-medium transition-colors",
                    on ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </span>
              </motion.div>
            </motion.div>
          </Depth>
        );
      })}
    </div>
  );
}

/** Translates children against the pointer; larger depth = closer layer. */
function Depth({
  px,
  py,
  depth,
  className,
  style,
  children,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  depth: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth);
  // Outer div keeps the centring translate; the inner layer takes the parallax.
  return (
    <div className={className} style={style}>
      <motion.div style={{ x, y }}>{children}</motion.div>
    </div>
  );
}
