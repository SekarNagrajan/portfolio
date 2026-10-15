"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * Delegated click tracking. Any element with `data-track="event_name"`
 * (plus optional `data-track-label`) reports a Vercel Analytics custom
 * event when clicked — so Server Components can opt in with a plain
 * attribute instead of becoming Client Components.
 */
export function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const label = el.dataset.trackLabel;
      track(el.dataset.track!, label ? { label } : undefined);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
