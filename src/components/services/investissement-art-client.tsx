"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ShortFaqSection } from "@/components/client/short-faq-section";
import { InvestissementArtSections } from "@/components/services/investissement-art-sections";
import { ServiceActionBand } from "@/components/services/service-action-band";
import { ServiceIntroSection } from "@/components/services/service-intro-section";
import type { ServicePremiumContent } from "@/lib/content/service-premium-types";
import { ART_CONTACT_SUBJECT } from "@/lib/content/investissement-art-content";
import { EXPERTISE_CAROUSEL_IMAGES } from "@/lib/content/services";
import { CONTACT_HREF } from "@/lib/content/routes";
import { SITE_BLOCK_INNER, SITE_WHITE_BLOCK } from "@/lib/content/landing-layout";

const artContactHref = `${CONTACT_HREF}?objet=${encodeURIComponent(ART_CONTACT_SUBJECT)}`;

export function InvestissementArtClient({
  content,
  otherServices,
  imageAlt,
}: {
  content: ServicePremiumContent;
  otherServices: readonly { name: string; href: string; slug: string }[];
  imageAlt: string;
}) {
  const heroImage = EXPERTISE_CAROUSEL_IMAGES[content.slug];

  return (
    <main className="relative z-0 flex-1 bg-[#f2f3f7] pb-4 sm:pb-6">
      <Block>
        <ServiceIntroSection content={content} imageSrc={heroImage} imageAlt={imageAlt} />
      </Block>

      <InvestissementArtSections />

      <ServiceActionBand
        imageSrc={heroImage}
        title="Découvrez comment investir dans l'art"
        description="Réservez un rendez-vous avec le cabinet : sélection d'œuvres, montage du contrat et étude du cadre fiscal avec vos conseils habituels."
        primaryHref={artContactHref}
        primaryLabel="Réservez votre rendez-vous"
        secondaryHref={artContactHref}
        secondaryLabel="Je suis intéressé(e)"
      />

      <Block>
        <ShortFaqSection items={content.faq} contentClassName="max-w-3xl" />

        {otherServices.length > 0 ? (
          <div className="mx-auto mt-10 max-w-3xl border-t border-[#1f2a7c]/10 pt-8">
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {otherServices.slice(0, 4).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={service.href}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-[#1f2a7c]/10 bg-white px-4 py-3 text-[14px] font-medium text-[#1f2a7c] transition-colors hover:border-[#1f2a7c]/25"
                  >
                    {service.name}
                    <ArrowUpRight
                      className="size-4 shrink-0 text-[#1f2a7c]/30 transition-transform group-hover:translate-x-0.5 group-hover:text-[#1f2a7c]/55"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Block>
    </main>
  );
}

function Block({ children }: { children: React.ReactNode }) {
  return (
    <div className={SITE_WHITE_BLOCK}>
      <div className={SITE_BLOCK_INNER}>{children}</div>
    </div>
  );
}
