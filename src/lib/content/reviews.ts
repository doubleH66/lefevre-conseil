/**
 * Avis clients réels --- source unique (témoignages accueil + page /avis + JSON-LD).
 *
 * Ces avis proviennent de la fiche Google du cabinet (Perpignan).
 * Note Google : 5,0 / 5 --- 13 avis (tous 5 étoiles). 11 avis comportent un
 * commentaire (listés ci-dessous) ; 2 sont des notes sans texte.
 *
 * IMPORTANT : uniquement des avis réels et publiquement vérifiables.
 * Aucun avis inventé. Comme ils sont visibles sur /avis, ils peuvent être
 * référencés dans le JSON-LD `Review` + `AggregateRating` de cette page.
 */

/** Statistiques Google (réelles, affichées sur /avis). */
export const GOOGLE_RATING = {
  value: 5,
  count: 13,
  /** Répartition par nombre d'étoiles (toutes les notes sont à 5). */
  distribution: { 5: 13, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
} as const;

export type ReviewTopic =
  | "Placements"
  | "Conseiller financier"
  | "Épargne"
  | "Expertise"
  | "Équipe";

/** Thèmes filtrables (ordre + libellés alignés sur la fiche Google). */
export const REVIEW_TOPICS: readonly ReviewTopic[] = [
  "Placements",
  "Conseiller financier",
  "Épargne",
  "Expertise",
  "Équipe",
];

export type ClientReview = {
  id: number;
  author: string;
  /** Initiales si pas de photo. */
  initials?: string;
  /** Photo Google (avatar) ; absent = pastille initiales. */
  avatar?: string | null;
  /** Texte intégral de l'avis. */
  quote: string;
  /** Fragments mis en valeur (gras) dans le carrousel d'accueil. */
  highlights: readonly string[];
  /** Thèmes associés (pour le filtre de /avis). */
  topics: readonly ReviewTopic[];
  /** Ancienneté relative telle qu'affichée sur Google. */
  date: string;
  /** Mis en avant sur la page d'accueil (3 avis détaillés). */
  featured?: boolean;
  source: "Google";
};

/** Lien vers la fiche Google (avis du cabinet à Perpignan). */
export const GOOGLE_REVIEWS_HREF =
  "https://www.google.com/search?sa=X&sca_esv=0cc88c52acce4ba2&sxsrf=ANbL-n4YRVknCa2MuHG4WnBzzZ3gjC_slw:1778781310216&q=avis%20sur%20lefevre-conseil%20perpignan&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxNDM2NrQ0MzczN7a0sDQAYjPzDYyMrxiVEssyixWKS4sUclLTUsuKUnWT8_OKUzNzFApSiwoy0_MS8xaxEqEIAGy4T8hlAAAA&rldimm=16331967673989098967&tbm=lcl&hl=fr-FR&ved=0CBAQ5foLahcKEwj4-vbirLmUAxUAAAAAHQAAAAAQCQ&biw=2137&bih=1232&dpr=1.6#lkt=LocalPoiReviews&arid=ChZDSUhNMG9nS0VJQ0FnTUNRN1lxM2Z3EAE";

/** Plateforme de synchronisation des avis affichés sur le site. */
export const HELLOKLIK_REVIEWS_URL = "https://helloklik.com";

export const CLIENT_REVIEWS: readonly ClientReview[] = [
  {
    id: 1,
    author: "Jean-Sébastien Maury",
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjXVNIYlruXRO89Vyix8M7iR3aDuVuBfyzCZFRrKxGUCGmdasw=w115-h115-p-rp-mo-br100",
    quote:
      "Je travaille avec Philippe Lefevre depuis 10 ans. Je l'ai toujours vu investi et assurant le suivi de ses clients. Un vrai indépendant motivé par la satisfaction de ses clients. C'est probablement ce qui lui permet de ne travailler qu'en recommandation.",
    highlights: [
      "10 ans",
      "investi et assurant le suivi de ses clients",
      "vrai indépendant",
      "recommandation",
    ],
    topics: ["Conseiller financier"],
    date: "il y a un an",
    featured: true,
    source: "Google",
  },
  {
    id: 2,
    author: "Angélique Hirmance",
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjXqTFzbLVypqz1_U5-Hm0G1CxDbeOUgg7nBaDMCyKaMCM0zUas=w115-h115-p-rp-mo-ba12-br100",
    quote:
      "Équipe professionnelle qui sait accompagner ses clients en tout point et à n'importe quel moment. Ce qui est super, c'est que nous pouvons bénéficier de leurs expertises dans les différents domaines. Je recommande vivement !",
    highlights: ["Équipe professionnelle", "expertises", "Je recommande vivement !"],
    topics: ["Équipe", "Expertise"],
    date: "il y a 2 ans",
    featured: true,
    source: "Google",
  },
  {
    id: 3,
    author: "Alain Pantel-Ruli",
    initials: "AP",
    quote:
      "Client de Lefèvre Conseil, je suis très satisfait des solutions de placement financier proposées. L'expertise sur les contrats de capitalisation et la gestion de l'épargne est évidente. Une approche professionnelle qui apporte une vraie valeur ajoutée pour sécuriser son capital. Un cabinet de gestion de patrimoine de confiance que je recommande vivement.",
    highlights: [
      "très satisfait",
      "contrats de capitalisation",
      "vraie valeur ajoutée",
      "cabinet de gestion de patrimoine de confiance",
    ],
    topics: ["Placements", "Épargne", "Expertise"],
    date: "il y a 2 mois",
    featured: true,
    source: "Google",
  },
  {
    id: 4,
    author: "Laurent Blasco",
    initials: "LB",
    quote:
      "Excellent conseiller en gestion de patrimoine à Perpignan. Lefèvre Conseil allie une approche humaine rare et des conseils techniques de haute précision. Ils m'ont proposé des placements financiers sur-mesure et des solutions de défiscalisation très pertinentes. Le suivi est au top, avec un accès en ligne hyper pratique. Son indépendance est une force.",
    highlights: [],
    topics: ["Placements", "Conseiller financier"],
    date: "il y a 4 mois",
    source: "Google",
  },
  {
    id: 5,
    author: "Roberto Montalva Lopez",
    initials: "RM",
    quote:
      "Très satisfait de l'accompagnement de Lefèvre Conseil situé à Perpignan. Que ce soit pour l'épargne et les placements financiers, les conseils sont de grande qualité. Un excellent gestionnaire de patrimoine qui prend le temps d'expliquer chaque stratégie patrimoniale. Une aide précieuse pour mes finances !",
    highlights: [],
    topics: ["Placements", "Épargne", "Conseiller financier"],
    date: "il y a 3 mois",
    source: "Google",
  },
  {
    id: 6,
    author: "Charlotte Voltz",
    initials: "CV",
    quote:
      "Cela fait 8 ans que Mr Lefevre est mon conseiller financier. Nous avons noué rapidement une relation de confiance. Il propose un large éventail de solutions en optimisation fiscale. Je le recommande vivement !",
    highlights: [],
    topics: ["Conseiller financier"],
    date: "il y a 2 ans",
    source: "Google",
  },
  {
    id: 7,
    author: "Bourrellier Anthony",
    initials: "BA",
    quote:
      "J'ai fait appel à leurs services pour la création de mon entreprise et sa gestion administrative, juridique et financière. J'ai pu enfin me concentrer sur mon activité afin de la développer avec assurance. J'encourage les personnes sérieuses à travailler avec cette équipe et je les remercie pour leur professionnalisme.",
    highlights: [],
    topics: ["Équipe"],
    date: "il y a 2 ans",
    source: "Google",
  },
  {
    id: 8,
    author: "Gregory El Bajoury",
    initials: "GE",
    quote: "Une équipe très professionnelle, dynamique et sympathique.",
    highlights: [],
    topics: ["Équipe"],
    date: "il y a 3 ans",
    source: "Google",
  },
  {
    id: 9,
    author: "Juan Ignacio Torrealday",
    initials: "JT",
    quote:
      "Excellente prise en charge, et surtout de l'initiative pour me trouver des solutions très performantes. Ma recommandation.",
    highlights: [],
    topics: [],
    date: "il y a 2 ans",
    source: "Google",
  },
  {
    id: 10,
    author: "Sandra Cardini",
    initials: "SC",
    quote: "Vraiment satisfaite de leur travail ! Leur professionnalisme !",
    highlights: [],
    topics: [],
    date: "il y a 2 ans",
    source: "Google",
  },
  {
    id: 11,
    author: "Coralie Panabieres",
    initials: "CP",
    quote: "Très professionnels.",
    highlights: [],
    topics: [],
    date: "il y a 2 ans",
    source: "Google",
  },
];

/** Avis détaillés mis en avant sur la page d'accueil. */
export const FEATURED_REVIEWS = CLIENT_REVIEWS.filter((r) => r.featured);

/** Nombre d'avis (avec commentaire) par thème --- pour les filtres de /avis. */
export function reviewTopicCounts(): Record<ReviewTopic, number> {
  const counts = Object.fromEntries(REVIEW_TOPICS.map((t) => [t, 0])) as Record<ReviewTopic, number>;
  for (const review of CLIENT_REVIEWS) {
    for (const topic of review.topics) counts[topic] += 1;
  }
  return counts;
}

export type ReviewQuotePart = { text: string; strong?: boolean };

/**
 * Découpe un avis en segments, en mettant en gras les `highlights`.
 * Permet de conserver l'emphase visuelle sans dupliquer le texte des avis.
 */
export function splitQuoteByHighlights(
  quote: string,
  highlights: readonly string[],
): ReviewQuotePart[] {
  if (highlights.length === 0) return [{ text: quote }];

  const parts: ReviewQuotePart[] = [];
  let rest = quote;

  while (rest.length > 0) {
    let bestIndex = -1;
    let bestHighlight = "";
    for (const h of highlights) {
      if (!h) continue;
      const idx = rest.indexOf(h);
      if (idx !== -1 && (bestIndex === -1 || idx < bestIndex)) {
        bestIndex = idx;
        bestHighlight = h;
      }
    }

    if (bestIndex === -1) {
      parts.push({ text: rest });
      break;
    }

    if (bestIndex > 0) parts.push({ text: rest.slice(0, bestIndex) });
    parts.push({ text: bestHighlight, strong: true });
    rest = rest.slice(bestIndex + bestHighlight.length);
  }

  return parts;
}
