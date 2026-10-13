import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared page section — consistent horizontal rhythm + max width + anchor id.
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
    <Tag
      id={id}
      className={cn(
        "mx-auto w-full max-w-6xl px-6 py-16 sm:py-20",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
