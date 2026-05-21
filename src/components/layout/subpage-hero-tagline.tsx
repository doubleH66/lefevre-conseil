"use client";

import { HighlightReveal } from "@/components/ui/highlight-reveal";
import { cn } from "@/lib/utils";

const serviceShellTaglineClass =
  "mx-auto max-w-[min(100%,44rem)] text-pretty text-[clamp(1.0625rem,3.1vw,1.5rem)] font-normal leading-[1.45] tracking-[-0.01em] sm:leading-[1.5] lg:max-w-[min(100%,48rem)] lg:text-[clamp(1.125rem,2.4vw,1.625rem)] lg:leading-snug [text-shadow:0_1px_18px_rgba(0,0,0,0.35)]";

type SubpageHeroTaglineProps = {
  text: string;
  highlightAfter?: string;
  /** Bandeau visible au chargement : animation sans attendre le scroll. */
  animateOnMount?: boolean;
};

export function SubpageHeroTagline({ text, highlightAfter, animateOnMount }: SubpageHeroTaglineProps) {
  const i = highlightAfter && highlightAfter.length > 0 ? text.indexOf(highlightAfter) : -1;

  if (i <= 0) {
    return (
      <p className={cn(serviceShellTaglineClass, "mt-3 text-white/82 sm:mt-4 lg:mt-5")}>{text}</p>
    );
  }

  const lead = text.slice(0, i);
  const rest = text.slice(i);

  return (
    <p className={cn(serviceShellTaglineClass, "mt-3 text-white/80 sm:mt-4 lg:mt-5")}>
      <HighlightReveal
        variant="dark"
        className="rounded-xl px-2 pb-1"
        triggerOnMount
        delay={animateOnMount ? "hero" : "none"}
      >
        {lead}
      </HighlightReveal>
      <span className="text-white/82">{rest}</span>
    </p>
  );
}
