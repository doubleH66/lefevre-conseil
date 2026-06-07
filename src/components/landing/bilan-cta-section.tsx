import { CtaBand } from "@/components/landing/cta-band";
import { LANDING_CTA_SECTION_CLASS } from "@/lib/content/landing-layout";
import { BILAN_CTA_BACKGROUND_IMAGE } from "@/lib/content/services";
import { CONTACT_HREF } from "@/lib/content/routes";

export const bilanCtaSectionClassName = LANDING_CTA_SECTION_CLASS;

/**
 * Bandeau CTA final avant le footer - utilisé sur l’accueil et dans `SubpageShell`.
 */
export function BilanCtaSection({ className }: { className?: string }) {
  return (
    <section data-nav-theme="dark" className={className ?? bilanCtaSectionClassName}>
      <CtaBand
        eyebrow={false}
        backgroundImage
        backgroundImageSrc={BILAN_CTA_BACKGROUND_IMAGE}
        deepBlackOverlay
        centered
        showSecondaryCta={false}
        primaryLabel="Prendre rendez-vous"
        primaryHref={CONTACT_HREF}
        title="Faisons le point sur votre situation patrimoniale."
        description="Un premier échange pour comprendre vos objectifs et vous orienter vers les solutions adaptées."
      />
    </section>
  );
}
