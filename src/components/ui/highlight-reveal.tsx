"use client";

import * as React from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type HighlightRevealProps = {
  children: React.ReactNode;
  variant: "dark" | "light";
  className?: string;
  delay?: "none" | "hero";
  /** Pour les bandeaux hero toujours visibles au chargement. */
  triggerOnMount?: boolean;
};

/** Surlignage progressif au scroll (heritage — ex. « Réduisez votre fiscalité »). */
export function HighlightReveal({
  children,
  variant,
  className,
  delay = "none",
  triggerOnMount = false,
}: HighlightRevealProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inViewScroll = useInView(ref, { once: true, amount: 0.55, margin: "0px 0px -10% 0px" });
  const inView = triggerOnMount || inViewScroll;

  return (
    <span
      ref={ref}
      className={cn(
        "highlight-reveal-base",
        variant === "dark" ? "highlight-reveal--dark" : "highlight-reveal--light",
        inView && "highlight-reveal--animate",
        delay === "hero" && inView && "highlight-reveal--animate-delayed",
        className,
      )}
    >
      {children}
    </span>
  );
}
