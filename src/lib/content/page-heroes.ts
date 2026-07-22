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
    title: "Conseil patrimonial à Perpignan",
    tagline:
      "Accompagnement indépendant pour organiser, protéger et transmettre votre patrimoine.",
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
      "Ajoutez Lefèvre Conseil sur votre écran d’accueil - accès rapide, icône dédiée, affichage plein écran.",
    taglineHighlightAfter: " - accès rapide",
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
      "Lefèvre Conseil accompagne ses clients sur les principaux sujets patrimoniaux : épargne, placements, retraite, transmission, fiscalité et prévoyance - au cabinet à Perpignan ou à distance partout en France.",
    taglineHighlightAfter: " - au cabinet à Perpignan",
    titleId: "expertises-hero-title",
  },
  simulateur: {
    title: "Simulateur patrimonial",
    tagline:
      "Une première piste en quelques minutes - pour préparer votre échange avec le cabinet.",
    taglineHighlightAfter: " - pour préparer",
    titleId: "simulateur-hero-title",
  },
  simulateurs: {
    title: "Mutuelle santé et assurance emprunteur",
    tagline:
      "Demandez une proposition mutuelle en ligne, ou comparez votre assurance de prêt. Un conseiller affine ensuite avec vous les garanties et le budget.",
    taglineHighlightAfter: " Un conseiller",
    titleId: "simulateurs-hero-title",
  },
  simulateurMutuelle: {
    title: "Mutuelle santé",
    tagline:
      "Parcours en 6 étapes : profil, coordonnées, besoins santé et budget. Philippe Lefèvre vous recontacte pour une offre adaptée — sans souscription en ligne ni engagement.",
    taglineHighlightAfter: " Philippe Lefèvre",
    titleId: "simulateur-mutuelle-hero-title",
  },
  comparateur: {
    title: "Assurance de prêt",
    tagline:
      "Comparez votre assurance emprunteur en ligne — délégation possible (loi Lemoine). Un conseiller affine ensuite garanties et budget avec vous.",
    taglineHighlightAfter: " Un conseiller",
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
      "Connectez-vous pour suivre vos dossiers - accès sécurisé réservé aux clients du cabinet.",
    taglineHighlightAfter: " - accès sécurisé",
    titleId: "login-hero-title",
  },
} as const satisfies Record<string, PageHeroConfig>;

export type PageHeroKey = keyof typeof PAGE_HEROES;
