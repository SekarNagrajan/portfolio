import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { Section, SectionHeader } from "@/components/features/Section";
import { ContactForm } from "@/components/features/ContactForm";
import { profile } from "@/lib/data/profile";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Sekar Nagarajan — professional inquiries, project collaborations, and engineering roles.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Section id="contact">
      <SectionHeader
        eyebrow="Contact"
        title="Let's build something together."
        description="Drop a note about your project, team, or role — I usually reply within a day. The form sends directly to my inbox, and the message channel degrades gracefully to a full-page POST if JavaScript is disabled."
      />

      <div className="grid gap-10 md:grid-cols-[1.4fr,1fr]">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Prefer another channel?
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href={profile.socials.email}
                  className="flex items-center gap-3 rounded-md px-2 py-2 text-foreground transition-colors hover:bg-muted"
                >
                  <Mail className="size-4 text-muted-foreground" />
                  {profile.email}
                </Link>
              </li>
              <li>
                <Link
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-md px-2 py-2 text-foreground transition-colors hover:bg-muted"
                >
                  <LinkedinIcon size={16} />
                  linkedin.com/in/sekar-nagarajan07
                </Link>
              </li>
              <li>
                <Link
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-md px-2 py-2 text-foreground transition-colors hover:bg-muted"
                >
                  <GithubIcon size={16} />
                  github.com/SekarNagarajan07
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              What makes a good first message
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>· The problem you&apos;re trying to solve, briefly.</li>
              <li>· Your stack / constraints — and the ideal timeline.</li>
              <li>· The role shape (contract / full-time / advisory).</li>
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  );
}
