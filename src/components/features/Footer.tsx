import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { experiences } from "@/lib/data/experiences";
import { Reveal } from "@/components/motion/Reveal";
import { FooterCta } from "@/components/features/footer/FooterCta";
import { BackToTop } from "@/components/features/footer/BackToTop";
import { Wordmark } from "@/components/features/footer/Wordmark";
import {
  ArrowUpRightIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  MotionLink,
} from "@/components/icons/AnimatedIcons";
import { hoverTrigger } from "@/lib/motion";

/**
 * Build-pinned copyright year.
 * Next 16's Cache Components feature forbids `new Date()` at prerender
 * time; this value is baked at build time, which is fine for a yearly
 * footer that redeploys more frequently than that anyway.
 */
const COPYRIGHT_YEAR = new Date().getFullYear();

const SITEMAP = [
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
] as const;

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const handle = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/^mailto:/, "");

const SOCIALS = [
  { href: profile.socials.linkedin, label: "LinkedIn", icon: LinkedinIcon, external: true },
  { href: profile.socials.github, label: "GitHub", icon: GithubIcon, external: true },
  { href: profile.socials.email, label: "Email", icon: MailIcon, external: false },
] as const;

export function Footer() {
  const job = experiences[0];
  const glance = [
    { label: "Role", value: profile.title },
    { label: "Currently", value: `${job.role} · ${job.company.split(" ")[0]}` },
    { label: "Based in", value: profile.location },
    { label: "Open to", value: capitalise(profile.availability.replace(/^Open to /, "")) },
  ];

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-border/60 pb-[calc(var(--tab-bar-height)+env(safe-area-inset-bottom))] lg:mt-24">
      {/* Glow seam along the top edge. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_14%,transparent),transparent)]" />


      <div className="shell py-16 sm:py-20">
        <FooterCta />

        <Reveal className="mt-14 grid first:mt-0 gap-12 sm:grid-cols-2 lg:grid-cols-[1fr_1.1fr_1.3fr] lg:gap-16">
          {/* Navigate */}
          <nav aria-label="Footer">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Navigate</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {SITEMAP.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group inline-flex min-h-11 items-center gap-2 text-foreground/80 transition-colors hover:text-foreground">
                    <span className="h-px w-3 bg-border transition-all duration-300 group-hover:w-6 group-hover:bg-accent" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Connect</h3>
            <ul className="mt-5 flex flex-col gap-2">
              {SOCIALS.map(({ href, label, icon: Icon, external }) => (
                <li key={label}>
                  <MotionLink
                    href={href}
                    data-track="profile_click"
                    data-track-label={label}
                    {...hoverTrigger}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card/40 p-2 pr-4 transition-[border-color,background-color] duration-300 hover:border-accent/50 hover:bg-accent/[0.06]"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border/60 bg-background/50 text-muted-foreground transition-colors group-hover:text-accent">
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">{label}</span>
                      <span className="block truncate font-mono text-[11px] text-muted-foreground">{handle(href)}</span>
                    </span>
                    <span className="text-muted-foreground transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent">
                      <ArrowUpRightIcon size={15} />
                    </span>
                  </MotionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* At a glance — the recruiter summary */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">At a glance</h3>
            <dl className="mt-5 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/40">
              {glance.map((g) => (
                <div key={g.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
                  <dt className="shrink-0 text-xs text-muted-foreground">{g.label}</dt>
                  <dd className="text-right text-sm font-medium text-foreground">{g.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        {/* Legal + back to top */}
        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="space-y-2">
            <p>
              © Copyright {COPYRIGHT_YEAR} {profile.name}.
            </p>
            <p>
              Page-view analytics are collected. No ad trackers.{" "}
              <Link href="/contact" className="underline-offset-4 hover:text-foreground hover:underline">
                Ask to remove your data
              </Link>
              .
            </p>
          </div>
          <BackToTop />
        </div>
      </div>

      <Wordmark text={profile.firstName.toUpperCase()} />
    </footer>
  );
}
