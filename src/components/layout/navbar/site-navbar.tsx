"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AccountAuthSheet } from "@/components/nav/account-auth-sheet";
import { NavContent } from "@/components/layout/navbar/nav-content";
import type { NavDropdownId } from "@/lib/content/navigation";
import { pathnameHasHeroOverlay } from "@/lib/content/navigation";
import { resolveSiteHref } from "@/lib/resolve-site-href";
import { useNavbarDocked } from "@/components/layout/navbar/hooks/use-navbar-docked";
import { useNavbarTheme } from "@/components/layout/navbar/hooks/use-navbar-theme";
import { NavMobileMenu } from "@/components/layout/navbar/nav-mobile-menu";
import {
  NAV_SHELL_TRANSPARENT,
  navGlassSurfaceDocked,
  navGlassWhite,
} from "@/components/layout/navbar/styles";
import { cn } from "@/lib/utils";

export type SiteNavbarProps = {
  /**
   * Force le mode hero (transparent en haut). Par défaut : détecté via le pathname.
   * @deprecated Préférer la détection automatique ; conservé pour compatibilité.
   */
  hero?: boolean;
};

/**
 * Navbar sticky (fixed) — une seule barre, toujours interactive.
 * Sur les pages hero : transparent en haut, fond verre au scroll.
 */
export function SiteNavbar({ hero: heroProp }: SiteNavbarProps = {}) {
  const pathname = usePathname();
  const hasHeroOverlay = heroProp ?? pathnameHasHeroOverlay(pathname);
  const docked = useNavbarDocked(hasHeroOverlay);
  const navTheme = useNavbarTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<NavDropdownId | null>(null);
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);

  const resolveHref = useCallback((href: string) => resolveSiteHref(pathname ?? "/", href), [pathname]);

  const controlsLight = mobileOpen ? false : !docked || navTheme === "dark";

  /** Verre flou unique : navbar + sous-menus (jamais fond blanc opaque). */
  const glassSurfaceClass = navGlassSurfaceDocked;

  const shellClass = mobileOpen
    ? navGlassWhite
    : docked
      ? glassSurfaceClass
      : NAV_SHELL_TRANSPARENT;

  const dropdownSurfaceClass = mobileOpen ? navGlassWhite : glassSurfaceClass;

  useEffect(() => {
    setMobileOpen(false);
    setDesktopOpen(null);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setDesktopOpen(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[45] bg-black/20 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 px-2.5 pt-3 transition-[padding] duration-300 sm:px-3.5 lg:px-5 xl:px-5",
          !docked && hasHeroOverlay && "pt-6 sm:pt-7 lg:pt-8",
        )}
      >
        <div className="mx-auto w-full max-w-none">
          <div className={cn("relative overflow-visible rounded-[1.75rem] transition-[background,box-shadow] duration-300", shellClass)}>
            <NavContent
              light={controlsLight}
              dropdownSurfaceClass={dropdownSurfaceClass}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
              desktopOpen={desktopOpen}
              setDesktopOpen={setDesktopOpen}
              onAccountClick={() => setAccountSheetOpen(true)}
            />
          </div>
          <NavMobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
        </div>
      </header>

      <AccountAuthSheet
        open={accountSheetOpen}
        onClose={() => setAccountSheetOpen(false)}
        resolveHref={resolveHref}
      />
    </>
  );
}

/** @deprecated Utiliser `SiteNavbar`. */
export const NavBar = SiteNavbar;
