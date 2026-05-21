import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { FaqAccordion, type FaqItem } from "@/components/client/faq-accordion";
import {
  MarketingHeading,
  MarketingHighlight,
  MarketingLead,
  MarketingPageStack,
  MarketingSection,
} from "@/components/marketing/marketing-section";
import { marketingCardClass, marketingPageShellClass } from "@/components/marketing/marketing-styles";
import { CtaPrimaryLink, heroCtaRowClassName } from "@/components/ui/cta-link";
import { ContactGlassLink } from "@/components/ui/contact-glass-link";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { CONTACT_HREF, ROUTES } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

type BilanPatrimonialPageProps = {
  faq: readonly FaqItem[];
};

const ANALYZE_ITEMS = [
  "Situation familiale",
  "Revenus",
  "Épargne",
  "Placements",
  "Immobilier",
  "Fiscalité",
  "Retraite",
  "Prévoyance",
  "Transmission",
] as const;

const STEPS = [
  { t: "Pré-bilan", d: "Formulaire ou échange initial pour préparer le rendez-vous." },
  { t: "Rendez-vous", d: "Entretien confidentiel à Perpignan ou à distance." },
  { t: "Analyse", d: "Étude de votre situation et comparaison des options pertinentes." },
  { t: "Recommandations", d: "Restitution personnalisée et pédagogique." },
  { t: "Mise en place", d: "Si accord, accompagnement dans la contractualisation et le suivi." },
] as const;

export function BilanPatrimonialPage({ faq }: BilanPatrimonialPageProps) {
  return (
    <MarketingSubpage
      hideBilanCta
      hero={PAGE_HEROES.bilanPatrimonial}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Bilan patrimonial" },
      ]}
    >
      <MarketingPageStack className={marketingPageShellClass}>
        <MarketingSection labelledBy="why-bilan-title">
          <MarketingHeading
            titleId="why-bilan-title"
            kicker="Pourquoi"
            title={
              <>
                Pourquoi réaliser un <MarketingHighlight>bilan patrimonial</MarketingHighlight> ?
              </>
            }
          />
          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-center">
            <MarketingLead className="mt-0">
              Parce qu’il est difficile d’avoir une vision d’ensemble lorsque les décisions se prennent au fil du
              temps.
            </MarketingLead>
            <MarketingLead className="mt-0">
              Le bilan permet d’identifier les priorités et les pistes d’optimisation — toujours selon votre profil,
              sans promesse de rendement garanti.
            </MarketingLead>
          </div>
        </MarketingSection>

        <MarketingSection labelledBy="what-we-analyze-title">
          <MarketingHeading titleId="what-we-analyze-title" kicker="Analyse" title="Ce que nous analysons" />
          <ul className="mx-auto mt-8 grid max-w-2xl gap-2 sm:grid-cols-2">
            {ANALYZE_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[#1f2a7c]/85">
                <span aria-hidden className="size-1.5 rounded-full bg-[#1f2a7c]" />
                {item}
              </li>
            ))}
          </ul>
        </MarketingSection>

        <MarketingSection labelledBy="how-it-works-title">
          <MarketingHeading titleId="how-it-works-title" kicker="Déroulement" title="Comment ça se déroule ?" />
          <ol className="mx-auto mt-10 max-w-2xl space-y-3">
            {STEPS.map((step, i) => (
              <li key={step.t} className={cn(marketingCardClass, "flex gap-4 p-5")}>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#1f2a7c] text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-[#1f2a7c]">{step.t}</h3>
                  <p className="mt-1 text-sm text-[#1f2a7c]/70">{step.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </MarketingSection>

        <MarketingSection variant="flush" className="mx-2.5 lg:mx-4">
          <div className="overflow-hidden rounded-[1.75rem] border border-[#1f2a7c]/15 bg-[#1f2a7c] px-6 py-12 text-center text-white sm:px-10 lg:rounded-[2rem]">
            <h2 className="text-2xl font-semibold">Commencer mon pré-bilan</h2>
            <p className="mx-auto mt-3 max-w-lg text-white/85">
              Accédez au formulaire en ligne pour préparer votre rendez-vous avec le cabinet.
            </p>
            <div className={cn("mt-8 flex flex-wrap justify-center gap-3", heroCtaRowClassName)}>
              <CtaPrimaryLink
                href={ROUTES.simulateur}
                className="group border-white/20 bg-white text-[#1f2a7c] hover:bg-white/95"
              >
                Commencer mon pré-bilan
                <ArrowUpRight aria-hidden className="size-4 shrink-0" />
              </CtaPrimaryLink>
              <ContactGlassLink href={CONTACT_HREF} light>
                Prendre rendez-vous
              </ContactGlassLink>
            </div>
          </div>
        </MarketingSection>

        {faq.length > 0 ? (
          <MarketingSection labelledBy="bilan-faq-title">
            <MarketingHeading titleId="bilan-faq-title" kicker="FAQ" title="Questions fréquentes" />
            <div className="mx-auto mt-10 max-w-3xl">
              <FaqAccordion items={faq} />
            </div>
          </MarketingSection>
        ) : null}
      </MarketingPageStack>
    </MarketingSubpage>
  );
}
