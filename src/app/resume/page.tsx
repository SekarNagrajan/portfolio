import { HeaderArt } from "@/components/features/HeaderArt";
import { PageHeader, Section } from "@/components/features/Section";
import { ResumeViewer } from "@/components/features/ResumeViewer";
import {
  ArrowUpRightIcon,
  DownloadIcon,
  FileTextIcon,
  MotionAnchor,
} from "@/components/icons/AnimatedIcons";
import { hoverTrigger } from "@/lib/motion";
import { profile } from "@/lib/data/profile";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const PDF_SRC = "/resume.pdf";
const PDF_FILENAME = "Sekar_Nagarajan_Resume.pdf";

export const metadata = buildMetadata({
  title: "Resume",
  description: `Download or preview ${profile.name}'s latest CV.`,
  path: "/resume",
});

export default function ResumePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Resume", path: "/resume" }])} />
      <PageHeader
        art={<HeaderArt variant="resume" />}
        eyebrow="Resume"
        icon={<FileTextIcon size={14} trigger="self" />}
        title={
          <>
            Latest CV — <span className="text-gradient">preview and download</span>.
          </>
        }
        description="Previewed inline below for a quick scan, or download the PDF to share with your hiring team."
        aside={
          <div className="flex flex-wrap gap-3">
            {/* Native download attribute triggers the browser save dialog
                without any client JS — works even with JS disabled. */}
            <MotionAnchor
              href={PDF_SRC}
              download={PDF_FILENAME}
              data-track="cv_download"
              data-track-label="resume_page"
              {...hoverTrigger}
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-foreground px-6 text-sm font-semibold text-background"
            >
              <DownloadIcon size={18} /> Download CV
            </MotionAnchor>
            <MotionAnchor
              href={PDF_SRC}
              target="_blank"
              rel="noopener noreferrer"
              data-track="cv_open"
              {...hoverTrigger}
              className="glass inline-flex h-12 items-center gap-2.5 rounded-full px-6 text-sm font-semibold hover:border-accent/50"
            >
              Open in new tab <ArrowUpRightIcon size={18} />
            </MotionAnchor>
          </div>
        }
      />

      <Section id="resume">
        <ResumeViewer src={PDF_SRC} />
      </Section>
    </>
  );
}
