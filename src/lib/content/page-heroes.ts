/** Hauteur bandeau photo — gabarit défiscalisation / pages marketing. */
export const SUBPAGE_DEFISCAL_HERO_MIN_CLASS =
  "min-h-[22rem] sm:min-h-[26rem] lg:min-h-[29rem] xl:min-h-[32rem]";

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
    title: "Contactez le cabinet",
    tagline:
      "Un conseiller vous répond sous 24 h, à Perpignan ou partout en France, en cabinet ou à distance.",
    taglineHighlightAfter: ", à Perpignan",
    titleId: "contact-hero-title",
  },
  notreCabinet: {
    title: "Qui sommes-nous ?",
    tagline:
      "Lefèvre Conseil, conseil en gestion de patrimoine à Perpignan — cabinet indépendant, une même exigence pour toute la France.",
    taglineHighlightAfter: "cabinet indépendant",
    titleId: "notre-cabinet-hero-title",
  },
  actualites: {
    title: "Conseils & actualités",
    tagline:
      "Décryptages patrimoniaux, fiscalité et épargne — des articles pour mieux décider, sans jargon inutile.",
    taglineHighlightAfter: " — des articles",
    titleId: "actualites-hero-title",
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
  services: {
    title: "Nos expertises",
    tagline:
      "Six domaines d’accompagnement pour structurer, développer et protéger votre patrimoine.",
    taglineHighlightAfter: ", développer",
    titleId: "services-hero-title",
  },
  bilanPatrimonial: {
    title: "Réalisez votre bilan patrimonial",
    tagline:
      "Faites le point sur votre situation, vos objectifs et vos priorités — sans engagement immédiat.",
    taglineHighlightAfter: " — sans engagement",
    titleId: "bilan-hero-title",
  },
  simulateur: {
    title: "Simulateur patrimonial",
    tagline:
      "Une première piste en quelques minutes — pour préparer votre échange avec le cabinet.",
    taglineHighlightAfter: " — pour préparer",
    titleId: "simulateur-hero-title",
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
  login: {
    title: "Espace client",
    tagline:
      "Connectez-vous pour suivre vos dossiers — accès sécurisé réservé aux clients du cabinet.",
    taglineHighlightAfter: " — accès sécurisé",
    titleId: "login-hero-title",
  },
} as const satisfies Record<string, PageHeroConfig>;

export type PageHeroKey = keyof typeof PAGE_HEROES;
