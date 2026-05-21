/** Sur une sous-route, les ancres `#section` doivent cibler la page d’accueil : `/#section`. */
export function resolveSiteHref(pathname: string, href: string): string {
  if (!href.startsWith("#")) return href;
  if (pathname === "/") return href;
  return `/${href}`;
}
