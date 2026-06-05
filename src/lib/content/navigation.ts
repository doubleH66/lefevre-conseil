import {
  AVIS_HREF,
  CONSEILS_HREF,
  CONTACT_HREF,
  EXPERTISES_BASE_HREF,
  INSTALLATION_HREF,
  NOTRE_CABINET_HREF,
  ROUTES,
  LOGIN_HREF,
  serviceHref,
} from "@/lib/content/routes";
import { SERVICE_CATALOG } from "@/lib/content/services";

export type NavLink = { label: string; href: string };

export const NAV_CABINET_LINKS: NavLink[] = [
  { label: "Qui sommes-nous", href: NOTRE_CABINET_HREF },
  { label: "Installer l’app", href: INSTALLATION_HREF },
];

export const NAV_EXPERTISE_LINKS: NavLink[] = [
  { label: "Voir toutes les expertises", href: EXPERTISES_BASE_HREF },
  ...SERVICE_CATALOG.map((s) => ({ label: s.title, href: serviceHref(s.slug) })),
];

export const NAV_DROPDOWNS = {
  cabinet: { label: "Notre cabinet", links: NAV_CABINET_LINKS },
  expertises: { label: "Nos expertises", links: NAV_EXPERTISE_LINKS },
} as const;

export type NavDropdownId = keyof typeof NAV_DROPDOWNS;

/** Routes avec bandeau hero sombre : navbar transparente en haut de page. */
export const NAV_HERO_OVERLAY_PATHS = new Set<string>([
  ROUTES.home,
  ROUTES.expertises,
  ROUTES.contact,
  ROUTES.notreCabinet,
  ROUTES.conseils,
  ROUTES.faq,
  ROUTES.installation,
  ROUTES.simulateur,
  ROUTES.simulateurMutuelle,
  ROUTES.comparateur,
  ROUTES.login,
  ROUTES.cookies,
  ROUTES.mentionsLegales,
  ROUTES.confidentialite,
  ROUTES.conditionsUtilisation,
  ROUTES.avis,
  ...SERVICE_CATALOG.map((s) => serviceHref(s.slug)),
]);

export function pathnameHasHeroOverlay(pathname: string): boolean {
  if (NAV_HERO_OVERLAY_PATHS.has(pathname)) return true;
  // Routes dynamiques avec bandeau hero : articles /conseils/[slug]
  if (pathname.startsWith(CONSEILS_HREF + "/")) return true;
  return false;
}

export const NAV_PRIMARY_CTA = {
  label: "Prendre rendez-vous",
  href: CONTACT_HREF,
  mobileLabel: "Prendre rendez-vous",
} as const;

export const NAV_CONTACT = { label: "Contact", href: CONTACT_HREF } as const;
export const NAV_CONSEILS = { label: "Conseils", href: CONSEILS_HREF } as const;
export const NAV_AVIS = { label: "Avis clients", href: AVIS_HREF } as const;
export const NAV_ACCOUNT = { label: "Compte", href: LOGIN_HREF } as const;

export type NavAccountMenuItem =
  | { id: string; label: string; kind: "login" }
  | { id: string; label: string; kind: "link"; href: string };

/** Menu du bouton compte (navbar) — style Hey Aurenis. */
export const NAV_ACCOUNT_MENU: NavAccountMenuItem[] = [
  { id: "login", label: "Connexion", kind: "login" },
  { id: "app", label: "Téléchargez l'app", kind: "link", href: INSTALLATION_HREF },
  { id: "contact", label: "Contact", kind: "link", href: CONTACT_HREF },
];

export { ROUTES };
