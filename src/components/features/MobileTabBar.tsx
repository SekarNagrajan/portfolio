"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseIcon,
  FileTextIcon,
  HomeIcon,
  LayersIcon,
  MailIcon,
  type AnimatedIconProps,
} from "@/components/icons/AnimatedIcons";
import { cn } from "@/lib/utils";

const TABS: readonly { href: string; label: string; icon: ComponentType<AnimatedIconProps> }[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/projects", label: "Projects", icon: LayersIcon },
  { href: "/experience", label: "Experience", icon: BriefcaseIcon },
  { href: "/resume", label: "Resume", icon: FileTextIcon },
  { href: "/contact", label: "Contact", icon: MailIcon },
];

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

/** Thumb-reach navigation for viewports below the lg breakpoint. */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/90 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid h-[var(--tab-bar-height)] grid-cols-5">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full min-h-11 flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium leading-none",
                  active ? "text-accent" : "text-muted-foreground",
                )}
              >
                <Icon size={20} className={active ? "text-accent" : undefined} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
