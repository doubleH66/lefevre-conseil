import { BilanCtaSection } from "@/components/landing/bilan-cta-section";
import { LatestConseilsSection } from "@/components/landing/latest-conseils-section";
import { CabinetIntro } from "@/components/landing/cabinet-intro";
import ExpertisesCarousel from "@/components/client/expertises-carousel";
import { HeroSection } from "@/components/landing/hero-section";
import { PartnersStrip } from "@/components/landing/partners-strip";
import { TestimonialsSection } from "@/components/client/testimonials-section";
import { SiteFooter } from "@/components/layout/site-footer";

/** Page d’accueil — Server Component (îlots client uniquement pour carousel + témoignages). */
export function LandingPage() {
  return (
    <main className="min-h-dvh overflow-x-clip bg-white text-neutral-950">
        <div data-nav-theme="dark">
          <HeroSection />
        </div>

        <section
          id="apres-hero"
          data-nav-theme="light"
          className="relative z-0 pb-8 pt-0 sm:pb-10"
        >
          <PartnersStrip layout="hero" />
          <CabinetIntro />
          <ExpertisesCarousel />
        </section>

        <div data-nav-theme="light">
          <TestimonialsSection />
        </div>
        <div data-nav-theme="dark">
          <BilanCtaSection />
        </div>
        <div data-nav-theme="light">
          <LatestConseilsSection />
        </div>
        <div data-nav-theme="dark">
          <SiteFooter />
        </div>
    </main>
  );
}
