"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  type MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { pathnameHasHeroOverlay } from "@/lib/content/navigation";
import { SITE_NAV_BAR_HEIGHT, SITE_PROMO_BAR_HEIGHT, readPromoBarHeight } from "@/lib/nav-styles";
import { SCROLL_RANGES, mix, scrollProgress } from "@/lib/scroll-motion";

type PremiumScrollContextValue = {
  enabled: boolean;
  promoHide: MotionValue<number>;
  navDock: MotionValue<number>;
  navShellBackground: MotionValue<string>;
  navShellBlur: MotionValue<string>;
  navShellShadow: MotionValue<string>;
};

const PremiumScrollContext = createContext<PremiumScrollContextValue | null>(null);

export function usePremiumScroll() {
  const context = useContext(PremiumScrollContext);
  if (!context) {
    throw new Error("usePremiumScroll must be used within PremiumScrollProvider");
  }
  return context;
}

export function PremiumScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const enabled = pathnameHasHeroOverlay(pathname);
  const { scrollY } = useScroll();

  // Position bandeau / navbar : suit le scroll immédiatement (sans ressort) pour une remontée rapide.
  const promoHide = useTransform(scrollY, (y) => {
    if (!enabled) return 1;
    return scrollProgress(y, SCROLL_RANGES.promo);
  });

  const navDock = useTransform(scrollY, (y) => {
    if (!enabled) return 1;
    return scrollProgress(y, SCROLL_RANGES.navDock);
  });

  const navShellBackground = useTransform(navDock, (progress) => {
    if (progress <= 0.01) return "transparent";
    const alpha = mix(0, 0.22, progress);
    return `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
  });

  const navShellBlur = useTransform(navDock, (progress) => {
    if (progress <= 0.01) return "none";
    const blur = mix(8, 28, progress);
    return `blur(${blur.toFixed(1)}px) saturate(150%)`;
  });

  const navShellShadow = useTransform(navDock, (progress) => {
    if (progress < 0.04) return "none";
    const alpha = mix(0.04, 0.18, progress);
    const spread = mix(4, 28, progress);
    return `0 ${mix(3, 10, progress).toFixed(1)}px ${spread.toFixed(1)}px rgba(15, 23, 42, ${alpha.toFixed(3)})`;
  });

  useMotionValueEvent(promoHide, "change", (progress) => {
    const promoTotal = readPromoBarHeight();
    const promoHeight = (1 - progress) * promoTotal;
    const headerTop = promoHeight > 2 ? promoHeight : 0;
    document.documentElement.style.setProperty("--promo-hide-progress", progress.toFixed(4));
    document.documentElement.style.setProperty("--site-promo-height", `${promoHeight.toFixed(2)}px`);
    document.documentElement.style.setProperty("--site-nav-offset", `${headerTop.toFixed(2)}px`);
    document.documentElement.style.setProperty(
      "--site-nav-total",
      `${(headerTop + SITE_NAV_BAR_HEIGHT).toFixed(2)}px`,
    );
  });

  useMotionValueEvent(navDock, "change", (progress) => {
    document.documentElement.style.setProperty("--nav-dock-progress", progress.toFixed(4));
  });

  useEffect(() => {
    if (!enabled) {
      document.documentElement.style.setProperty("--promo-hide-progress", "1");
      document.documentElement.style.setProperty("--site-promo-height", "0px");
      document.documentElement.style.setProperty("--site-nav-offset", "12px");
      document.documentElement.style.setProperty(
        "--site-nav-total",
        `${(12 + SITE_NAV_BAR_HEIGHT).toFixed(2)}px`,
      );
      document.documentElement.style.setProperty("--nav-dock-progress", "1");
      return;
    }

    const syncPromoChrome = () => {
      const promoTotal = readPromoBarHeight();
      document.documentElement.style.setProperty("--promo-hide-progress", "0");
      document.documentElement.style.setProperty("--site-promo-height", `${promoTotal.toFixed(2)}px`);
      document.documentElement.style.setProperty("--site-nav-offset", `${promoTotal.toFixed(2)}px`);
      document.documentElement.style.setProperty(
        "--site-nav-total",
        `${(promoTotal + SITE_NAV_BAR_HEIGHT).toFixed(2)}px`,
      );
      document.documentElement.style.setProperty("--nav-dock-progress", "0");
    };

    syncPromoChrome();
    window.addEventListener("resize", syncPromoChrome);
    return () => window.removeEventListener("resize", syncPromoChrome);
  }, [enabled, pathname]);

  const value = useMemo(
    () => ({
      enabled,
      promoHide,
      navDock,
      navShellBackground,
      navShellBlur,
      navShellShadow,
    }),
    [enabled, promoHide, navDock, navShellBackground, navShellBlur, navShellShadow],
  );

  return <PremiumScrollContext.Provider value={value}>{children}</PremiumScrollContext.Provider>;
}
