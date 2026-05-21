"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FaqAccordion } from "@/components/client/faq-accordion";
import { ServiceActionBand } from "@/components/services/service-action-band";
import { RichText } from "@/components/ui/rich-text";
import { ComparisonTable } from "@/components/ui/comparison-table";
import type { ServicePremiumContent } from "@/lib/content/service-premium-types";
import { EXPERTISE_CAROUSEL_IMAGES } from "@/lib/content/services";
import { FAQ_HREF } from "@/lib/content/routes";
import { marketingKickerClass, marketingProseClass, marketingTitleClass } from "@/components/marketing/marketing-styles";
import { cn } from "@/lib/utils";

export function ServicePremiumClient({
  content,
  otherServices,
}: {
  content: ServicePremiumContent;
  otherServices: readonly { name: string; href: string; slug: string }[];
}) {
  const heroImage = EXPERTISE_CAROUSEL_IMAGES[content.slug];

  return (
    <main className="relative z-0 flex-1 bg-[#f2f3f7] pb-10 sm:pb-14">

      {/* Intro + Pourquoi */}
      <Block>
        <div className="mx-auto max-w-3xl text-center">
          {content.hero.intro ? (
            <RichText
              className="text-[15px] leading-relaxed text-neutral-600 sm:text-base"
            >
              {content.hero.intro}
            </RichText>
          ) : null}
          <h2 className={cn("mt-8 text-left sm:text-center", marketingTitleClass, marketingProseClass)}>
            {content.whyImportant.title}
          </h2>
          <div className={cn("mt-5 space-y-3 text-left sm:text-center text-[15px] leading-relaxed", marketingProseClass)}>
            {content.whyImportant.paragraphs.map((p) => (
              <RichText key={p.slice(0, 40)} className="text-[15px] leading-relaxed">
                {p}
              </RichText>
            ))}
          </div>
        </div>
      </Block>

      {/* Solutions + tableau de comparaison */}
      <Block>
        <SectionKicker>{content.solutions.title}</SectionKicker>
        {content.solutions.intro ? (
          <RichText
            className={cn("mx-auto mt-3 max-w-2xl text-center text-[15px] leading-relaxed", marketingProseClass)}
          >
            {content.solutions.intro}
          </RichText>
        ) : null}

        {/* Tableau de comparaison si présent */}
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
              <RichText className="mt-1.5 text-[13px] leading-relaxed text-[#1f2a7c]/60 sm:text-sm">
                {item.description}
              </RichText>
            </li>
          ))}
        </ul>

        {content.forWho.profiles.length > 0 ? (
          <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2 pt-4 border-t border-[#1f2a7c]/08">
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
      </Block>

      {/* Bandeau CTA */}
      <ServiceActionBand
        imageSrc={heroImage}
        title="Passer à l'action avec le cabinet"
        description="Un premier échange pour cadrer votre situation, vos priorités et les prochaines étapes — sans engagement."
      />

      {/* FAQ + Voir aussi */}
      <Block>
        <SectionKicker>Questions fréquentes</SectionKicker>
        <div className="mx-auto mt-8 max-w-3xl">
          <FaqAccordion items={content.faq} />
        </div>

        {otherServices.length > 0 ? (
          <div className="mx-auto mt-10 max-w-3xl border-t border-[#1f2a7c]/10 pt-8">
            <p className={cn("text-center", marketingKickerClass)}>Voir aussi</p>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {otherServices.slice(0, 4).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={service.href}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-[#1f2a7c]/10 bg-white px-4 py-3 text-[14px] font-medium text-[#1f2a7c] transition-colors hover:border-[#1f2a7c]/25"
                  >
                    {service.name}
                    <ArrowUpRight className="size-4 shrink-0 text-[#1f2a7c]/30 transition-transform group-hover:translate-x-0.5 group-hover:text-[#1f2a7c]/55" aria-hidden />
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
            <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </Link>
        </div>
      </Block>
    </main>
  );
}

function Block({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-2.5 mt-3 bg-white lg:mx-4 lg:mt-4">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">{children}</div>
    </div>
  );
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className={cn("text-center", marketingTitleClass, marketingProseClass)}>{children}</p>
  );
}
