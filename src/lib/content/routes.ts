/** Routes et ancres --- source unique pour tout le site. */
export const ROUTES = {
  home: "/",
  contact: "/contact",
  notreCabinet: "/notre-cabinet",
  expertises: "/expertises",
  conseils: "/conseils",
  avis: "/avis",
  faq: "/faq",
  installation: "/installation",
  login: "/login",
  espaceClient: "/espace-client",
  espaceClientProfil: "/espace-client/profil",
  espaceClientReglages: "/espace-client/reglages",
  espaceAdmin: "/espace-admin",
  espaceAdminClients: "/espace-admin/clients",
  espaceAdminDemandes: "/espace-admin/demandes",
  espaceAdminDocuments: "/espace-admin/documents",
  espaceAdminMessages: "/espace-admin/messages",
  espaceAdminReglages: "/espace-admin/reglages",
  cookies: "/cookies",
  simulateur: "/simulateur",
  simulateurMutuelle: "/simulateur-mutuelle",
  comparateur: "/comparateur",
  mentionsLegales: "/mentions-legales",
  confidentialite: "/confidentialite",
  conditionsUtilisation: "/conditions-utilisation",
  reclamations: "/reclamations",
} as const;

export const SIMULATION_ANCHOR_ID = "simulation" as const;

/** @deprecated Parcours unifié : la prise de rendez-vous passe par /contact. */
export const BILAN_PATRIMOINE_HREF = ROUTES.contact;
/** @deprecated Parcours unifié : la prise de rendez-vous passe par /contact. */
export const DEMANDE_HREF = ROUTES.contact;
/** @deprecated CTA principal unifié vers /contact (le simulateur reste un outil secondaire). */
export const SIMULATION_HREF = ROUTES.contact;
export const SIMULATEUR_HREF = ROUTES.simulateur;
export const SIMULATEUR_MUTUELLE_HREF = ROUTES.simulateurMutuelle;
export const CONTACT_HREF = ROUTES.contact;
export const CONSEILS_HREF = ROUTES.conseils;
export const AVIS_HREF = ROUTES.avis;
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
