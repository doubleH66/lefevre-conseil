import { CtaBand } from "@/components/landing/cta-band";
import { BILAN_CTA_BACKGROUND_IMAGE } from "@/lib/content/services";

const sectionClassName = "mx-2.5 mb-12 mt-6 lg:mx-4 lg:mb-16";

/**
 * Bandeau bilan unique (titre, CTA, derniers conseils) - utilisé sur l’accueil et dans `SubpageShell`.
 */
export function BilanCtaSection({ className }: { className?: string }) {
  return (
    <section className={className ?? sectionClassName}>
      <CtaBand
        eyebrow={false}
        backgroundImage
        backgroundImageSrc={BILAN_CTA_BACKGROUND_IMAGE}
        deepBlackOverlay
        heroTypography
        primaryWithSimulationArrow
        primaryLabel="Réaliser mon bilan patrimonial"
        secondaryLabel="Contact"
        latestAdviceTeaser
        title="Bilan patrimonial, sans engagement."
        description="Quelques questions pour une synthèse claire et des pistes adaptées - gratuit, sans engagement."
      />
    </section>
  );
}
