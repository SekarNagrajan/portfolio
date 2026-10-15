import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/features/Section";
import { RecoveryLinks } from "@/components/features/RecoveryLinks";
import { GlobeIcon } from "@/components/icons/AnimatedIcons";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="404"
        icon={<GlobeIcon size={14} trigger="mount" />}
        title={
          <>
            This page has <span className="text-gradient">drifted off course</span>.
          </>
        }
        description="The link may be outdated, or the page has moved. Pick a destination below and you'll be back on track."
        aside={
          <p
            aria-hidden
            className="select-none text-[clamp(6rem,16vw,14rem)] font-black leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
          >
            404
          </p>
        }
      />
      <Section>
        <RecoveryLinks />
      </Section>
    </>
  );
}
