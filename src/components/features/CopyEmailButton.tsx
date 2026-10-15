"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { track } from "@vercel/analytics";
import { CheckCircleIcon, CopyIcon } from "@/components/icons/AnimatedIcons";
import { hoverTrigger } from "@/lib/motion";
import { profile } from "@/lib/data/profile";
import { cn } from "@/lib/utils";

/** Copies the email address; the icon swaps to an animated check for 2s. */
export function CopyEmailButton({ className, source }: { className?: string; source: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast.success("Email copied to clipboard");
      track("email_copied", { source });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(`Couldn't access the clipboard — the address is ${profile.email}`);
    }
  };

  return (
    <motion.button
      type="button"
      {...hoverTrigger}
      onClick={copy}
      aria-label={copied ? "Email copied" : "Copy email address"}
      title="Copy email"
      className={cn(
        "relative grid size-10 shrink-0 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent",
        copied && "border-accent/60 text-accent",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "copy"}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 26 }}
          className="grid place-items-center"
        >
          {copied ? <CheckCircleIcon size={16} trigger="mount" /> : <CopyIcon size={16} />}
        </motion.span>
      </AnimatePresence>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email copied" : ""}
      </span>
    </motion.button>
  );
}
