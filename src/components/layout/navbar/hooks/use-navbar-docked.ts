"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DOCK_SCROLL_Y = 96;
const UNDOCK_SCROLL_Y = 32;

/**
 * `true` quand la barre doit être en mode « docké » (fond verre, fixed sticky).
 * Sur les pages sans hero overlay, docké dès le chargement.
 */
export function useNavbarDocked(hasHeroOverlay: boolean) {
  const pathname = usePathname();
  const [docked, setDocked] = useState(!hasHeroOverlay);

  useEffect(() => {
    setDocked(!hasHeroOverlay);

    const update = () => {
      const y = window.scrollY || 0;
      if (!hasHeroOverlay) {
        setDocked(true);
        return;
      }
      setDocked((current) => {
        if (!current && y > DOCK_SCROLL_Y) return true;
        if (current && y < UNDOCK_SCROLL_Y) return false;
        return current;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname, hasHeroOverlay]);

  return docked;
}
