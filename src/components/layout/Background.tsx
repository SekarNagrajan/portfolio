/**
 * Fixed, full-viewport ambient backdrop — drifting aurora blobs over a
 * hairline grid. Pure CSS transforms on the compositor; no JS.
 * Phones get the cheap version: static blobs, smaller blur radii, no
 * third blob and no grain layer — large animated blurs are the single
 * biggest GPU cost on mobile.
 */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-70" />
      <div className="absolute -left-[10%] -top-[20%] h-[60vmax] w-[60vmax] rounded-full bg-accent/15 blur-[80px] lg:animate-aurora lg:blur-[120px]" />
      <div className="absolute -right-[15%] top-[10%] h-[50vmax] w-[50vmax] rounded-full bg-accent/10 blur-[90px] lg:animate-aurora lg:blur-[130px] lg:[animation-delay:-6s]" />
      <div className="absolute -bottom-[30%] left-[20%] hidden h-[55vmax] w-[55vmax] rounded-full bg-accent/6 blur-[140px] lg:block lg:animate-aurora lg:[animation-delay:-12s]" />
      {/* Film grain to break up gradient banding on large displays. */}
      <div
        className="absolute inset-0 hidden opacity-[0.035] mix-blend-overlay lg:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
