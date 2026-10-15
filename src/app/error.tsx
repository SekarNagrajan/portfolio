"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { PageHeader, Section } from "@/components/features/Section";
import { RecoveryLinks } from "@/components/features/RecoveryLinks";
import { ShieldIcon } from "@/components/icons/AnimatedIcons";

/**
 * Route-level error boundary. `retry` re-fetches and re-renders the
 * failed segment (stable since Next 16.3).
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <>
      <PageHeader
        eyebrow="Something went wrong"
        icon={<ShieldIcon size={14} trigger="mount" />}
        title={
          <>
            That didn&apos;t load <span className="text-gradient">as expected</span>.
          </>
        }
        description={
          <>
            An unexpected error interrupted this page. Try again, or head somewhere else below.
            {error.digest && (
              <span className="mt-3 block font-mono text-xs text-muted-foreground/70">Reference: {error.digest}</span>
            )}
          </>
        }
        aside={
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-transform active:scale-95"
          >
            Try again
          </button>
        }
      />
      <Section>
        <RecoveryLinks />
      </Section>
    </>
  );
}
