/** Routes et ancres — source unique pour tout le site. */
export const ROUTES = {
  home: "/",
  bilanPatrimonial: "/bilan-patrimonial",
  contact: "/contact",
  notreCabinet: "/notre-cabinet",
  expertises: "/expertises",
  conseils: "/conseils",
  faq: "/faq",
  installation: "/installation",
  login: "/login",
  espaceClient: "/espace-client",
  espaceAdmin: "/espace-admin",
  cookies: "/cookies",
  simulateur: "/simulateur",
  comparateur: "/comparateur",
  mentionsLegales: "/mentions-legales",
  confidentialite: "/confidentialite",
  conditionsUtilisation: "/conditions-utilisation",
} as const;

export const SIMULATION_ANCHOR_ID = "simulation" as const;

export const BILAN_PATRIMOINE_HREF = ROUTES.bilanPatrimonial;
export const SIMULATION_HREF = ROUTES.bilanPatrimonial;
export const SIMULATEUR_HREF = ROUTES.simulateur;
export const CONTACT_HREF = ROUTES.contact;
export const CONSEILS_HREF = ROUTES.conseils;
/** @deprecated Utiliser `CONSEILS_HREF`. */
export const ACTUALITES_HREF = CONSEILS_HREF;
export const NOTRE_CABINET_HREF = ROUTES.notreCabinet;
export const FAQ_HREF = ROUTES.faq;
export const INSTALLATION_HREF = ROUTES.installation;
export const EXPERTISES_BASE_HREF = ROUTES.expertises;
/** @deprecated Utiliser `EXPERTISES_BASE_HREF`. */
export const SERVICES_BASE_HREF = EXPERTISES_BASE_HREF;
export const LOGIN_HREF = ROUTES.login;
export const LOGIN_INSCRIPTION_HREF = `${ROUTES.login}?tab=inscription` as const;

export function serviceHref(slug: string) {
  return `${ROUTES.expertises}/${slug}`;
}

export function articleHref(slug: string) {
  return `${ROUTES.conseils}/${slug}`;
}
