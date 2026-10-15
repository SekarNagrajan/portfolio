/**
 * Fixed, full-viewport ambient backdrop — drifting aurora blobs over a
 * hairline grid. Pure CSS transforms on the compositor; no JS.
 */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-70" />
      <div className="absolute -left-[10%] -top-[20%] h-[60vmax] w-[60vmax] animate-aurora rounded-full bg-accent/15 blur-[120px]" />
      <div className="absolute -right-[15%] top-[10%] h-[50vmax] w-[50vmax] animate-aurora rounded-full bg-accent/10 blur-[130px] [animation-delay:-6s]" />
      <div className="absolute -bottom-[30%] left-[20%] h-[55vmax] w-[55vmax] animate-aurora rounded-full bg-accent/6 blur-[140px] [animation-delay:-12s]" />
      {/* Film grain to break up gradient banding on large displays. */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
