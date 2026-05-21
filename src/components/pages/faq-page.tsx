import Link from "next/link";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { FaqAccordion } from "@/components/client/faq-accordion";
import {
  MarketingHeading,
  MarketingHighlight,
  MarketingPageStack,
  MarketingSection,
} from "@/components/marketing/marketing-section";
import { marketingPageShellClass } from "@/components/marketing/marketing-styles";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { CONTACT_HREF, ROUTES } from "@/lib/content/routes";
import { SITE_PUBLIC_FAQ_ITEMS } from "@/lib/content/site-faq";

const FAQ_EXTRA = [
  {
    q: "Puis-je faire une simulation avant un rendez-vous ?",
    a: "Oui. Le simulateur patrimonial en ligne vous permet d’obtenir une première piste chiffrée ; un conseiller peut ensuite affiner avec vous les hypothèses et les leviers.",
  },
  {
    q: "Comment accéder à mon espace client ?",
    a: "Connectez-vous depuis l’icône « Compte » dans la barre de navigation. Après validation de votre e-mail, vous accédez à votre espace personnel.",
  },
] as const;

export function FaqPage() {
  const items = [...SITE_PUBLIC_FAQ_ITEMS, ...FAQ_EXTRA];

  return (
    <MarketingSubpage
      hero={PAGE_HEROES.faq}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "FAQ" },
      ]}
    >
      <MarketingPageStack className={marketingPageShellClass}>
        <MarketingSection labelledBy="faq-list-title">
          <MarketingHeading
            titleId="faq-list-title"
            kicker="Aide"
            title={
              <>
                Réponses <MarketingHighlight>essentielles</MarketingHighlight> avant de nous écrire.
              </>
            }
            lead={
              <>
                Pour un cas précis, utilisez le{" "}
                <Link href={CONTACT_HREF} className="font-semibold underline-offset-2 hover:underline">
                  contact
                </Link>{" "}
                ou le{" "}
                <Link href={ROUTES.simulateur} className="font-semibold underline-offset-2 hover:underline">
                  simulateur
                </Link>
                .
              </>
            }
          />
          <div className="mx-auto mt-10 max-w-3xl">
            <FaqAccordion items={items} questionEmphasis="highlight" />
          </div>
        </MarketingSection>
      </MarketingPageStack>
    </MarketingSubpage>
  );
}
