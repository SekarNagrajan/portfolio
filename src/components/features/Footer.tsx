import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { profile } from "@/lib/data/profile";

/**
 * Build-pinned copyright year.
 * Next 16's Cache Components feature forbids `new Date()` at prerender
 * time; this value is baked at build time, which is fine for a yearly
 * footer that redeploys more frequently than that anyway.
 */
const COPYRIGHT_YEAR = new Date().getFullYear();

export function Footer() {
  const year = COPYRIGHT_YEAR;
  return (
    <footer className="mt-24 border-t border-border/60 bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{profile.name}</p>
          <p>
            {profile.title} · {profile.location}
          </p>
          <p className="mt-1 text-xs">
            © {year} — Built with Next.js 15, Tailwind v4, and Motion.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          >
            <GithubIcon size={16} />
          </Link>
          <Link
            href={profile.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          >
            <LinkedinIcon size={16} />
          </Link>
          <Link
            href={profile.socials.email}
            aria-label="Send email"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          >
            <Mail className="size-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
