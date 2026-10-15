import { ContactForm } from "@/components/features/ContactForm";
import { Channels, ContactHero, NextSteps } from "@/components/features/contact/ContactParts";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Sekar Nagarajan — professional inquiries, project collaborations, and engineering roles.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
      <ContactHero />

      <section id="contact" className="shell relative scroll-mt-24 pb-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-8">
          <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-9">
            <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Send a message</h2>
            <p className="mb-7 mt-1.5 text-sm text-muted-foreground">
              It goes straight to my inbox. The form still works with JavaScript turned off.
            </p>
            <ContactForm />
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)]">
            <Channels />
            <NextSteps />
          </aside>
        </div>
      </section>
    </>
  );
}
