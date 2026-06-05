"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type HighlightRevealProps = {
  children: React.ReactNode;
  variant: "dark" | "light";
  className?: string;
  delay?: "none" | "hero";
  /** Révèle dès le montage (hero toujours visible). */
  triggerOnMount?: boolean;
};

/** Surlignage progressif au scroll. */
export function HighlightReveal({
  children,
  variant,
  className,
  delay = "none",
  triggerOnMount = false,
}: HighlightRevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inViewScroll = useInView(ref, {
    once: true,
    amount: 0.2,
    margin: "0px 0px -10% 0px",
  });

  const inView = triggerOnMount || inViewScroll;

  return (
    <span
      ref={ref}
      className={cn(
        "highlight-reveal-base",
        variant === "dark" ? "highlight-reveal--dark" : "highlight-reveal--light",
        inView && "highlight-reveal--animate",
        delay === "hero" && inView && !reduceMotion && "highlight-reveal--animate-delayed",
        className,
      )}
    >
      {children}
    </span>
  );
}
