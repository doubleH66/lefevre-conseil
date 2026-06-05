import { HeroSection } from "@/components/landing/hero-section";
import { PartnersStrip } from "@/components/landing/partners-strip";
import { LANDING_HERO_SHELL_CLASS } from "@/lib/content/hero-shell";

/**
 * Bloc hero accueil : image + bandeau partenaires dans un même shell arrondi.
 */
export function LandingHeroBlock() {
  return (
    <div className={LANDING_HERO_SHELL_CLASS} data-nav-theme="dark">
      <HeroSection />
      <PartnersStrip layout="hero" />
    </div>
  );
}
