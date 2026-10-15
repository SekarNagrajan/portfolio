"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { track } from "@vercel/analytics";
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  CopyIcon,
  DownloadIcon,
  FileTextIcon,
  GithubIcon,
  HomeIcon,
  LayersIcon,
  LinkedinIcon,
  MailIcon,
  MonitorIcon,
  MoonIcon,
  SearchIcon,
  SparklesIcon,
  SunIcon,
  UserIcon,
  hoverTrigger,
  type AnimatedIconProps,
} from "@/components/icons/AnimatedIcons";
import { TechLogo, type TechLogoName } from "@/components/icons/TechLogos";
import { useTheme } from "@/components/layout/Theme";
import { caseStudies } from "@/lib/data/case-studies";
import { profile } from "@/lib/data/profile";
import { stack } from "@/lib/data/stack";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Context — lets the Navbar (or anything) open the palette.          */
/* ------------------------------------------------------------------ */

const PaletteContext = createContext<{ open: () => void } | null>(null);

export function useCommandPalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("useCommandPalette must be used inside <CommandPaletteProvider>");
  return ctx;
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // "/" opens it too — unless the user is typing somewhere.
      const t = e.target as HTMLElement | null;
      const typing = t?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t?.tagName ?? "");
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = useCallback(() => setOpen(true), []);

  return (
    <PaletteContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>{isOpen && <PaletteDialog onClose={() => setOpen(false)} />}</AnimatePresence>
    </PaletteContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Commands                                                            */
/* ------------------------------------------------------------------ */

type Command = {
  id: string;
  group: "Pages" | "Case studies" | "Technologies" | "Actions" | "Theme";
  label: string;
  hint?: string;
  keywords?: string;
  icon?: ComponentType<AnimatedIconProps>;
  logo?: { name?: TechLogoName; monogram?: string };
  run: () => void;
};

const GROUP_ORDER: readonly Command["group"][] = ["Pages", "Case studies", "Actions", "Theme", "Technologies"];

function useCommands(close: () => void): Command[] {
  const router = useRouter();
  const { setPreference } = useTheme();

  return useMemo(() => {
    const go = (href: string) => () => {
      close();
      router.push(href);
    };
    const external = (href: string, label: string) => () => {
      close();
      track("profile_click", { label, source: "palette" });
      window.open(href, "_blank", "noopener,noreferrer");
    };

    const pages: Command[] = [
      { id: "p-home", group: "Pages", label: "Home", icon: HomeIcon, run: go("/") },
      { id: "p-about", group: "Pages", label: "About", hint: "Story, education, principles", icon: UserIcon, run: go("/about") },
      { id: "p-skills", group: "Pages", label: "Skills", hint: "Full technical matrix", icon: SparklesIcon, run: go("/skills") },
      { id: "p-projects", group: "Pages", label: "Projects", icon: LayersIcon, run: go("/projects") },
      { id: "p-experience", group: "Pages", label: "Experience", hint: "Timeline", icon: BriefcaseIcon, run: go("/experience") },
      { id: "p-resume", group: "Pages", label: "Resume", keywords: "cv pdf", icon: FileTextIcon, run: go("/resume") },
      { id: "p-contact", group: "Pages", label: "Contact", keywords: "hire email message", icon: MailIcon, run: go("/contact") },
    ];

    const studies: Command[] = caseStudies.map((c) => ({
      id: `cs-${c.slug}`,
      group: "Case studies",
      label: c.title,
      hint: c.domain,
      keywords: c.techStack.join(" "),
      icon: LayersIcon,
      run: () => {
        track("case_study_open", { label: c.slug, source: "palette" });
        go(`/projects/${c.slug}`)();
      },
    }));

    const actions: Command[] = [
      {
        id: "a-copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        keywords: "mail contact clipboard",
        icon: CopyIcon,
        run: () => {
          close();
          navigator.clipboard
            .writeText(profile.email)
            .then(() => toast.success("Email copied to clipboard"))
            .catch(() => toast.error("Couldn't access the clipboard"));
          track("email_copied", { source: "palette" });
        },
      },
      {
        id: "a-download-cv",
        group: "Actions",
        label: "Download CV",
        hint: "PDF",
        keywords: "resume",
        icon: DownloadIcon,
        run: () => {
          close();
          track("cv_download", { label: "palette" });
          const a = document.createElement("a");
          a.href = "/resume.pdf";
          a.download = "Sekar_Nagarajan_Resume.pdf";
          a.click();
        },
      },
      { id: "a-github", group: "Actions", label: "Open GitHub", hint: "github.com/SekarNagarajan07", icon: GithubIcon, run: external(profile.socials.github, "GitHub") },
      { id: "a-linkedin", group: "Actions", label: "Open LinkedIn", hint: "in/sekar-nagarajan07", icon: LinkedinIcon, run: external(profile.socials.linkedin, "LinkedIn") },
    ];

    const theme: Command[] = (
      [
        ["dark", "Dark theme", MoonIcon],
        ["light", "Light theme", SunIcon],
        ["system", "System theme", MonitorIcon],
      ] as const
    ).map(([pref, label, icon]) => ({
      id: `t-${pref}`,
      group: "Theme",
      label,
      keywords: "appearance mode color",
      icon,
      run: () => {
        setPreference(pref);
        close();
      },
    }));

    const techs: Command[] = stack.flatMap((cat) =>
      cat.items.map((item) => ({
        id: `tech-${item.name}`,
        group: "Technologies" as const,
        label: item.name,
        hint: item.use,
        keywords: cat.label,
        logo: { name: item.logo, monogram: item.monogram },
        run: go("/skills"),
      })),
    );

    return [...pages, ...studies, ...actions, ...theme, ...techs];
  }, [close, router, setPreference]);
}

/** Lightweight fuzzy score: prefix > word-start > substring > in-order subsequence. */
function score(cmd: Command, q: string): number {
  if (!q) return 1;
  const label = cmd.label.toLowerCase();
  const hay = `${label} ${cmd.hint ?? ""} ${cmd.keywords ?? ""} ${cmd.group}`.toLowerCase();
  if (label.startsWith(q)) return 100;
  if (label.split(/[\s—/-]+/).some((w) => w.startsWith(q))) return 80;
  if (label.includes(q)) return 60;
  if (hay.includes(q)) return 40;
  let i = 0;
  for (const ch of hay) if (ch === q[i]) i++;
  return i === q.length ? 10 : 0;
}

/* ------------------------------------------------------------------ */
/* Dialog                                                              */
/* ------------------------------------------------------------------ */

function PaletteDialog({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const commands = useCommands(onClose);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const scored = commands
      .map((c) => ({ c, s: score(c, q) }))
      .filter((r) => r.s > 0)
      // With no query, hide the long technology list behind search.
      .filter((r) => q || r.c.group !== "Technologies");
    const best = (group: Command["group"]) => Math.max(0, ...scored.filter((r) => r.c.group === group).map((r) => r.s));
    // Browsing: fixed group order. Searching: the group holding the best match leads.
    const groups = q ? [...GROUP_ORDER].sort((a, b) => best(b) - best(a)) : GROUP_ORDER;
    return groups.flatMap((group) =>
      scored
        .filter((r) => r.c.group === group)
        .sort((a, b) => b.s - a.s)
        .slice(0, group === "Technologies" ? 6 : undefined)
        .map((r) => r.c),
    );
  }, [commands, query]);

  // Focus management + scroll lock.
  useEffect(() => {
    restoreFocus.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      restoreFocus.current?.focus?.();
    };
  }, []);

  // Keep the active row in view.
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run();
    } else if (e.key === "Tab") {
      // Single focus stop inside the dialog — the input drives everything.
      e.preventDefault();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onKeyDown={onKeyDown}
    >
      <div aria-hidden className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={onClose} />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -12, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -8, filter: "blur(6px)" }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className="glass relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-[0_40px_120px_-30px_rgb(0_0_0/0.7),0_0_60px_-30px_var(--accent)]"
      >
        <div className="flex items-center gap-3 border-b border-border/60 px-5">
          <SearchIcon size={18} trigger="mount" className="text-accent" />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search pages, case studies, tech, actions…"
            className="h-16 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-none"
          />
          <kbd className="rounded-md border border-border/70 px-2 py-1 font-mono text-[10px] text-muted-foreground">ESC</kbd>
        </div>

        <ul ref={listRef} id={listId} role="listbox" aria-label="Results" className="max-h-[min(60vh,28rem)] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">No results for “{query}”.</li>
          )}
          {results.map((cmd, i) => {
            const header = i === 0 || results[i - 1]!.group !== cmd.group ? cmd.group : null;
            const selected = i === active;
            const Icon = cmd.icon;
            return (
              <li key={cmd.id} role="presentation">
                {header && (
                  <p role="presentation" className="px-3 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/80">
                    {header}
                  </p>
                )}
                <motion.div
                  id={`${listId}-${cmd.id}`}
                  role="option"
                  aria-selected={selected}
                  data-index={i}
                  {...hoverTrigger}
                  animate={selected ? ["rest", "hover"] : "rest"}
                  onMouseMove={() => setActive(i)}
                  onClick={() => cmd.run()}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                    selected ? "text-foreground" : "text-foreground/80",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="palette-active"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                      className="absolute inset-0 -z-10 rounded-xl bg-accent/12 ring-1 ring-inset ring-accent/30"
                    />
                  )}
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-lg border transition-colors",
                      selected ? "border-accent/40 text-accent" : "border-border/70 text-muted-foreground",
                    )}
                  >
                    {Icon ? <Icon size={16} /> : <TechLogo name={cmd.logo?.name} fallback={cmd.logo?.monogram} size={16} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{cmd.label}</span>
                    {cmd.hint && <span className="block truncate text-xs text-muted-foreground">{cmd.hint}</span>}
                  </span>
                  {selected && <ArrowUpRightIcon size={14} className="text-accent" />}
                </motion.div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t border-border/60 px-5 py-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-3">
            <span><Kbd>↑</Kbd> <Kbd>↓</Kbd> navigate</span>
            <span><Kbd>↵</Kbd> select</span>
          </span>
          <span><Kbd>⌘</Kbd> <Kbd>K</Kbd> toggle</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

const noopSubscribe = () => () => {};

function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-border/70 bg-muted/60 px-1.5 py-0.5 font-mono">{children}</kbd>;
}

/* ------------------------------------------------------------------ */
/* Trigger                                                             */
/* ------------------------------------------------------------------ */

/** Navbar search pill (wide screens) / icon button (narrow). */
export function CommandPaletteTrigger({ compact = false }: { compact?: boolean }) {
  const { open } = useCommandPalette();
  const mac = useSyncExternalStore(
    noopSubscribe,
    () => /mac|iphone|ipad/i.test(navigator.userAgent),
    () => true,
  );

  if (compact) {
    return (
      <motion.button
        type="button"
        {...hoverTrigger}
        onClick={open}
        aria-label="Open command palette"
        className="grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <SearchIcon size={18} />
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      {...hoverTrigger}
      onClick={open}
      aria-label="Open command palette"
      aria-keyshortcuts={mac ? "Meta+K" : "Control+K"}
      className="flex h-10 items-center gap-2.5 rounded-full border border-border/70 bg-background/40 pl-3.5 pr-2 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
    >
      <SearchIcon size={15} />
      <span>Search</span>
      <kbd className="rounded-md border border-border/70 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px]">
        {mac ? "⌘" : "Ctrl"} K
      </kbd>
    </motion.button>
  );
}
