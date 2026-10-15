import type { ReactNode } from "react";
import { ArrowRightIcon, MotionLink } from "@/components/icons/AnimatedIcons";
import { Glass } from "@/components/ui/glass";
import { hoverTrigger } from "@/lib/motion";

/** Glass pill CTA used as section aside links (skills, projects, about, experience). */
export function ViewAllLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Glass intensity="md" interactive rounded="full" asChild>
      <MotionLink
        href={href}
        {...hoverTrigger}
        className="inline-flex h-12 items-center gap-2.5 px-6 text-sm font-semibold text-foreground"
      >
        {children} <ArrowRightIcon size={16} />
      </MotionLink>
    </Glass>
  );
}
