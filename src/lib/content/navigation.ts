import {
  BILAN_PATRIMOINE_HREF,
  CONSEILS_HREF,
  CONTACT_HREF,
  EXPERTISES_BASE_HREF,
  FAQ_HREF,
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
  { label: "FAQ", href: FAQ_HREF },
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
  ROUTES.bilanPatrimonial,
  ROUTES.contact,
  ROUTES.notreCabinet,
  ROUTES.conseils,
  ROUTES.faq,
  ROUTES.installation,
  ROUTES.simulateur,
  ROUTES.comparateur,
  ROUTES.login,
  ROUTES.cookies,
  ROUTES.mentionsLegales,
  ROUTES.confidentialite,
  ROUTES.conditionsUtilisation,
  ...SERVICE_CATALOG.map((s) => serviceHref(s.slug)),
]);

export function pathnameHasHeroOverlay(pathname: string): boolean {
  if (NAV_HERO_OVERLAY_PATHS.has(pathname)) return true;
  // Routes dynamiques avec bandeau hero : articles /conseils/[slug]
  if (pathname.startsWith(CONSEILS_HREF + "/")) return true;
  return false;
}

export const NAV_PRIMARY_CTA = {
  label: "Réaliser mon bilan patrimonial",
  href: BILAN_PATRIMOINE_HREF,
  mobileLabel: "Bilan patrimonial",
} as const;

export const NAV_CONTACT = { label: "Contact", href: CONTACT_HREF } as const;
export const NAV_CONSEILS = { label: "Conseils", href: CONSEILS_HREF } as const;
export const NAV_ACCOUNT = { label: "Compte", href: LOGIN_HREF } as const;

export { ROUTES };
