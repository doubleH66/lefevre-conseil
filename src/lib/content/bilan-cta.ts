import { CONTACT_HREF } from "@/lib/content/routes";
import { BILAN_CTA_BACKGROUND_IMAGE } from "@/lib/content/services";

/** Textes uniques du bandeau CTA patrimonial (évite les répétitions hero / FAQ). */
export const BILAN_CTA_CONTENT = {
  title: "Faisons le point sur votre situation patrimoniale.",
  supporting: "Identifions vos priorités — au cabinet, par téléphone ou en visio.",
  primaryLabel: "Prendre rendez-vous",
  primaryHref: CONTACT_HREF,
} as const;

export const BILAN_CTA_IMAGE = BILAN_CTA_BACKGROUND_IMAGE;
