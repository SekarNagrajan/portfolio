"use client";

import { useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";
import { profile } from "@/lib/data/profile";
import { MobileTabBar } from "@/components/features/MobileTabBar";
import {
  BriefcaseIcon,
  FileTextIcon,
  HomeIcon,
  LayersIcon,
  MailIcon,
  MotionLink,
  SparklesIcon,
  UserIcon,
  hoverTrigger,
  type AnimatedIconProps,
} from "@/components/icons/AnimatedIcons";

const NAV_LINKS: readonly { href: string; label: string; icon: ComponentType<AnimatedIconProps> }[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/about", label: "About", icon: UserIcon },
  { href: "/skills", label: "Skills", icon: SparklesIcon },
  { href: "/projects", label: "Projects", icon: LayersIcon },
  { href: "/experience", label: "Experience", icon: BriefcaseIcon },
  { href: "/resume", label: "Resume", icon: FileTextIcon },
];

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

function pageTitle(pathname: string): string {
  if (pathname === "/") return "Home";
  if (pathname.startsWith("/projects/")) return "Case study";
  if (pathname.startsWith("/projects")) return "Projects";
  if (pathname.startsWith("/about")) return "About";
  if (pathname.startsWith("/skills")) return "Skills";
  if (pathname.startsWith("/experience")) return "Experience";
  if (pathname.startsWith("/resume")) return "Resume";
  if (pathname.startsWith("/contact")) return "Contact";
  return "Portfolio";
}

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Stays pinned while scrolling; switches to the glass surface once the
  // page moves so it reads clearly over content.
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: "-120%" }}
        animate={{ y: "0%" }}
        transition={reduce ? { duration: 0 } : { ...spring.soft, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] lg:pt-3"
      >
        <nav
          aria-label="Primary"
          className="flex h-14 items-center lg:shell lg:h-[var(--nav-height)]"
        >
          <div
            className={cn(
              "flex h-14 w-full items-center justify-between gap-2 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl",
              "lg:h-auto lg:gap-4 lg:rounded-full lg:border-b-0 lg:bg-transparent lg:px-4 lg:py-2 lg:backdrop-blur-none",
              scrolled
                ? "lg:glass lg:shadow-[0_8px_40px_-12px_rgb(0_0_0/0.6)]"
                : "lg:border lg:border-transparent",
            )}
          >
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-2.5 rounded-full pl-1 pr-2 font-semibold tracking-tight"
            >
              <span
                aria-hidden
                className="relative grid size-9 place-items-center rounded-full bg-gradient-to-br from-accent to-accent/60 text-sm font-bold text-background shadow-[0_0_24px_-4px_var(--accent)] transition-transform duration-500 group-hover:rotate-[360deg]"
              >
                SN
              </span>
              <span className="text-foreground">{profile.firstName}</span>
              <span className="hidden text-muted-foreground sm:inline"> Nagarajan</span>
            </Link>

            <p className="min-w-0 flex-1 truncate text-center text-sm font-medium text-muted-foreground lg:hidden">
              {pageTitle(pathname)}
            </p>

            {/* Desktop nav */}
            <ul className="hidden items-center gap-0.5 lg:flex">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href}>
                    <MotionLink
                      href={href}
                      {...hoverTrigger}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
                        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          transition={reduce ? { duration: 0 } : spring.snappy}
                          className="absolute inset-0 -z-10 rounded-full bg-muted/80 ring-1 ring-inset ring-border"
                        />
                      )}
                      <Icon size={16} className={active ? "text-accent" : undefined} />
                      {label}
                    </MotionLink>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-1 sm:gap-2">
              <MotionLink
                href="/contact"
                {...hoverTrigger}
                className="hidden h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-transform active:scale-95 lg:inline-flex"
              >
                <MailIcon size={16} />
                Let&apos;s talk
              </MotionLink>
            </div>
          </div>
        </nav>
      </motion.header>
      <MobileTabBar />
    </>
  );
}
