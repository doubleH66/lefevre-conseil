"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type NavbarTheme = "dark" | "light";

const SAMPLE_Y = 84;

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
        const sections = Array.from(document.querySelectorAll("[data-nav-theme]"));

        const active = sections.find((section) => {
          const rect = section.getBoundingClientRect();
          return (
            rect.top <= SAMPLE_Y &&
            rect.bottom >= SAMPLE_Y &&
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
