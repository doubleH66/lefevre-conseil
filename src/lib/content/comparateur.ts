/** Intégrations iframe Assur Distribution (heritage). */
export const ASSUR_DISTRIBUTION_ORIGIN = "https://default.assurdistribution.fr";

export const COMPARATEUR_IFRAME = {
  path: "/comparateur/",
  iframeId: "comp-a5771bce93e200c36f7cd9dfd0e5deaa",
  title: "Comparateur assurance --- Assur Distribution",
  defaultHeightPx: 940,
} as const;

/** Comparateur mutuelle santé (parcours /sante). */
export const MUTUELLE_IFRAME = {
  path: "/sante/",
  iframeId: "comp-mutuelle-sante-lefevre",
  title: "Obtenir ma mutuelle --- Assur Distribution",
  defaultHeightPx: 820,
} as const;

export type AssurEmbedVariant = "comparateur" | "mutuelle";

export function assurEmbedConfig(variant: AssurEmbedVariant) {
  return variant === "mutuelle" ? MUTUELLE_IFRAME : COMPARATEUR_IFRAME;
}
