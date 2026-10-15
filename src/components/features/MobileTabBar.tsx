"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import {
  BriefcaseIcon,
  FileTextIcon,
  HomeIcon,
  LayersIcon,
  MailIcon,
  SparklesIcon,
  UserIcon,
  type AnimatedIconProps,
} from "@/components/icons/AnimatedIcons";
import { cn } from "@/lib/utils";

const TABS: readonly { href: string; label: string; icon: ComponentType<AnimatedIconProps> }[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/projects", label: "Projects", icon: LayersIcon },
  { href: "/experience", label: "Experience", icon: BriefcaseIcon },
  { href: "/contact", label: "Contact", icon: MailIcon },
];

/** Pages behind the "More" sheet — still one extra tap away. */
const MORE_LINKS: readonly {
  href: string;
  label: string;
  note: string;
  icon: ComponentType<AnimatedIconProps>;
}[] = [
  { href: "/about", label: "About", note: "Who I am and how I got here", icon: UserIcon },
  { href: "/skills", label: "Skills", note: "The stack, with the work behind it", icon: SparklesIcon },
  { href: "/resume", label: "Resume", note: "Read it here or download the PDF", icon: FileTextIcon },
];

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

/**
 * Keeps the tab bar out of the way while the on-screen keyboard is up —
 * with `interactive-widget: resizes-content`, a fixed bottom bar would
 * otherwise ride on top of the keyboard and eat the remaining viewport.
 */
function useKeyboardOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const isField = (t: EventTarget | null) =>
      t instanceof HTMLElement && !!t.closest("input, textarea, [contenteditable='true']");
    const onFocusIn = (e: FocusEvent) => {
      if (isField(e.target)) setOpen(true);
    };
    const onFocusOut = () => {
      // Wait a tick — focus may move straight to another field.
      window.setTimeout(() => {
        if (!isField(document.activeElement)) setOpen(false);
      }, 80);
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);
  return open;
}

/** Thumb-reach navigation for viewports below the lg breakpoint. */
export function MobileTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const keyboardOpen = useKeyboardOpen();
  const moreActive = MORE_LINKS.some(({ href }) => isActive(pathname, href));
  const closeMore = () => setMoreOpen(false);

  return (
    <>
      <nav
        aria-label="Sections"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 backdrop-blur-md transition-transform duration-200 lg:hidden",
          keyboardOpen && "translate-y-full",
        )}
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <ul className="grid h-[var(--tab-bar-height)] grid-cols-5">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeMore}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-full min-h-11 flex-col items-center justify-center gap-1 px-1 text-xs font-medium leading-none transition-[transform,opacity] active:scale-95 active:opacity-70",
                    active ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  <Icon size={20} className={active ? "text-accent" : undefined} />
                  {label}
                  <ActiveDot show={active} />
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              aria-current={moreActive ? "page" : undefined}
              className={cn(
                "flex h-full min-h-11 w-full flex-col items-center justify-center gap-1 px-1 text-xs font-medium leading-none transition-[transform,opacity] active:scale-95 active:opacity-70",
                moreActive ? "text-accent" : "text-muted-foreground",
              )}
            >
              <LayoutGrid size={20} strokeWidth={1.75} />
              More
              <ActiveDot show={moreActive} />
            </button>
          </li>
        </ul>
      </nav>

      <BottomSheet open={moreOpen} onClose={() => setMoreOpen(false)} label="More pages">
        <nav aria-label="More pages" className="pb-2 pt-1">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            More
          </p>
          <ul className="flex flex-col gap-1">
            {MORE_LINKS.map(({ href, label, note, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMore}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-14 items-center gap-3.5 rounded-2xl border px-3.5 py-2.5 transition-colors active:scale-[0.99]",
                      active
                        ? "border-accent/30 bg-accent/10"
                        : "border-border/70 bg-background/40",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl",
                        active ? "bg-accent/15 text-accent" : "bg-muted/60 text-foreground",
                      )}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block text-sm font-semibold",
                          active ? "text-accent" : "text-foreground",
                        )}
                      >
                        {label}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {note}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </BottomSheet>
    </>
  );
}

/** Second visual cue for the active tab — not colour alone. */
function ActiveDot({ show }: { show: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-1 rounded-full transition-opacity",
        show ? "bg-accent opacity-100" : "opacity-0",
      )}
    />
  );
}
