import { ARTICLE_STOCK_IMAGES } from "@/lib/content/media";

export const ARTICLE_IMAGES = ARTICLE_STOCK_IMAGES;

export const ARTICLE_CATEGORIES = [
  "Fiscalité",
  "Épargne",
  "Retraite",
  "Patrimoine",
  "Prévoyance",
  "Transmission",
  "Immobilier",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export type Article = {
  slug: string;
  category: ArticleCategory;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
  featured?: boolean;
};

export const ARTICLES_PUBLISHED = false as const;

/** Aucun article publié pour le moment --- ajouter les entrées ici à la mise en ligne. */
export const ALL_ARTICLES: Article[] = [];

export const HOME_ARTICLES_TEASER = ALL_ARTICLES.slice(0, 3);

export function getArticleBySlug(slug: string): Article | undefined {
  return ALL_ARTICLES.find((a) => a.slug === slug);
}

export function getAllArticleSlugs(): string[] {
  return ALL_ARTICLES.map((a) => a.slug);
}
