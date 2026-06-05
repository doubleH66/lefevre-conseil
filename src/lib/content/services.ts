import { serviceHref } from "@/lib/content/routes";
import { EXPERTISE_CAROUSEL_IMAGES } from "@/lib/content/media";

export { EXPERTISE_CAROUSEL_IMAGES };

export const SERVICE_CATALOG = [
  {
    slug: "gestion-de-patrimoine",
    title: "Gestion de patrimoine",
    menuLabel: "Gestion de patrimoine",
    summary:
      "Analyse globale, stratégie personnalisée et suivi dans le temps pour structurer votre patrimoine avec clarté.",
    order: 1,
  },
  {
    slug: "placements-epargne",
    title: "Placements & épargne",
    menuLabel: "Placements & épargne",
    summary:
      "Assurance-vie, PER, contrat de capitalisation et solutions d’investissement adaptées à votre profil, votre horizon et votre tolérance au risque.",
    order: 2,
  },
  {
    slug: "retraite-transmission",
    title: "Retraite & transmission",
    menuLabel: "Retraite & transmission",
    summary:
      "Préparer vos revenus futurs, anticiper votre retraite et organiser la transmission de votre patrimoine avec une approche familiale, juridique et fiscale adaptée.",
    order: 3,
  },
  {
    slug: "fiscalite-investissement",
    title: "Fiscalité & investissement",
    menuLabel: "Fiscalité & investissement",
    summary:
      "Identifier les leviers d’optimisation possibles dans le respect du cadre légal, sans promesse excessive ni solution standardisée.",
    order: 4,
  },
  {
    slug: "prevoyance-sante-assurance-pret",
    title: "Prévoyance, santé & assurance de prêt",
    menuLabel: "Prévoyance, santé & assurance de prêt",
    summary:
      "Protéger vos revenus, votre famille, votre santé et vos projets avec des solutions adaptées à votre situation.",
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
