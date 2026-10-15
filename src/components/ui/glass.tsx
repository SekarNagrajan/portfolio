import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassVariants = cva("border transition-[border-color,box-shadow,background-color] duration-300", {
  variants: {
    intensity: {
      sm: "glass-sm",
      md: "glass",
      lg: "glass-lg",
    },
    interactive: {
      true: "hover:border-accent/50",
      false: "",
    },
    rounded: {
      none: "rounded-none",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    intensity: "md",
    interactive: false,
    rounded: "2xl",
  },
});

export interface GlassProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassVariants> {
  asChild?: boolean;
}

const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  ({ className, intensity, interactive, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(glassVariants({ intensity, interactive, rounded }), className)}
        {...props}
      />
    );
  },
);
Glass.displayName = "Glass";

const glassIconBadgeVariants = cva(
  "grid shrink-0 place-items-center border border-accent/30 bg-gradient-to-br from-accent/20 via-accent/5 to-transparent text-accent",
  {
    variants: {
      size: {
        sm: "size-12 rounded-xl",
        md: "size-14 rounded-2xl",
        lg: "size-20 rounded-3xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface GlassIconBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassIconBadgeVariants> {}

const GlassIconBadge = React.forwardRef<HTMLDivElement, GlassIconBadgeProps>(
  ({ className, size, ...props }, ref) => (
    <div ref={ref} className={cn(glassIconBadgeVariants({ size }), className)} {...props} />
  ),
);
GlassIconBadge.displayName = "GlassIconBadge";

const glassChipVariants = cva(
  "inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-muted-foreground",
  {
    variants: {
      size: {
        sm: "font-mono text-[11px]",
        md: "text-xs",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface GlassChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof glassChipVariants> {
  asChild?: boolean;
}

const GlassChip = React.forwardRef<HTMLSpanElement, GlassChipProps>(
  ({ className, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return <Comp ref={ref} className={cn(glassChipVariants({ size }), className)} {...props} />;
  },
);
GlassChip.displayName = "GlassChip";

export { Glass, GlassIconBadge, GlassChip, glassVariants, glassIconBadgeVariants, glassChipVariants };
