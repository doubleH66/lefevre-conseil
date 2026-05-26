import type { ReactNode } from "react";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import {
  MarketingHeading,
  MarketingPageStack,
  MarketingSection,
} from "@/components/marketing/marketing-section";
import { marketingCardClass, marketingPageShellClass } from "@/components/marketing/marketing-styles";
import type { PageHeroConfig } from "@/lib/content/page-heroes";
import { cn } from "@/lib/utils";

const INLINE_LINK_REGEX =
  /(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

function renderLegalInline(text: string): React.ReactNode {
  const parts = text.split(INLINE_LINK_REGEX);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const href = part.replace(/[.,;:!?)]+$/, "");
      const trailing = part.slice(href.length);
      return (
        <span key={i}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#1f2a7c] underline-offset-2 hover:underline"
          >
            {href}
          </a>
          {trailing}
        </span>
      );
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(part)) {
      return (
        <a
          key={i}
          href={`mailto:${part}`}
          className="font-medium text-[#1f2a7c] underline-offset-2 hover:underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export type LegalSection = {
  title: string;
  body?: string[];
  items?: string[];
  subsections?: { title: string; body: string[] }[];
};

type LegalPageProps = {
  hero: PageHeroConfig;
  breadcrumbLabel: string;
  updatedAt: string;
  sections: LegalSection[];
  intro?: ReactNode;
};

function LegalSectionCard({ section }: { section: LegalSection }) {
  return (
    <div className={cn(marketingCardClass, "mt-6 space-y-4 p-5 sm:p-6")}>
      {section.body?.map((paragraph) => (
        <p key={paragraph} className="text-sm leading-relaxed text-[#1f2a7c]/78">
          {renderLegalInline(paragraph)}
        </p>
      ))}
      {section.items && section.items.length > 0 ? (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#1f2a7c]/78">
          {section.items.map((item) => (
            <li key={item}>{renderLegalInline(item)}</li>
          ))}
        </ul>
      ) : null}
      {section.subsections?.map((sub) => (
        <div key={sub.title} className="border-t border-[#1f2a7c]/8 pt-4 first:border-0 first:pt-0">
          <h3 className="text-sm font-semibold text-[#1f2a7c]">{sub.title}</h3>
          <div className="mt-2 space-y-2">
            {sub.body.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-[#1f2a7c]/78">
                {renderLegalInline(paragraph)}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LegalPage({ hero, breadcrumbLabel, updatedAt, sections, intro }: LegalPageProps) {
  return (
    <MarketingSubpage
      hero={hero}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: breadcrumbLabel },
      ]}
    >
      <MarketingPageStack className={marketingPageShellClass}>
        <MarketingSection labelledBy="legal-updated">
          <p className="text-center text-xs text-[#1f2a7c]/55">Dernière mise à jour : {updatedAt}</p>
          {intro ? (
            <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-[#1f2a7c]/70">
              {intro}
            </p>
          ) : null}
        </MarketingSection>
        {sections.map((section, index) => (
          <MarketingSection key={section.title} labelledBy={`legal-section-${index}`}>
            <MarketingHeading titleId={`legal-section-${index}`} title={section.title} align="left" />
            <LegalSectionCard section={section} />
          </MarketingSection>
        ))}
      </MarketingPageStack>
    </MarketingSubpage>
  );
}
