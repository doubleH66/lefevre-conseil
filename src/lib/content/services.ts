import { SERVICES_BASE_HREF, serviceHref } from "@/lib/content/routes";

export const SERVICE_CATALOG = [
  {
    slug: "gestion-de-patrimoine",
    title: "Gestion de patrimoine",
    menuLabel: "Gestion de patrimoine",
    summary:
      "Le service global : analyse, stratégie, accompagnement et suivi pour organiser, développer, protéger et transmettre votre patrimoine.",
    order: 1,
  },
  {
    slug: "placements-epargne",
    title: "Placements & épargne",
    menuLabel: "Placements & épargne",
    summary:
      "Assurance-vie, PER, contrat de capitalisation, solutions d’investissement et épargne long terme, selon votre profil.",
    order: 2,
  },
  {
    slug: "retraite-transmission",
    title: "Retraite & transmission",
    menuLabel: "Retraite & transmission",
    summary:
      "Préparer sa retraite, créer des revenus complémentaires et organiser la transmission du patrimoine.",
    order: 3,
  },
  {
    slug: "fiscalite-investissement",
    title: "Fiscalité & investissement",
    menuLabel: "Fiscalité & investissement",
    summary:
      "Optimisation fiscale et investissement patrimonial cohérent, sans promesses agressives ni défiscalisation miracle.",
    order: 4,
  },
  {
    slug: "prevoyance-sante-assurance-pret",
    title: "Prévoyance, santé & assurance de prêt",
    menuLabel: "Prévoyance, santé & assurance de prêt",
    summary:
      "Protéger ses revenus, sa famille, sa santé et réduire le coût de l’assurance emprunteur tout en conservant une bonne protection.",
    order: 5,
  },
  {
    slug: "investissement-art",
    title: "Investissement dans l’art",
    menuLabel: "Investissement dans l’art",
    summary:
      "Leasing d’œuvres, fiscalité, décoration d’entreprise : accompagnement clé en main pour les entreprises.",
    order: 6,
  },
] as const;

export type ServiceSlug = (typeof SERVICE_CATALOG)[number]["slug"];

const PUBLIC_MEDIA =
  "https://qhiyxnbcegbxtvydcjhf.supabase.co/storage/v1/object/public/public-media/1a8c4232-58af-4b1b-9330-6055134a8829";

export const EXPERTISE_CAROUSEL_IMAGES: Record<ServiceSlug, string> = {
  "gestion-de-patrimoine": `${PUBLIC_MEDIA}/1778837698536-wkym9v-patrimoine-_-fiscalite_.png`,
  "placements-epargne": `${PUBLIC_MEDIA}/1778837698085-3asm6b-E_pargne-_-retraite.png`,
  "retraite-transmission": `${PUBLIC_MEDIA}/1778837698085-3asm6b-E_pargne-_-retraite.png`,
  "fiscalite-investissement": `${PUBLIC_MEDIA}/1778837698536-wkym9v-patrimoine-_-fiscalite_.png`,
  "prevoyance-sante-assurance-pret": `${PUBLIC_MEDIA}/1778837699082-rlbqt2-Protection-et-assurance.png`,
  "investissement-art": `${PUBLIC_MEDIA}/1778837697772-tjrsq3-diversification-accompagnement.png`,
};

export const BILAN_CTA_BACKGROUND_IMAGE = EXPERTISE_CAROUSEL_IMAGES["fiscalite-investissement"];

/** Image bandeau fusionné page défiscalisation (heritage). */
export const DEFISCALISATION_CAROUSEL_HERO_IMAGE = EXPERTISE_CAROUSEL_IMAGES["fiscalite-investissement"];

export function serviceDetailHref(slug: ServiceSlug) {
  return serviceHref(slug);
}

export function getServiceBySlug(slug: string) {
  return SERVICE_CATALOG.find((s) => s.slug === slug);
}

export function isServiceSlug(slug: string): slug is ServiceSlug {
  return SERVICE_CATALOG.some((s) => s.slug === slug);
}
