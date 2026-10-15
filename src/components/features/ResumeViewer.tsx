"use client";

import { motion } from "motion/react";
import { DownloadIcon, revealTrigger } from "@/components/icons/AnimatedIcons";

/**
 * Resume preview — <object> with graceful fallback to a direct link,
 * framed in a faux document window that scales in on scroll.
 */
export function ResumeViewer({ src }: { src: string }) {
  return (
    <motion.div
      {...revealTrigger}
      variants={{ hidden: { opacity: 0, y: 40, scale: 0.98 }, rest: { opacity: 1, y: 0, scale: 1 } }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
      className="glass relative overflow-hidden rounded-3xl shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8),0_0_80px_-40px_var(--accent)]"
    >
      <div className="flex items-center gap-1.5 border-b border-border/60 px-5 py-3.5">
        <span className="size-3 rounded-full bg-muted-foreground/30" />
        <span className="size-3 rounded-full bg-muted-foreground/30" />
        <span className="size-3 rounded-full bg-muted-foreground/30" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">Sekar_Nagarajan_Resume.pdf</span>
      </div>
      <object
        data={`${src}#view=FitH&toolbar=1&navpanes=0`}
        type="application/pdf"
        aria-label="Sekar Nagarajan resume preview"
        className="h-[min(70dvh,900px)] w-full bg-background"
      >
        <div className="flex flex-col items-start gap-4 p-10 text-sm text-muted-foreground">
          <p>Your browser can&apos;t render the embedded PDF. Download it directly:</p>
          <a
            href={src}
            download
            className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background"
          >
            <DownloadIcon size={16} /> Download resume.pdf
          </a>
        </div>
      </object>
    </motion.div>
  );
}
