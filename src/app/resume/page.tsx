import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import { Section, SectionHeader } from "@/components/features/Section";
import { ResumeViewer } from "@/components/features/ResumeViewer";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/data/profile";
import { buildMetadata } from "@/lib/seo";

const PDF_SRC = "/resume.pdf";
const PDF_FILENAME = "Sekar_Nagarajan_Resume.pdf";

export const metadata = buildMetadata({
  title: "Resume",
  description: `Download or preview ${profile.name}'s latest CV.`,
  path: "/resume",
});

export default function ResumePage() {
  return (
    <Section id="resume">
      <SectionHeader
        eyebrow="Resume"
        title="Latest CV — preview and download."
        description="Previewed inline below for a quick scan, or download the PDF to share with your hiring team."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button asChild size="lg" className="gap-2">
          {/* Native download attribute triggers the browser save dialog
              without any client JS — works even with JS disabled. */}
          <a href={PDF_SRC} download={PDF_FILENAME}>
            <Download className="size-4" /> Download CV
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="gap-2">
          <Link href={PDF_SRC} target="_blank" rel="noopener noreferrer">
            Open in new tab <ExternalLink className="size-4" />
          </Link>
        </Button>
      </div>

      <ResumeViewer src={PDF_SRC} />
    </Section>
  );
}
