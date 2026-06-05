import { PAGE_HERO_MIN_HEIGHT_CLASS } from "@/lib/content/hero-shell";

/** @deprecated Utiliser `PAGE_HERO_MIN_HEIGHT_CLASS`. */
export const SUBPAGE_DEFISCAL_HERO_MIN_CLASS = PAGE_HERO_MIN_HEIGHT_CLASS;

export type PageHeroConfig = {
  title: string;
  tagline: string;
  taglineHighlightAfter?: string;
  titleId?: string;
  /** Affiché sous le bandeau (pas dans le hero). */
  intro?: string;
};

export const PAGE_HEROES = {
  contact: {
    title: "Prendre rendez-vous avec Lefèvre Conseil",
    tagline:
      "Expliquez-nous votre situation patrimoniale. Le cabinet vous recontacte pour organiser un premier échange clair, confidentiel et sans engagement.",
    taglineHighlightAfter: "organiser un premier échange ",
    titleId: "contact-hero-title",
  },
  notreCabinet: {
    title: "Un cabinet de conseil patrimonial indépendant à Perpignan",
    tagline:
      "Lefèvre Conseil accompagne les particuliers, dirigeants et professions libérales dans l’organisation, la protection et la transmission de leur patrimoine.",
    taglineHighlightAfter: "dirigeants et professions libérales",
    titleId: "notre-cabinet-hero-title",
  },
  avis: {
    title: "Avis clients Lefèvre Conseil",
    tagline:
      "Les avis clients reflètent la qualité du suivi, la pédagogie et la relation de confiance construite avec le cabinet.",
    taglineHighlightAfter: "la relation de confiance",
    titleId: "avis-hero-title",
  },
  conseils: {
    title: "Conseils patrimoniaux",
    tagline:
      "Retrouvez prochainement des contenus pédagogiques pour mieux comprendre les sujets patrimoniaux : assurance-vie, PER, retraite, transmission, fiscalité, prévoyance et organisation du patrimoine.",
    taglineHighlightAfter: " : assurance-vie",
    titleId: "conseils-hero-title",
  },
  faq: {
    title: "Questions fréquentes",
    tagline:
      "Délais, rendez-vous, zone d’intervention : les réponses essentielles avant de nous écrire ou de lancer une simulation.",
    taglineHighlightAfter: " : les réponses",
    titleId: "faq-hero-title",
  },
  installation: {
    title: "Installer l’application",
    tagline:
      "Ajoutez Lefèvre Conseil sur votre écran d’accueil — accès rapide, icône dédiée, affichage plein écran.",
    taglineHighlightAfter: " — accès rapide",
    titleId: "installation-hero-title",
  },
  cookies: {
    title: "Cookies & confidentialité",
    tagline:
      "Transparence sur les traceurs utilisés sur le site et vos choix de consentement.",
    taglineHighlightAfter: " sur le site",
    titleId: "cookies-hero-title",
  },
  expertises: {
    title: "Expertises en gestion de patrimoine",
    tagline:
      "Lefèvre Conseil accompagne ses clients sur les principaux sujets patrimoniaux : épargne, placements, retraite, transmission, fiscalité et prévoyance — au cabinet à Perpignan ou à distance partout en France.",
    taglineHighlightAfter: " — au cabinet à Perpignan",
    titleId: "expertises-hero-title",
  },
  simulateur: {
    title: "Simulateur patrimonial",
    tagline:
      "Une première piste en quelques minutes — pour préparer votre échange avec le cabinet.",
    taglineHighlightAfter: " — pour préparer",
    titleId: "simulateur-hero-title",
  },
  simulateurMutuelle: {
    title: "Proposition mutuelle santé",
    tagline:
      "Une demande simple en quelques minutes — Philippe Lefèvre vous recontacte pour une offre adaptée, sans souscription en ligne.",
    taglineHighlightAfter: " — Philippe Lefèvre",
    titleId: "simulateur-mutuelle-hero-title",
  },
  comparateur: {
    title: "Comparateur assurance",
    tagline:
      "Comparez les offres en ligne — puis affinez avec un conseiller pour choisir la bonne protection.",
    taglineHighlightAfter: " — puis affinez",
    titleId: "comparateur-hero-title",
  },
  mentionsLegales: {
    title: "Mentions légales",
    tagline: "Éditeur, hébergement, propriété intellectuelle et cadre de responsabilité du site.",
    taglineHighlightAfter: " et cadre",
    titleId: "mentions-legales-hero-title",
  },
  confidentialite: {
    title: "Politique de confidentialité",
    tagline:
      "Données personnelles, finalités, durées de conservation et exercice de vos droits RGPD.",
    taglineHighlightAfter: " et exercice",
    titleId: "confidentialite-hero-title",
  },
  conditionsUtilisation: {
    title: "Conditions d’utilisation",
    tagline:
      "Règles d’accès au site, compte client et limites de responsabilité des contenus publiés.",
    taglineHighlightAfter: " et limites",
    titleId: "cgu-hero-title",
  },
  reclamations: {
    title: "Réclamations clients",
    tagline:
      "Une procédure claire en trois niveaux, puis médiation gratuite si votre réclamation reste sans réponse satisfaisante.",
    taglineHighlightAfter: " en trois niveaux",
    titleId: "reclamations-hero-title",
  },
  login: {
    title: "Espace client",
    tagline:
      "Connectez-vous pour suivre vos dossiers — accès sécurisé réservé aux clients du cabinet.",
    taglineHighlightAfter: " — accès sécurisé",
    titleId: "login-hero-title",
  },
} as const satisfies Record<string, PageHeroConfig>;

export type PageHeroKey = keyof typeof PAGE_HEROES;
