import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import {
  MarketingHeading,
  MarketingPageStack,
  MarketingSection,
} from "@/components/marketing/marketing-section";
import { marketingCardClass, marketingPageShellClass } from "@/components/marketing/marketing-styles";
import type { PageHeroConfig } from "@/lib/content/page-heroes";
import { cn } from "@/lib/utils";

/** Remplace les e-mails bruts par des liens mailto pour éviter le scraping. */
function renderLegalBody(text: string): React.ReactNode {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const parts = text.split(emailRegex);
  return parts.map((part, i) =>
    emailRegex.test(part) ? (
      <a
        key={i}
        href={`mailto:${part}`}
        className="font-medium text-[#1f2a7c] underline-offset-2 hover:underline"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

type LegalSection = {
  title: string;
  body: string[];
};

type LegalPageProps = {
  hero: PageHeroConfig;
  breadcrumbLabel: string;
  updatedAt: string;
  sections: LegalSection[];
};

export function LegalPage({ hero, breadcrumbLabel, updatedAt, sections }: LegalPageProps) {
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
        </MarketingSection>
        {sections.map((section, index) => (
          <MarketingSection key={section.title} labelledBy={`legal-section-${index}`}>
            <MarketingHeading titleId={`legal-section-${index}`} title={section.title} align="left" />
            <div className={cn(marketingCardClass, "mt-6 space-y-3 p-5 sm:p-6")}>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-[#1f2a7c]/78">
                  {renderLegalBody(paragraph)}
                </p>
              ))}
            </div>
          </MarketingSection>
        ))}
      </MarketingPageStack>
    </MarketingSubpage>
  );
}
