"use client";

import { HighlightReveal } from "@/components/ui/highlight-reveal";
import { marketingHighlightPill } from "@/components/marketing/marketing-styles";
import { findSearchMatchSpan } from "@/lib/content/services-search";
import { cn } from "@/lib/utils";

type SearchHighlightProps = {
  text: string;
  query: string;
  /** `light` sur fond clair (FAQ, cartes) ; `dark` sur fond sombre (badges image). */
  variant?: "light" | "dark";
};

/**
 * Surligne les occurrences de la recherche — même effet que le bandeau hero (HighlightReveal).
 */
export function SearchHighlight({ text, query, variant = "light" }: SearchHighlightProps) {
  const span = findSearchMatchSpan(text, query);
  if (!span) return text;

  const { start, end } = span;
  const before = text.slice(0, start);
  const match = text.slice(start, end);
  const after = text.slice(end);

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
      <SearchHighlight text={after} query={query} variant={variant} />
    </>
  );
}
