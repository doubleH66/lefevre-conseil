import type { ServiceSlug } from "@/lib/content/services";
import type { ComparisonTableData } from "@/components/ui/comparison-table";

export type ServiceFaqItem = { q: string; a: string };

export type ServicePremiumContent = {
  slug: ServiceSlug;
  meta: { title: string; description: string };
  hero: {
    h1: string;
    subtitle: string;
    /** Début de la partie non surlignée dans l’accroche du bandeau (heritage défiscalisation). */
    taglineHighlightAfter?: string;
    intro: string;
  };
  whyImportant: {
    title: string;
    paragraphs: string[];
  };
  accompaniment: {
    title: string;
    steps: { title: string; description: string }[];
  };
  solutions: {
    title: string;
    intro?: string;
    items: { title: string; description: string }[];
  };
  forWho: {
    title: string;
    profiles: string[];
  };
  whyUs: {
    title: string;
    points: { title: string; description: string }[];
  };
  summary: {
    title: string;
    bullets: string[];
  };
  faq: ServiceFaqItem[];
  internalLinks: { slug: ServiceSlug; label: string }[];
  /** Tableau de comparaison optionnel, affiché dans le bloc solutions */
  comparison?: ComparisonTableData;
  /** Tableau avant / après accompagnement cabinet */
  beforeAfter?: ComparisonTableData;
};
