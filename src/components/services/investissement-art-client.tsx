"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FaqAccordion } from "@/components/client/faq-accordion";
import { InvestissementArtSections } from "@/components/services/investissement-art-sections";
import { ServiceActionBand } from "@/components/services/service-action-band";
import { ServiceRichText } from "@/components/services/service-rich-text";
import type { ServicePremiumContent } from "@/lib/content/service-premium-types";
import { ART_CONTACT_SUBJECT } from "@/lib/content/investissement-art-content";
import { EXPERTISE_CAROUSEL_IMAGES } from "@/lib/content/services";
import { CONTACT_HREF, FAQ_HREF } from "@/lib/content/routes";
import { marketingProseClass, marketingTitleClass } from "@/components/marketing/marketing-styles";
import { cn } from "@/lib/utils";

const artContactHref = `${CONTACT_HREF}?objet=${encodeURIComponent(ART_CONTACT_SUBJECT)}`;

export function InvestissementArtClient({
  content,
  otherServices,
}: {
  content: ServicePremiumContent;
  otherServices: readonly { name: string; href: string; slug: string }[];
}) {
  const heroImage = EXPERTISE_CAROUSEL_IMAGES[content.slug];

  return (
    <main className="relative z-0 flex-1 bg-[#f2f3f7] pb-10 sm:pb-14">
      <IntroBlock content={content} />

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
        <p className={cn("text-center", marketingTitleClass, marketingProseClass)}>Questions fréquentes</p>
        <div className="mx-auto mt-8 max-w-3xl">
          <FaqAccordion items={content.faq} questionEmphasis="highlight" />
        </div>

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

        <div className="mt-8 flex justify-center">
          <Link
            href={FAQ_HREF}
            className="group inline-flex items-center gap-2 rounded-full border border-[#1f2a7c]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1f2a7c] shadow-sm transition-colors hover:bg-[#1f2a7c]/[0.04]"
          >
            Toute la FAQ
            <ArrowUpRight
              className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </Block>
    </main>
  );
}

function IntroBlock({ content }: { content: ServicePremiumContent }) {
  return (
    <Block>
      <div className="mx-auto max-w-3xl text-center">
        {content.hero.intro ? (
          <ServiceRichText className="text-[15px] leading-relaxed text-neutral-600 sm:text-base">
            {content.hero.intro}
          </ServiceRichText>
        ) : null}
        <h2 className={cn("mt-8 text-left sm:text-center", marketingTitleClass, marketingProseClass)}>
          <ServiceRichText as="span">{content.whyImportant.title}</ServiceRichText>
        </h2>
        <div className={cn("mt-5 space-y-3 text-left sm:text-center text-[15px] leading-relaxed", marketingProseClass)}>
          {content.whyImportant.paragraphs.map((p) => (
            <ServiceRichText key={p.slice(0, 40)} className="text-[15px] leading-relaxed">
              {p}
            </ServiceRichText>
          ))}
        </div>
      </div>
    </Block>
  );
}

function Block({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-2.5 mt-3 bg-white lg:mx-4 lg:mt-4">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">{children}</div>
    </div>
  );
}
