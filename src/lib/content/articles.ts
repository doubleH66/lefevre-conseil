const CDN =
  "https://qhiyxnbcegbxtvydcjhf.supabase.co/storage/v1/object/public/public-media/1a8c4232-58af-4b1b-9330-6055134a8829";

export const ARTICLE_IMAGES = {
  fiscalite: `${CDN}/1778837698536-wkym9v-patrimoine-_-fiscalite_.png`,
  epargne: `${CDN}/1778837698085-3asm6b-E_pargne-_-retraite.png`,
  prevoyance: `${CDN}/1778837699082-rlbqt2-Protection-et-assurance.png`,
  patrimoine: `${CDN}/1778837697772-tjrsq3-diversification-accompagnement.png`,
} as const;

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

export const ALL_ARTICLES: Article[] = [
  {
    slug: "loi-de-finances-2026-ce-qui-change",
    category: "Fiscalité",
    date: "12 mai 2026",
    readTime: "5 min",
    featured: true,
    image: ARTICLE_IMAGES.fiscalite,
    title: "Loi de finances 2026 : les leviers à actionner avant l'été",
    excerpt:
      "Plafonds, abattements, dispositifs : un tour d'horizon pratique pour optimiser sa fiscalité avant la prochaine déclaration.",
  },
  {
    slug: "assurance-vie-2026-rendement-fonds-euros",
    category: "Épargne",
    date: "28 avr. 2026",
    readTime: "4 min",
    image: ARTICLE_IMAGES.epargne,
    title: "Assurance-vie 2026 : pourquoi le fonds en euros redevient intéressant",
    excerpt:
      "Avec la remontée des taux, certains fonds en euros nouvelle génération offrent à nouveau un couple risque/rendement attractif.",
  },
  {
    slug: "loi-lemoine-changer-assurance-pret",
    category: "Prévoyance",
    date: "15 avr. 2026",
    readTime: "3 min",
    image: ARTICLE_IMAGES.prevoyance,
    title: "Loi Lemoine : comment changer d'assurance de prêt en pratique",
    excerpt:
      "Mode d'emploi pas à pas pour résilier et déléguer son contrat — et économiser plusieurs milliers d'euros sur la durée.",
  },
  {
    slug: "per-qui-devrait-cotiser-2026",
    category: "Retraite",
    date: "3 avr. 2026",
    readTime: "4 min",
    image: ARTICLE_IMAGES.epargne,
    title: "PER : qui devrait vraiment y cotiser en 2026 ?",
    excerpt:
      "Le Plan d'épargne retraite n'est pas avantageux pour tout le monde. On vous explique pour quels profils il fait vraiment sens — et quand le laisser de côté.",
  },
  {
    slug: "deficit-foncier-2026-guide",
    category: "Immobilier",
    date: "20 mars 2026",
    readTime: "5 min",
    image: ARTICLE_IMAGES.fiscalite,
    title: "Déficit foncier en 2026 : le guide complet",
    excerpt:
      "Travaux, charges déductibles, plafonds, report sur le revenu global : comment ce mécanisme peut alléger votre fiscalité si vous êtes propriétaire.",
  },
  {
    slug: "proteger-conjoint-survivant",
    category: "Transmission",
    date: "8 mars 2026",
    readTime: "4 min",
    image: ARTICLE_IMAGES.patrimoine,
    title: "Comment protéger son conjoint en cas de décès ?",
    excerpt:
      "Testament, clause bénéficiaire, démembrement, régime matrimonial : les outils pour éviter que le survivant se retrouve en difficulté.",
  },
  {
    slug: "scpi-avantages-risques-2026",
    category: "Épargne",
    date: "25 fév. 2026",
    readTime: "4 min",
    image: ARTICLE_IMAGES.epargne,
    title: "SCPI : les avantages et les risques qu'on vous cache rarement",
    excerpt:
      "Revenus réguliers, diversification, fiscalité… mais aussi illiquidité, frais cachés et risque de perte en capital. Un bilan honnête.",
  },
  {
    slug: "demembrement-propriete-explique",
    category: "Transmission",
    date: "12 fév. 2026",
    readTime: "5 min",
    image: ARTICLE_IMAGES.patrimoine,
    title: "Démembrement de propriété : la stratégie de transmission sous-utilisée",
    excerpt:
      "Nue-propriété, usufruit, pleine propriété : comprendre le démembrement pour transmettre son patrimoine tout en conservant ses revenus.",
  },
  {
    slug: "bilan-patrimonial-a-quoi-attendre",
    category: "Patrimoine",
    date: "30 jan. 2026",
    readTime: "3 min",
    image: ARTICLE_IMAGES.patrimoine,
    title: "Bilan patrimonial : à quoi s'attendre concrètement ?",
    excerpt:
      "Questions posées, documents demandés, durée, résultat : on démystifie le premier rendez-vous avec un conseiller en gestion de patrimoine.",
  },
];

export const FEATURED_ARTICLE = ALL_ARTICLES.find((a) => a.featured) ?? ALL_ARTICLES[0];
export const ARTICLES = ALL_ARTICLES.filter((a) => !a.featured);

export const HOME_ARTICLES_TEASER = ALL_ARTICLES.slice(0, 3);

export function getArticleBySlug(slug: string): Article | undefined {
  return ALL_ARTICLES.find((a) => a.slug === slug);
}

export function getAllArticleSlugs(): string[] {
  return ALL_ARTICLES.map((a) => a.slug);
}
