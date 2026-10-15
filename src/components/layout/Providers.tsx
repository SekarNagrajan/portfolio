"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { ThemeProvider, ThemedToaster } from "@/components/layout/Theme";

/**
 * App-wide client context: theme (follows the OS) and Motion settings. `reducedMotion="user"` makes every Motion
 * transform animation honour the OS "reduce motion" preference.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        {children}
        <ThemedToaster />
      </ThemeProvider>
    </MotionConfig>
  );
}
