"use client";

import * as React from "react";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidbuttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[color,box-shadow,transform] disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-white/70",
  {
    variants: {
      variant: {
        default: "text-primary hover:scale-[1.02]",
        /** Pas de `text-primary` : les CTA passent leur couleur via `className` (ex. text-white). */
        stable: "hover:scale-100 active:scale-100",
      },
      size: {
        default: "h-10 px-6",
        sm: "h-9 px-5 text-xs",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type LiquidButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & {
    asChild?: boolean;
    /**
     * Désactive le shell « glass » (overlay blanc + ombres) pour les boutons
     * pleins (CTA bleu, Contact dans la nav). Évite ombres parasites et flicker au hover.
     */
    plain?: boolean;
  };

/**
 * Même coque visuelle que les `LiquidButton` non `plain` (ex. Contact sur fond clair) :
 * ombres intérieures et voile blanc - sans `backdrop-filter` (flou) pour éviter les bugs
 * d’empilement sur WebKit dans la nav / les menus. `filterId` reste pour compatibilité des appelants.
 * `className` = rayon des coins (`rounded-full`, `rounded-3xl`, …).
 */
export function LiquidGlassBackdrop({
  filterId: _filterId,
  className,
}: {
  filterId: string;
  className: string;
}) {
  return (
    <>
      {/* Voile sous les ombres - pas de z négatif (bugs de composite WebKit dans isolate). */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 overflow-hidden bg-white/30",
          className,
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-[1] shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(255,255,255,0.65),inset_-3px_-3px_0.5px_-3px_rgba(255,255,255,0.4),inset_0_0_8px_6px_rgba(255,255,255,0.18)]",
          className,
        )}
      />
    </>
  );
}

/**
 * Léger relief autour de la pill dockée (évite de doubler les grosses ombres de `LiquidGlassBackdrop`).
 */
export const liquidGlassDockRimClassName =
  "shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_12px_40px_-8px_rgba(15,23,42,0.12)]";

function GlassShell({ filterId }: { filterId: string }) {
  return <LiquidGlassBackdrop filterId={filterId} className="rounded-full" />;
}

const LiquidButton = React.forwardRef<HTMLElement, LiquidButtonProps>(
  ({ className, variant, size, asChild = false, plain = false, children, ...props }, ref) => {
    const reactId = React.useId();
    const filterId = React.useMemo(
      () => `liquid-glass-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
      [reactId],
    );

    const styles = cn("relative", liquidbuttonVariants({ variant, size, className }));

    if (asChild) {
      const child = React.Children.only(children);
      if (!React.isValidElement(child)) {
        throw new Error("LiquidButton asChild attend un seul élément React valide.");
      }

      const childProps = child.props as {
        className?: string;
        children?: React.ReactNode;
        ref?: React.Ref<HTMLElement>;
        [key: string]: unknown;
      };

      return React.cloneElement(child, {
        ...props,
        ...childProps,
        className: cn(styles, childProps.className),
        ref: composeRefs(ref, childProps.ref),
        children: (
          <>
            {plain ? null : <GlassShell filterId={filterId} />}
            <span className="relative z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap">
              {childProps.children}
            </span>
          </>
        ),
      } as never);
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={styles} {...props}>
        {plain ? null : <GlassShell filterId={filterId} />}
        <span className="relative z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap">{children}</span>
      </button>
    );
  },
);

LiquidButton.displayName = "LiquidButton";

export { LiquidButton, liquidbuttonVariants };
