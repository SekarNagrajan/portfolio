"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { useInView, useReducedMotion } from "motion/react";

const noop = () => () => {};

/** True after hydration — SSR-safe gate for portals and browser-only UI. */
export function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}

/**
 * SSR-safe media query — `false` on the server, live afterwards.
 * Use for JS behavior only; layout belongs in Tailwind breakpoints.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Below the `lg` breakpoint — matches the tab-bar/toast media queries. */
export function useIsMobile() {
  return useMediaQuery("(max-width: 63.999rem)");
}

/** Touch-first device — gate JS hover handlers (CSS `hover:` is already gated). */
export function useIsCoarsePointer() {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}

/** Cycles 0…steps-1 while the element is on screen (frozen on the last step for reduced motion). */
export function usePhase(steps: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setPhase((p) => (p + 1) % steps), ms);
    return () => clearInterval(id);
  }, [inView, reduce, steps, ms]);

  return { ref, phase: reduce ? steps - 1 : phase };
}

/**
 * Locks page scroll while a modal/sheet is open. Locks <html> as well as
 * <body> (iOS Safari ignores body-only overflow) and disables touch panning.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      touchAction: body.style.touchAction,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.touchAction = prev.touchAction;
    };
  }, [locked]);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Minimal focus trap for dialogs/sheets: moves focus in ([data-autofocus]
 * or the first focusable), wraps Tab at the edges, restores focus on close.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const restoreTo =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const target =
      el.querySelector<HTMLElement>("[data-autofocus]") ??
      el.querySelector<HTMLElement>(FOCUSABLE);
    target?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null || n === document.activeElement,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === first || !el.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !el.contains(current))) {
        e.preventDefault();
        first.focus();
      }
    };
    el.addEventListener("keydown", onKeyDown);
    return () => {
      el.removeEventListener("keydown", onKeyDown);
      restoreTo?.focus();
    };
  }, [ref, active]);
}
