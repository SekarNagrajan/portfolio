import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Shared page section — wide shell, consistent vertical rhythm, anchor id.
 */
export function Section({
  id,
  className,
  children,
  as: Tag = "section",
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  as?: "section" | "div" | "article";
}) {
  return (
    <Tag id={id} className={cn("shell relative py-16 sm:py-24", className)}>
      {children}
    </Tag>
  );
}

/**
 * Section heading. Pass `aside` to place supporting content (a CTA, a
 * stat) on the right so wide screens use the full row. Pass `art` for a
 * decorative illustration in the right column instead — `aside` then
 * moves under the description.
 */
export function SectionHeader({
  eyebrow,
  icon,
  title,
  description,
  aside,
  art,
  className,
  titleAs: Heading = "h2",
}: {
  eyebrow?: string;
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  art?: ReactNode;
  className?: string;
  titleAs?: "h1" | "h2";
}) {
  return (
    <Reveal
      as="header"
      className={cn(
        "mb-12 gap-8 lg:mb-16",
        art
          ? "grid items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] xl:gap-16"
          : "flex flex-col lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="glass-sm mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {icon}
            {eyebrow}
          </p>
        )}
        <Heading
          className={cn(
            "text-balance font-semibold tracking-tight text-foreground",
            Heading === "h1" ? "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl" : "text-3xl sm:text-4xl lg:text-5xl",
          )}
        >
          {title}
        </Heading>
        {description && (
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
        {art && aside && <div className="mt-8">{aside}</div>}
      </div>
      {art ? <div className="hidden lg:block">{art}</div> : aside && <div className="shrink-0">{aside}</div>}
    </Reveal>
  );
}

/** Page-level hero header for inner routes. */
export function PageHeader({ tight = false, ...props }: Parameters<typeof SectionHeader>[0] & { tight?: boolean }) {
  return (
    <div className={cn("shell relative", tight ? "pt-8" : "pt-[max(6rem,calc(env(safe-area-inset-top)+4.5rem))] lg:pt-44")}>
      <SectionHeader titleAs="h1" {...props} className={cn("mb-0 lg:mb-0", props.className)} />
    </div>
  );
}
