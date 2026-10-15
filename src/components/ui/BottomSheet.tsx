"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useFocusTrap, useIsClient, useScrollLock } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * 44px-tall grabber row for draggable sheets — also exported for dialogs
 * that implement their own shell (projects QuickView).
 */
export function SheetHandle({ onClose }: { onClose?: () => void }) {
  return (
    <div
      className="flex h-8 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
      onClick={onClose}
      aria-hidden
    >
      <span className="h-1 w-10 rounded-full bg-border" />
    </div>
  );
}

/**
 * Mobile bottom sheet, portalled to <body> (the route-transition wrapper
 * is transformed, which breaks position:fixed). Drag down to dismiss,
 * Escape to close, focus-trapped, page scroll locked, safe-area padded.
 */
export function BottomSheet({
  open,
  onClose,
  label,
  children,
  className,
  aboveTabBar = true,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  aboveTabBar?: boolean;
}) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden",
            aboveTabBar &&
              "bottom-[calc(var(--tab-bar-height)+env(safe-area-inset-bottom))]",
          )}
        >
          {/* Backdrop — no blur on phones (perf); tap closes. */}
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            className="absolute inset-0 cursor-default bg-background/60"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={
              reduce
                ? { duration: 0.1 }
                : { type: "spring", stiffness: 300, damping: 32 }
            }
            drag={reduce ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 500) onClose();
            }}
            className={cn(
              "absolute inset-x-0 bottom-0 flex max-h-[80dvh] flex-col rounded-t-3xl border-t border-border bg-background/95 shadow-glass-lg backdrop-blur-xl",
              className,
            )}
          >
            <SheetHandle onClose={onClose} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-2 top-2 grid size-11 place-items-center rounded-full text-muted-foreground"
            >
              <span className="grid size-8 place-items-center rounded-full border border-border">
                <X size={14} />
              </span>
            </button>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
