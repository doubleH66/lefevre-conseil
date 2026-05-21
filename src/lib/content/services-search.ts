import { SERVICE_CATALOG } from "@/lib/content/services";
import type { ServiceSlug } from "@/lib/content/services";
import { getServicePremiumContent } from "@/lib/content/services-premium";

export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function matchesServiceSearch(haystack: string, query: string): boolean {
  const q = query.trim();
  if (!q) return false;
  return normalizeSearchText(haystack).includes(normalizeSearchText(q));
}

/** Index dans `text` pour chaque caractère normalisé (gestion des accents). */
function normalizedCharStarts(text: string): number[] {
  const starts: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const normalized = normalizeSearchText(text[i]!);
    for (let j = 0; j < normalized.length; j++) {
      starts.push(i);
    }
  }
  return starts;
}

export function findSearchMatchSpan(
  text: string,
  query: string,
): { start: number; end: number } | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const normText = normalizeSearchText(text);
  const normQ = normalizeSearchText(trimmed);
  const idx = normText.indexOf(normQ);
  if (idx === -1) return null;

  const charStarts = normalizedCharStarts(text);
  const start = charStarts[idx] ?? 0;
  const endCharIdx = idx + normQ.length - 1;
  const end = (charStarts[endCharIdx] ?? text.length - 1) + 1;
  return { start, end };
}

export function serviceSearchHaystack(slug: ServiceSlug): string {
  const catalog = SERVICE_CATALOG.find((s) => s.slug === slug);
  const content = getServicePremiumContent(slug);
  if (!catalog || !content) return "";

  return [
    catalog.title,
    catalog.menuLabel,
    catalog.summary,
    content.hero.h1,
    content.hero.subtitle,
    content.hero.intro,
    content.whyImportant.title,
    ...content.whyImportant.paragraphs,
    ...content.solutions.items.map((f) => `${f.title} ${f.description}`),
    ...content.forWho.profiles,
    ...content.faq.map((f) => `${f.q} ${f.a}`),
  ].join(" ");
}
