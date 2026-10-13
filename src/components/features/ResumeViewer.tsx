"use client";

/**
 * Resume preview — <object> with graceful fallback to a direct link.
 * Hosted inside a <details>-style card so mobile users don't eat an
 * instant PDF render; they can tap to expand.
 */
export function ResumeViewer({ src }: { src: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <object
        data={`${src}#view=FitH&toolbar=1&navpanes=0`}
        type="application/pdf"
        aria-label="Sekar Nagarajan resume preview"
        className="h-[80vh] min-h-[640px] w-full bg-background"
      >
        <div className="flex flex-col items-start gap-3 p-8 text-sm text-muted-foreground">
          <p>
            Your browser can&apos;t render the embedded PDF. Download it
            directly:
          </p>
          <a
            href={src}
            download
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Download resume.pdf
          </a>
        </div>
      </object>
    </div>
  );
}
