import { findSearchMatchSpan } from "@/lib/content/services-search";

type SearchHighlightProps = {
  text: string;
  query: string;
};

/**
 * Surligne les occurrences de la recherche dans un texte (hub services).
 */
export function SearchHighlight({ text, query }: SearchHighlightProps) {
  const span = findSearchMatchSpan(text, query);
  if (!span) return text;

  const { start, end } = span;
  const before = text.slice(0, start);
  const match = text.slice(start, end);
  const after = text.slice(end);

  return (
    <>
      {before}
      <mark className="rounded-sm bg-[#1f2a7c]/15 px-0.5 text-inherit ring-1 ring-[#1f2a7c]/20">
        {match}
      </mark>
      <SearchHighlight text={after} query={query} />
    </>
  );
}
