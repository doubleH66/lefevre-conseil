import { FAQ_HREF } from "@/lib/content/routes";

/** Nombre max de questions sur les blocs FAQ « courts » (hors page /faq). */
export const SHORT_FAQ_MAX_ITEMS = 4;

export const FAQ_EXPAND_LINK = {
  href: FAQ_HREF,
  label: "Voir toutes les réponses",
} as const;
