"use client";

import { HighlightReveal } from "@/components/ui/highlight-reveal";
import { marketingHighlightPill } from "@/components/marketing/marketing-styles";
import { findSearchMatchSpan } from "@/lib/content/services-search";
import { cn } from "@/lib/utils";

type SearchHighlightProps = {
  text: string;
  query: string;
  /**
   * `slim` — pastille bleue fine (cabinet intro) ;
   * `marketing` — surlignage léger pages hub / cartes.
   */
  pill?: "slim" | "marketing";
  /** @deprecated Préférer `pill`. */
  variant?: "light" | "dark";
};

/**
 * Surligne les occurrences de la recherche.
 */
export function SearchHighlight({
  text,
  query,
  pill = "marketing",
  variant = "light",
}: SearchHighlightProps) {
  const span = findSearchMatchSpan(text, query);
  if (!span) return text;

  const { start, end } = span;
  const before = text.slice(0, start);
  const match = text.slice(start, end);
  const after = text.slice(end);

  if (pill === "slim") {
    return (
      <>
        {before}
        <span className="highlight-reveal-base highlight-reveal--dark highlight-reveal--slim highlight-reveal--instant">
          {match}
        </span>
        <SearchHighlight text={after} query={query} pill="slim" />
      </>
    );
  }

  return (
    <>
      {before}
      <HighlightReveal
        variant={variant}
        delay="none"
        triggerOnMount
        className={cn(
          variant === "light" ? marketingHighlightPill : "rounded-xl px-2 pb-1",
        )}
      >
        {match}
      </HighlightReveal>
      <SearchHighlight text={after} query={query} pill="marketing" variant={variant} />
    </>
  );
}
