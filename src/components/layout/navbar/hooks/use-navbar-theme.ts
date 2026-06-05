"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_NAV_BAR_HEIGHT } from "@/lib/nav-styles";

export type NavbarTheme = "dark" | "light";

function readSampleY() {
  if (typeof document === "undefined") return 84;

  const root = document.documentElement;
  const navOffset = parseFloat(root.style.getPropertyValue("--site-nav-offset") || "0");
  const cssNavOffset = parseFloat(getComputedStyle(root).getPropertyValue("--site-nav-offset") || "0");
  const offset = navOffset || cssNavOffset || 0;
  // Centre vertical de la pilule nav (pt-2 ≈ 8px sous le bandeau).
  return offset + 8 + SITE_NAV_BAR_HEIGHT / 2;
}

/** Détecte la zone sous la navbar via `[data-nav-theme]` sur les sections. */
export function useNavbarTheme() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<NavbarTheme>("dark");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const sampleX = window.innerWidth / 2;
        const sampleY = readSampleY();
        const sections = Array.from(document.querySelectorAll("[data-nav-theme]"));

        const active = sections.find((section) => {
          const rect = section.getBoundingClientRect();
          return (
            rect.top <= sampleY &&
            rect.bottom >= sampleY &&
            rect.left <= sampleX &&
            rect.right >= sampleX
          );
        });

        const next: NavbarTheme =
          active?.getAttribute("data-nav-theme") === "dark" ? "dark" : "light";
        setTheme((current) => (current === next ? current : next));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return theme;
}
