/**
 * sRGB equivalents of the oklch design tokens in globals.css, for places
 * CSS variables can't reach: OG images, app icons, the web manifest, and
 * `theme-color`. Keep in sync if the tokens change.
 */
export const brand = {
  accent: "#1bc3f3", // --accent  oklch(0.76 0.14 225)
  background: "#07070a", // --background oklch(0.13 0.008 280)
  card: "#0d0e13", // --card
  border: "#25262c", // --border
  foreground: "#fafafb", // --foreground
  muted: "#a2a4ae", // --muted-foreground
} as const;
