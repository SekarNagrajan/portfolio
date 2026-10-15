import { ResumeExperience } from "@/components/features/resume/ResumeExperience";
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
      <ResumeExperience src={PDF_SRC} filename={PDF_FILENAME} />
    </>
  );
}
