"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { Toaster } from "sonner";
import { MonitorIcon, MoonIcon, SunIcon, hoverTrigger } from "@/components/icons/AnimatedIcons";
import { cn } from "@/lib/utils";

export type ThemePreference = "system" | "light" | "dark";
type Resolved = "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Inline, render-blocking script for <head>: applies the OS theme before
 * first paint so there's no dark→light flash. Mirrors `apply()`. There is
 * no theme toggle, so a preference saved by an earlier version is cleared.
 */
export const themeInitScript = `(()=>{try{localStorage.removeItem("${STORAGE_KEY}");var p="system";var l=p==="light"||(p==="system"&&matchMedia("(prefers-color-scheme: light)").matches);var d=document.documentElement;d.classList.toggle("light",l);d.style.colorScheme=l?"light":"dark";}catch(e){}})();`;

function apply(resolved: Resolved) {
  const root = document.documentElement;
  root.classList.toggle("light", resolved === "light");
  root.style.colorScheme = resolved;
}

/* External store: the saved preference (localStorage) + the OS scheme.
   Read with useSyncExternalStore so server and first client render agree. */
const listeners = new Set<() => void>();
const LIGHT_QUERY = "(prefers-color-scheme: light)";

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const mq = window.matchMedia(LIGHT_QUERY);
  mq.addEventListener("change", onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    listeners.delete(onChange);
    mq.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readPreference(): ThemePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {}
  return "system";
}

const readSystemLight = () => window.matchMedia(LIGHT_QUERY).matches;
const noopSubscribe = () => () => {};

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: Resolved;
  setPreference: (p: ThemePreference) => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as const);
  const systemLight = useSyncExternalStore(subscribe, readSystemLight, () => false);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const resolved: Resolved = preference === "system" ? (systemLight ? "light" : "dark") : preference;

  // Keep the <html> class in sync (the init script handled first paint).
  useEffect(() => {
    if (mounted) apply(resolved);
  }, [mounted, resolved]);

  const setPreference = useCallback((p: ThemePreference) => {
    try {
      localStorage.setItem(STORAGE_KEY, p);
    } catch {}
    listeners.forEach((l) => l());
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, resolved, setPreference, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

const ORDER: readonly ThemePreference[] = ["dark", "light", "system"];
const ICONS = { light: SunIcon, dark: MoonIcon, system: MonitorIcon } as const;
const LABELS = { light: "Light", dark: "Dark", system: "System" } as const;

/** Cycles dark → light → system; the icon spins/swaps between states. */
export function ThemeToggle({ className }: { className?: string }) {
  const { preference, setPreference, mounted } = useTheme();
  const nextPref = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length]!;
  const Icon = ICONS[preference];

  return (
    <motion.button
      type="button"
      {...hoverTrigger}
      onClick={() => setPreference(nextPref)}
      aria-label={`Theme: ${LABELS[preference]}. Switch to ${LABELS[nextPref]}`}
      title={`Theme: ${LABELS[preference]}`}
      className={cn(
        "relative grid size-10 place-items-center overflow-hidden rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      {/* Render the icon only after mount — the saved preference isn't known on the server. */}
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={preference}
            initial={{ y: 14, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -14, opacity: 0, rotate: 90 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="grid place-items-center"
          >
            <Icon size={18} />
          </motion.span>
        </AnimatePresence>
      )}
    </motion.button>
  );
}

/** Sonner toasts that follow the active theme. */
export function ThemedToaster() {
  const { resolved } = useTheme();
  return <Toaster theme={resolved} position="bottom-right" richColors closeButton />;
}
