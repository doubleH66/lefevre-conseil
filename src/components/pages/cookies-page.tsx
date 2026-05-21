import Link from "next/link";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import {
  MarketingHeading,
  MarketingPageStack,
  MarketingSection,
} from "@/components/marketing/marketing-section";
import { marketingCardClass, marketingPageShellClass } from "@/components/marketing/marketing-styles";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { ROUTES } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

const sections = [
  {
    title: "Cookies techniques",
    body: "Indispensables au fonctionnement du site (session, préférences d’affichage, sécurité).",
  },
  {
    title: "Mesure d’audience",
    body: "Statistiques anonymisées pour améliorer les parcours, uniquement avec votre accord via le bandeau cookies.",
  },
  {
    title: "Vos choix",
    body: "Vous pouvez modifier vos préférences à tout moment depuis le bandeau ou en nous contactant.",
  },
] as const;

export function CookiesPage() {
  return (
    <MarketingSubpage
      hero={PAGE_HEROES.cookies}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Cookies" },
      ]}
    >
      <MarketingPageStack className={marketingPageShellClass}>
        <MarketingSection labelledBy="cookies-body-title">
          <MarketingHeading titleId="cookies-body-title" title="Gestion des traceurs" />
          <div className="mt-8 grid gap-3">
            {sections.map((section) => (
              <article key={section.title} className={cn(marketingCardClass, "p-5 sm:p-6")}>
                <h3 className="font-semibold text-[#1f2a7c]">{section.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1f2a7c]/75">{section.body}</p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[#1f2a7c]/65">
            Politique détaillée :{" "}
            <Link href={ROUTES.confidentialite} className="font-semibold underline-offset-2 hover:underline">
              confidentialité
            </Link>
            {" · "}
            <Link href={ROUTES.contact} className="font-semibold underline-offset-2 hover:underline">
              contact
            </Link>
          </p>
        </MarketingSection>
      </MarketingPageStack>
    </MarketingSubpage>
  );
}
