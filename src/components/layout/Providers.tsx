"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { ThemeProvider, ThemedToaster } from "@/components/layout/Theme";
import { CommandPaletteProvider } from "@/components/features/CommandPalette";

/**
 * App-wide client context: theme (light / dark / system), the ⌘K command
 * palette, and Motion settings. `reducedMotion="user"` makes every Motion
 * transform animation honour the OS "reduce motion" preference.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <CommandPaletteProvider>
          {children}
          <ThemedToaster />
        </CommandPaletteProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
