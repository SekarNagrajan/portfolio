import { SpotlightCard } from "@/components/motion/Effects";
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  HomeIcon,
  LayersIcon,
  MailIcon,
  MotionLink,
  SparklesIcon,
  UserIcon,
} from "@/components/icons/AnimatedIcons";
import { hoverTrigger } from "@/lib/motion";

const LINKS = [
  { href: "/", label: "Home", hint: "Start from the top", icon: HomeIcon },
  { href: "/projects", label: "Projects", hint: "Enterprise platforms I've shipped", icon: LayersIcon },
  { href: "/skills", label: "Skills", hint: "The full technical matrix", icon: SparklesIcon },
  { href: "/experience", label: "Experience", hint: "Roles and responsibilities", icon: BriefcaseIcon },
  { href: "/about", label: "About", hint: "Who I am and how I work", icon: UserIcon },
  { href: "/contact", label: "Contact", hint: "Get in touch directly", icon: MailIcon },
] as const;

/** Grid of route cards used by the 404 and error pages to get people back on track. */
export function RecoveryLinks() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {LINKS.map(({ href, label, hint, icon: Icon }, i) => (
        <SpotlightCard as="li" key={href} index={i} className="p-0">
          <MotionLink href={href} {...hoverTrigger} className="flex items-center gap-4 p-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
              <Icon size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-foreground">{label}</span>
              <span className="block truncate text-sm text-muted-foreground">{hint}</span>
            </span>
            <ArrowUpRightIcon size={18} className="text-muted-foreground" />
          </MotionLink>
        </SpotlightCard>
      ))}
    </ul>
  );
}
