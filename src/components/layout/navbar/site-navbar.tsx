"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { AccountAuthSheet } from "@/components/nav/account-auth-sheet";
import { NavContent } from "@/components/layout/navbar/nav-content";
import type { NavDropdownId } from "@/lib/content/navigation";
import { usePremiumScroll } from "@/components/layout/premium-scroll-provider";
import { SitePromoBar } from "@/components/layout/site-promo-bar";
import { resolveSiteHref } from "@/lib/resolve-site-href";
import { useNavbarTheme } from "@/components/layout/navbar/hooks/use-navbar-theme";
import { NavMobileMenu } from "@/components/layout/navbar/nav-mobile-menu";
import { NAV_SHELL_MENU, SITE_PROMO_BAR_HEIGHT } from "@/lib/nav-styles";
import {
  navGlassDropdownPanelDark,
  navGlassSurfaceDocked,
  navGlassWhite,
} from "@/components/layout/navbar/styles";
import { cn } from "@/lib/utils";

/**
 * Navbar + bandeau promo (effet Hey Aurenis) :
 * bandeau fixe en haut, navbar transparente puis verre au scroll sur les pages hero.
 */
export function SiteNavbar() {
  const pathname = usePathname();
  const { enabled, promoHide, navDock, navShellBackground, navShellBlur, navShellShadow } =
    usePremiumScroll();
  const navTheme = useNavbarTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<NavDropdownId | null>(null);
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);
  const [glassShell, setGlassShell] = useState(!enabled);

  const headerTop = useTransform(promoHide, [0, 1], [SITE_PROMO_BAR_HEIGHT, 0]);

  useMotionValueEvent(navDock, "change", (progress) => {
    setGlassShell(progress > 0.18);
  });

  useEffect(() => {
    setGlassShell(!enabled);
  }, [enabled, pathname]);

  const resolveHref = useCallback((href: string) => resolveSiteHref(pathname ?? "/", href), [pathname]);

  const openAccountSheet = useCallback(() => {
    setAccountSheetOpen(true);
    setMobileOpen(false);
    setDesktopOpen(null);
  }, []);

  const controlsLight = mobileOpen ? false : navTheme === "dark";

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  /** Panneaux portail (sous-menus + menu compte) — fond opaque, adapté au scroll / thème. */
  const dropdownSurfaceClass =
    mobileOpen || !controlsLight ? navGlassWhite : navGlassDropdownPanelDark;

  useEffect(() => {
    setMobileOpen(false);
    setDesktopOpen(null);
    setAccountSheetOpen(false);
    setAccountMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setDesktopOpen(null);
        setAccountMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (desktopOpen) setAccountMenuOpen(false);
  }, [desktopOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <SitePromoBar enabled={enabled} promoHide={promoHide} />

      {mobileOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[45] bg-black/20 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <motion.header
        className={cn(
          "site-chrome-header fixed inset-x-0 z-50 px-2.5 sm:px-3.5 lg:px-5 xl:px-5",
          enabled ? "pt-2" : "top-0 pt-3",
        )}
        style={enabled ? { top: headerTop } : undefined}
      >
        <div className="site-chrome-method-shift">
        <div className="mx-auto w-full max-w-none">
          <motion.div
            className={cn(
              "relative overflow-visible rounded-[1.75rem] transition-[background,box-shadow] duration-300 will-change-[transform,box-shadow,background-color]",
              mobileOpen && NAV_SHELL_MENU,
              !mobileOpen && !enabled && navGlassSurfaceDocked,
            )}
            style={
              mobileOpen
                ? undefined
                : enabled
                  ? {
                      backgroundColor: navShellBackground,
                      backdropFilter: navShellBlur,
                      WebkitBackdropFilter: navShellBlur,
                      boxShadow: navShellShadow,
                    }
                  : undefined
            }
          >
            <NavContent
              light={controlsLight}
              dropdownSurfaceClass={dropdownSurfaceClass}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
              desktopOpen={desktopOpen}
              setDesktopOpen={setDesktopOpen}
              onLoginClick={openAccountSheet}
              onAccountMenuOpenChange={setAccountMenuOpen}
            />
          </motion.div>
          <NavMobileMenu
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            onLoginClick={openAccountSheet}
            surfaceClass={dropdownSurfaceClass}
          />
        </div>
        </div>
      </motion.header>

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
