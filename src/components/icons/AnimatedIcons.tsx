"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, type TargetAndTransition, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { hoverTrigger, revealTrigger } from "@/lib/motion";

/**
 * Animated icon system.
 *
 * Every icon responds to three variant labels that cascade from any
 * ancestor motion element:
 *   - `hidden` → strokes undrawn (pathLength 0)
 *   - `rest`   → strokes drawn in, idle pose
 *   - `hover`  → icon-specific micro-interaction
 *
 * Usage patterns:
 *   1. Inside a parent that sets `initial="hidden" whileInView="rest"
 *      whileHover="hover"` (e.g. <SpotlightCard>) → draw-in + hover.
 *   2. Inside <MotionLink {...hoverTrigger}> / <MotionButton> → hover only.
 *   3. Standalone with `trigger="self"` → the icon drives itself.
 * Outside any motion context they render statically, fully drawn.
 */

export type AnimatedIconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
  /** `self`: draw in when scrolled into view. `mount`: draw in on load. */
  trigger?: "parent" | "self" | "mount";
  label?: string;
};

// Trigger presets live in a non-client module so Server Components can
// spread them too (objects exported from "use client" files are opaque
// client references on the server).
export { hoverTrigger, revealTrigger };

export const MotionLink = motion.create(Link);
/** For non-route hrefs (files, mailto) where client navigation must not apply. */
export const MotionAnchor = motion.a;

const EASE = [0.16, 1, 0.3, 1] as const;

const mountTrigger = { initial: "hidden", animate: "rest", whileHover: "hover" } as const;

function triggerProps(trigger: AnimatedIconProps["trigger"]) {
  if (trigger === "self") return revealTrigger;
  if (trigger === "mount") return mountTrigger;
  return {};
}

/**
 * Ancestors like <Reveal>/<Stagger> animate `hidden` → `show`, and icons
 * inherit those labels — so `show` must mean the same as `rest`.
 */
function withShow(v: Variants): Variants {
  return { ...v, show: v.rest };
}

/** Stroke draw-in, optionally delayed so multi-path icons sketch in order. */
function draw(delay = 0, extra?: { rest?: TargetAndTransition; hover?: TargetAndTransition }): Variants {
  return withShow({
    hidden: { pathLength: 0, opacity: 0 },
    rest: {
      pathLength: 1,
      opacity: 1,
      ...extra?.rest,
      transition: {
        pathLength: { duration: 0.9, delay, ease: EASE },
        opacity: { duration: 0.2, delay },
        default: { type: "spring", stiffness: 400, damping: 22 },
      },
    },
    ...(extra?.hover ? { hover: extra.hover } : {}),
  });
}

/** Transform-only variants for a <motion.g> wrapper. */
function move(hover: TargetAndTransition, rest: TargetAndTransition = {}): Variants {
  const resetKeys = Object.fromEntries(
    Object.keys(hover)
      .filter((k) => k !== "transition")
      .map((k) => [k, k.startsWith("scale") || k === "opacity" ? 1 : 0]),
  );
  return withShow({
    hidden: { ...resetKeys, ...rest },
    rest: { ...resetKeys, ...rest, transition: { type: "spring", stiffness: 400, damping: 22 } },
    hover,
  });
}

const loop = (duration = 0.9) => ({ duration, repeat: Infinity, ease: "easeInOut" as const });

function IconRoot({
  size = 20,
  className,
  strokeWidth = 2,
  trigger = "parent",
  label,
  children,
}: AnimatedIconProps & { children: ReactNode }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable={false}
      className={cn("shrink-0 overflow-visible fill-none stroke-current", className)}
      {...triggerProps(trigger)}
    >
      {label && <title>{label}</title>}
      {children}
    </motion.svg>
  );
}

const g = (v: Variants) => ({ variants: v, style: { transformBox: "fill-box" as const, transformOrigin: "center" } });

/* ------------------------------------------------------------------ */
/* Directional                                                         */
/* ------------------------------------------------------------------ */

export function ArrowRightIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g variants={move({ x: 4, transition: { type: "spring", stiffness: 500, damping: 15 } })}>
        <motion.path d="M5 12h14" variants={draw()} />
        <motion.path d="m12 5 7 7-7 7" variants={draw(0.2)} />
      </motion.g>
    </IconRoot>
  );
}

export function ArrowUpRightIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g variants={move({ x: 2.5, y: -2.5, transition: { type: "spring", stiffness: 500, damping: 15 } })}>
        <motion.path d="M7 17 17 7" variants={draw()} />
        <motion.path d="M7 7h10v10" variants={draw(0.2)} />
      </motion.g>
    </IconRoot>
  );
}

export function ArrowUpIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g variants={move({ y: [0, -4, 0], transition: loop(0.8) })}>
        <motion.path d="m5 12 7-7 7 7" variants={draw(0.15)} />
        <motion.path d="M12 19V5" variants={draw()} />
      </motion.g>
    </IconRoot>
  );
}

export function DownloadIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" variants={draw()} />
      <motion.g variants={move({ y: [0, 3, 0], transition: loop(0.8) })}>
        <motion.path d="M12 15V3" variants={draw(0.15)} />
        <motion.path d="m7 10 5 5 5-5" variants={draw(0.3)} />
      </motion.g>
    </IconRoot>
  );
}

/* ------------------------------------------------------------------ */
/* Communication                                                       */
/* ------------------------------------------------------------------ */

export function MailIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.rect x="2" y="4" width="20" height="16" rx="2" variants={draw()} />
      <motion.path
        d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
        variants={draw(0.25, {
          hover: { pathLength: [0, 1], transition: { duration: 0.6, ease: EASE } },
        })}
      />
    </IconRoot>
  );
}

export function SendIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g
        variants={move({
          x: [0, 14, -14, 0],
          y: [0, -14, 14, 0],
          opacity: [1, 0, 0, 1],
          transition: { duration: 0.9, times: [0, 0.45, 0.46, 1], ease: "easeInOut" },
        }, { opacity: 1 })}
      >
        <motion.path
          d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
          variants={draw()}
        />
        <motion.path d="m21.854 2.147-10.94 10.939" variants={draw(0.3)} />
      </motion.g>
    </IconRoot>
  );
}

export function PhoneIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g {...g(move({ rotate: [0, -14, 12, -8, 6, 0], transition: { duration: 0.6 } }))}>
        <motion.path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
          variants={draw()}
        />
      </motion.g>
    </IconRoot>
  );
}

export function MapPinIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g variants={move({ y: [0, -4, 0], transition: { ...loop(0.7), ease: "easeOut" } })}>
        <motion.path
          d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
          variants={draw()}
        />
        <motion.circle cx="12" cy="10" r="3" variants={draw(0.35)} />
      </motion.g>
    </IconRoot>
  );
}

/* ------------------------------------------------------------------ */
/* Disciplines                                                         */
/* ------------------------------------------------------------------ */

export function CodeIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g variants={move({ x: -2.5 })}>
        <motion.path d="m8 6-6 6 6 6" variants={draw()} />
      </motion.g>
      <motion.g variants={move({ x: 2.5 })}>
        <motion.path d="m16 18 6-6-6-6" variants={draw(0.1)} />
      </motion.g>
      <motion.g {...g(move({ rotate: 20 }))}>
        <motion.path d="m14.5 4-5 16" variants={draw(0.3)} />
      </motion.g>
    </IconRoot>
  );
}

export function ServerIcon(p: AnimatedIconProps) {
  const blink = (delay: number) => ({
    opacity: [1, 0.15, 1],
    transition: { duration: 0.6, repeat: Infinity, delay },
  });
  return (
    <IconRoot {...p}>
      <motion.rect x="2" y="2" width="20" height="8" rx="2" variants={draw()} />
      <motion.rect x="2" y="14" width="20" height="8" rx="2" variants={draw(0.15)} />
      <motion.path d="M6 6h.01" variants={{ ...draw(0.5), hover: blink(0) }} />
      <motion.path d="M6 18h.01" variants={{ ...draw(0.6), hover: blink(0.3) }} />
      <motion.path d="M10 6h6M10 18h6" variants={draw(0.4)} />
    </IconRoot>
  );
}

export function SparklesIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g {...g(move({ rotate: [0, 15, -10, 0], scale: [1, 1.12, 1], transition: { duration: 0.8 } }))}>
        <motion.path
          d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
          variants={draw()}
        />
      </motion.g>
      <motion.g {...g(move({ scale: [1, 0.4, 1.3, 1], transition: { duration: 0.7, repeat: Infinity, repeatDelay: 0.2 } }))}>
        <motion.path d="M20 3v4M22 5h-4" variants={draw(0.4)} />
      </motion.g>
      <motion.g {...g(move({ scale: [1, 1.4, 0.5, 1], transition: { duration: 0.7, repeat: Infinity, delay: 0.35, repeatDelay: 0.2 } }))}>
        <motion.path d="M4 17v2M5 18H3" variants={draw(0.5)} />
      </motion.g>
    </IconRoot>
  );
}

export function DatabaseIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g variants={move({ y: -2.5 })}>
        <motion.ellipse cx="12" cy="5" rx="9" ry="3" variants={draw()} />
      </motion.g>
      <motion.path d="M3 5v14a9 3 0 0 0 18 0V5" variants={draw(0.15)} />
      <motion.g variants={move({ y: -1.2 })}>
        <motion.path d="M3 12a9 3 0 0 0 18 0" variants={draw(0.3)} />
      </motion.g>
    </IconRoot>
  );
}

export function SettingsIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g {...g(move({ rotate: 180, transition: { type: "spring", stiffness: 120, damping: 14 } }))}>
        <motion.path
          d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
          variants={draw()}
        />
        <motion.circle cx="12" cy="12" r="3" variants={draw(0.4)} />
      </motion.g>
    </IconRoot>
  );
}

export function TerminalIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g variants={move({ x: [0, 2, 0], transition: loop(0.8) })}>
        <motion.path d="m4 17 6-6-6-6" variants={draw()} />
      </motion.g>
      <motion.path
        d="M12 19h8"
        variants={draw(0.3, { hover: { opacity: [1, 0, 1], transition: { duration: 0.8, repeat: Infinity, ease: "linear" } } })}
      />
    </IconRoot>
  );
}

export function LayersIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g variants={move({ y: -2.5 })}>
        <motion.path
          d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"
          variants={draw()}
        />
      </motion.g>
      <motion.path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" variants={draw(0.2)} />
      <motion.g variants={move({ y: 2.5 })}>
        <motion.path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" variants={draw(0.35)} />
      </motion.g>
    </IconRoot>
  );
}

export function ZapIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.path
        d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
        fill="currentColor"
        variants={draw(0, {
          rest: { fillOpacity: 0 },
          hover: { fillOpacity: [0, 1, 0], transition: { duration: 0.7, repeat: Infinity } },
        })}
      />
    </IconRoot>
  );
}

export function ShieldIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.path
        d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
        variants={draw()}
      />
      <motion.path
        d="m9 12 2 2 4-4"
        variants={draw(0.45, { hover: { pathLength: [0, 1], transition: { duration: 0.5, ease: EASE } } })}
      />
    </IconRoot>
  );
}

export function CheckCircleIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.circle cx="12" cy="12" r="10" variants={draw()} />
      <motion.path d="m9 12 2 2 4-4" variants={draw(0.4)} />
    </IconRoot>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

export function HomeIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.path
        d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        variants={draw()}
      />
      <motion.g variants={move({ y: -1.5 })}>
        <motion.path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" variants={draw(0.3)} />
      </motion.g>
    </IconRoot>
  );
}

export function UserIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g variants={move({ y: [0, -2, 0], transition: { duration: 0.5 } })}>
        <motion.circle cx="12" cy="7" r="4" variants={draw()} />
      </motion.g>
      <motion.path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" variants={draw(0.25)} />
    </IconRoot>
  );
}

export function BriefcaseIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g variants={move({ y: -2 })}>
        <motion.path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" variants={draw(0.3)} />
      </motion.g>
      <motion.g {...g(move({ rotate: [0, -4, 4, 0], transition: { duration: 0.5 } }))}>
        <motion.rect x="2" y="6" width="20" height="14" rx="2" variants={draw()} />
        <motion.path d="M2 12h20" variants={draw(0.45)} />
      </motion.g>
    </IconRoot>
  );
}

export function GraduationCapIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g {...g(move({ y: -3, rotate: -8, transition: { type: "spring", stiffness: 400, damping: 12 } }))}>
        <motion.path
          d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
          variants={draw()}
        />
        <motion.path d="M22 10v6" variants={draw(0.4)} />
      </motion.g>
      <motion.path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" variants={draw(0.25)} />
    </IconRoot>
  );
}

export function AwardIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g {...g(move({ rotate: [0, -12, 10, 0], scale: [1, 1.08, 1], transition: { duration: 0.6 } }))}>
        <motion.circle cx="12" cy="8" r="6" variants={draw()} />
      </motion.g>
      <motion.path
        d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"
        variants={draw(0.35)}
      />
    </IconRoot>
  );
}

export function FileTextIcon(p: AnimatedIconProps) {
  const line = (d: string, i: number) => (
    <motion.path
      key={d}
      d={d}
      variants={draw(0.35 + i * 0.1, {
        hover: { pathLength: [0, 1], transition: { duration: 0.4, delay: i * 0.08, ease: EASE } },
      })}
    />
  );
  return (
    <IconRoot {...p}>
      <motion.path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" variants={draw()} />
      <motion.path d="M14 2v4a2 2 0 0 0 2 2h4" variants={draw(0.2)} />
      {["M10 9H8", "M16 13H8", "M16 17H8"].map(line)}
    </IconRoot>
  );
}

export function GlobeIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.circle cx="12" cy="12" r="10" variants={draw()} />
      <motion.g {...g(move({ scaleX: [1, -1, 1], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } }))}>
        <motion.path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" variants={draw(0.25)} />
      </motion.g>
      <motion.path d="M2 12h20" variants={draw(0.4)} />
    </IconRoot>
  );
}

/* ------------------------------------------------------------------ */
/* Utility                                                             */
/* ------------------------------------------------------------------ */

export function SearchIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g {...g(move({ rotate: [0, -12, 8, 0], scale: [1, 1.1, 1], transition: { duration: 0.5 } }))}>
        <motion.circle cx="11" cy="11" r="8" variants={draw()} />
        <motion.path d="m21 21-4.3-4.3" variants={draw(0.35)} />
      </motion.g>
    </IconRoot>
  );
}

export function CopyIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g variants={move({ x: 1.5, y: 1.5 })}>
        <motion.rect x="8" y="8" width="14" height="14" rx="2" ry="2" variants={draw()} />
      </motion.g>
      <motion.g variants={move({ x: -1, y: -1 })}>
        <motion.path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" variants={draw(0.25)} />
      </motion.g>
    </IconRoot>
  );
}

export function SunIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.circle cx="12" cy="12" r="4" variants={draw()} />
      <motion.g {...g(move({ rotate: 90, transition: { type: "spring", stiffness: 140, damping: 14 } }))}>
        {["M12 2v2", "M12 20v2", "m4.93 4.93 1.41 1.41", "m17.66 17.66 1.41 1.41", "M2 12h2", "M20 12h2", "m6.34 17.66-1.41 1.41", "m19.07 4.93-1.41 1.41"].map((d, i) => (
          <motion.path key={d} d={d} variants={draw(0.2 + i * 0.04)} />
        ))}
      </motion.g>
    </IconRoot>
  );
}

export function MoonIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.g {...g(move({ rotate: [0, -18, 12, 0], transition: { duration: 0.6 } }))}>
        <motion.path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" variants={draw()} />
      </motion.g>
    </IconRoot>
  );
}

export function MonitorIcon(p: AnimatedIconProps) {
  return (
    <IconRoot {...p}>
      <motion.rect x="2" y="3" width="20" height="14" rx="2" variants={draw()} />
      <motion.g variants={move({ y: [0, 1.5, 0], transition: { duration: 0.4 } })}>
        <motion.path d="M8 21h8M12 17v4" variants={draw(0.3)} />
      </motion.g>
    </IconRoot>
  );
}

/* ------------------------------------------------------------------ */
/* Brand marks — filled glyphs, so they pop + wiggle instead of draw.  */
/* ------------------------------------------------------------------ */

const brandVariants: Variants = withShow({
  hidden: { opacity: 0, scale: 0.6 },
  rest: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 400, damping: 20 } },
  hover: { scale: 1.15, rotate: [0, -10, 8, 0], transition: { duration: 0.5 } },
});

function BrandRoot({ size = 18, className, label, trigger = "parent", children }: AnimatedIconProps & { children: ReactNode }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable={false}
      className={cn("shrink-0", className)}
      {...triggerProps(trigger)}
    >
      <motion.g {...g(brandVariants)}>{children}</motion.g>
    </motion.svg>
  );
}

export function GithubIcon(p: AnimatedIconProps) {
  return (
    <BrandRoot {...p}>
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.98 3.23 9.2 7.71 10.69.56.1.77-.24.77-.54 0-.27-.01-1.17-.02-2.12-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.97 0 0 .94-.3 3.09 1.15.9-.25 1.86-.37 2.82-.38.96 0 1.92.13 2.82.38 2.15-1.45 3.09-1.15 3.09-1.15.61 1.54.23 2.69.11 2.97.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.28-5.15 5.56.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.07 0 .3.2.65.78.54 4.47-1.49 7.7-5.71 7.7-10.69C23.25 5.48 18.27.5 12 .5Z" />
    </BrandRoot>
  );
}

export function LinkedinIcon(p: AnimatedIconProps) {
  return (
    <BrandRoot {...p}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .78 0 1.74v20.52C0 23.22.79 24 1.77 24h20.45C23.21 24 24 23.22 24 22.26V1.74C24 .78 23.21 0 22.22 0Z" />
    </BrandRoot>
  );
}
