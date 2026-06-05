import { BilanCtaSection } from "@/components/landing/bilan-cta-section";
import { LatestConseilsSection } from "@/components/landing/latest-conseils-section";
import { CabinetIntro } from "@/components/landing/cabinet-intro";
import { HomeFaqSection } from "@/components/landing/home-faq-section";
import { LandingHeroBlock } from "@/components/landing/landing-hero-block";
import { MethodScrollStack } from "@/components/landing/method-scroll-stack";
import ExpertisesCarousel from "@/components/client/expertises-carousel";
import { TestimonialsSection } from "@/components/client/testimonials-section";
import { SiteFooter } from "@/components/layout/site-footer";

/**
 * Page d’accueil — chaque bloc gère son layout via `landing-layout.ts`.
 * Ordre : hero → cabinet → méthode → expertises → avis → FAQ → CTA → conseils → footer.
 */
export function LandingPage() {
  return (
    <main className="min-h-dvh overflow-x-clip bg-white text-neutral-950">
      <LandingHeroBlock />
      <CabinetIntro />
      <MethodScrollStack />
      <ExpertisesCarousel />
      <TestimonialsSection />
      <HomeFaqSection />
      <BilanCtaSection />
      <LatestConseilsSection />
      <div data-nav-theme="light">
        <SiteFooter />
      </div>
    </main>
  );
}
