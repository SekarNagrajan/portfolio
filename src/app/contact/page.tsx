import { HeaderArt } from "@/components/features/HeaderArt";
import { PageHeader, Section } from "@/components/features/Section";
import { ContactForm } from "@/components/features/ContactForm";
import { CopyEmailButton } from "@/components/features/CopyEmailButton";
import { SpotlightCard } from "@/components/motion/Effects";
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  MotionLink,
  SendIcon,
} from "@/components/icons/AnimatedIcons";
import { hoverTrigger } from "@/lib/motion";
import { profile } from "@/lib/data/profile";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Sekar Nagarajan — professional inquiries, project collaborations, and engineering roles.",
  path: "/contact",
});

const CHANNELS = [
  { href: profile.socials.email, label: "Email", value: profile.email, icon: MailIcon, external: false },
  { href: profile.socials.linkedin, label: "LinkedIn", value: "in/sekar-nagarajan07", icon: LinkedinIcon, external: true },
  { href: profile.socials.github, label: "GitHub", value: "SekarNagarajan07", icon: GithubIcon, external: true },
] as const;

const TIPS = [
  "The problem you're trying to solve, briefly.",
  "Your stack / constraints — and the ideal timeline.",
  "The role shape (contract / full-time / advisory).",
] as const;

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
      <PageHeader
        art={<HeaderArt variant="contact" />}
        eyebrow="Contact"
        icon={<SendIcon size={14} trigger="self" />}
        title={
          <>
            Let&apos;s build something <span className="text-gradient">together</span>.
          </>
        }
        description="Drop a note about your project, team, or role — I usually reply within a day. The form sends directly to my inbox, and still works as a full-page POST if JavaScript is disabled."
        aside={
          <p className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground">
            <MapPinIcon size={16} trigger="self" className="text-accent" /> {profile.location} · IST (UTC+5:30)
          </p>
        }
      />

      <Section id="contact">
        <div className="grid gap-6 lg:grid-cols-12">
          <SpotlightCard lift={false} className="p-7 sm:p-10 lg:col-span-7 xl:col-span-8">
            <ContactForm />
          </SpotlightCard>

          <aside className="grid gap-6 lg:col-span-5 xl:col-span-4">
            <ul className="grid gap-4">
              {CHANNELS.map(({ href, label, value, icon: Icon, external }, i) => (
                <SpotlightCard as="li" key={label} index={i} className="flex items-center p-0 pr-4">
                  <MotionLink
                    href={href}
                    data-track="profile_click"
                    data-track-label={label}
                    {...hoverTrigger}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex min-w-0 flex-1 items-center gap-4 p-5"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
                      <span className="block truncate font-medium text-foreground">{value}</span>
                    </span>
                    <ArrowUpRightIcon size={18} className="shrink-0 text-muted-foreground" />
                  </MotionLink>
                  {label === "Email" && <CopyEmailButton source="contact" />}
                </SpotlightCard>
              ))}
            </ul>

            <SpotlightCard index={3} lift={false} className="p-7">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                What makes a good first message
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-foreground/85">
                {TIPS.map((t) => (
                  <li key={t} className="flex gap-3">
                    <CheckCircleIcon size={18} className="mt-0.5 text-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </aside>
        </div>
      </Section>
    </>
  );
}
