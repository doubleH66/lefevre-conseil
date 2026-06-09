"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ShortFaqSection } from "@/components/client/short-faq-section";
import { ServiceActionBand } from "@/components/services/service-action-band";
import { ServiceLuxembourgContractSection } from "@/components/services/service-luxembourg-contract-section";
import { ServiceComparateurBlock } from "@/components/services/service-comparateur-block";
import { ServiceIntroSection } from "@/components/services/service-intro-section";
import { ServiceRichText } from "@/components/services/service-rich-text";
import { BeforeAfterTable } from "@/components/ui/before-after-table";
import { ComparisonTable } from "@/components/ui/comparison-table";
import type { ServicePremiumContent } from "@/lib/content/service-premium-types";
import { EXPERTISE_CAROUSEL_IMAGES, serviceDetailHref } from "@/lib/content/services";
import {
  marketingProseClass,
  marketingTitleClass,
} from "@/components/marketing/marketing-styles";
import { SITE_BLOCK_INNER, SITE_WHITE_BLOCK } from "@/lib/content/landing-layout";
import { cn } from "@/lib/utils";

export function ServicePremiumClient({
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

      {content.beforeAfter ? (
        <Block>
          <BeforeAfterTable data={content.beforeAfter} />
        </Block>
      ) : null}

      <Block>
        <SectionKicker>
          <ServiceRichText as="span">{content.solutions.title}</ServiceRichText>
        </SectionKicker>
        {content.solutions.intro ? (
          <ServiceRichText
            className={cn("mx-auto mt-3 max-w-2xl text-center text-[15px] leading-relaxed", marketingProseClass)}
          >
            {content.solutions.intro}
          </ServiceRichText>
        ) : null}

        {content.comparison ? (
          <div className="mt-8">
            <ComparisonTable data={content.comparison} />
          </div>
        ) : null}

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {content.solutions.items.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-[#1f2a7c]/10 bg-white px-5 py-4 text-left shadow-sm"
            >
              <p className="text-[14px] font-semibold text-[#1f2a7c] sm:text-[15px]">{item.title}</p>
              <ServiceRichText className="mt-1.5 text-[13px] leading-relaxed text-[#1f2a7c]/60 sm:text-sm">
                {item.description}
              </ServiceRichText>
            </li>
          ))}
        </ul>

        {content.forWho.profiles.length > 0 ? (
          <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2 border-t border-[#1f2a7c]/08 pt-4">
            {content.forWho.profiles.map((profile) => (
              <li
                key={profile}
                className="rounded-full border border-[#1f2a7c]/12 bg-white px-3.5 py-1.5 text-sm font-medium text-[#1f2a7c]/80 shadow-sm"
              >
                {profile}
              </li>
            ))}
          </ul>
        ) : null}

        {content.slug === "prevoyance-sante-assurance-pret" ? (
          <ServiceComparateurBlock sourcePage={serviceDetailHref(content.slug)} />
        ) : null}
      </Block>

      {content.slug === "placements-epargne" ? (
        <Block>
          <ServiceLuxembourgContractSection />
        </Block>
      ) : null}

      <ServiceActionBand
        imageSrc={heroImage}
        title="Passer à l'action avec le cabinet"
        description="Un premier échange pour cadrer votre situation, vos priorités et les prochaines étapes --- sans engagement."
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

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className={cn("text-center", marketingTitleClass, marketingProseClass)}>{children}</p>
  );
}
