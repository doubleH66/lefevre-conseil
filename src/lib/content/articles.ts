export type Article = {
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
};

export const FEATURED_ARTICLE: Article = {
  slug: "loi-de-finances-2026-ce-qui-change",
  category: "Fiscalité",
  date: "12 mai 2026",
  readTime: "5 min",
  title: "Loi de finances 2026 : les leviers à actionner avant l’été.",
  excerpt:
    "Plafonds, abattements, dispositifs : un tour d’horizon pratique pour optimiser sa fiscalité avant la prochaine déclaration.",
};

export const ARTICLES: Article[] = [
  {
    slug: "assurance-vie-2026-rendement-fonds-euros",
    category: "Épargne",
    date: "28 avril 2026",
    readTime: "4 min",
    title: "Assurance-vie 2026 : pourquoi le fonds en euros redevient intéressant.",
    excerpt:
      "Avec la remontée des taux, certains fonds en euros nouvelle génération offrent à nouveau un couple risque/rendement attractif.",
  },
  {
    slug: "loi-lemoine-changer-assurance-pret",
    category: "Crédit",
    date: "15 avril 2026",
    readTime: "3 min",
    title: "Loi Lemoine : comment changer d’assurance de prêt en pratique.",
    excerpt:
      "Mode d’emploi pas à pas pour résilier et déléguer son contrat - et économiser plusieurs milliers d’euros.",
  },
];

/** Bandeau accueil : 3 articles (à la une + récents). */
export const HOME_ARTICLES_TEASER = [FEATURED_ARTICLE, ARTICLES[0], ARTICLES[1]];

const ALL_ARTICLES = [FEATURED_ARTICLE, ...ARTICLES] as const;

export function getArticleBySlug(slug: string): Article | undefined {
  return ALL_ARTICLES.find((a) => a.slug === slug);
}

export function getAllArticleSlugs(): string[] {
  return ALL_ARTICLES.map((a) => a.slug);
}
