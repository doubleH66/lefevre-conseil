import Link from "next/link";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import {
  MarketingHeading,
  MarketingPageStack,
  MarketingSection,
} from "@/components/marketing/marketing-section";
import { marketingCardClass, marketingPageShellClass } from "@/components/marketing/marketing-styles";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { FAQ_HREF, ROUTES } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: "ios",
    title: "iPhone et iPad (Safari)",
    items: [
      "Ouvrez le site dans Safari.",
      "Bouton Partager → « Sur l’écran d’accueil ».",
      "Validez « Lefèvre Conseil » puis « Ajouter ».",
    ],
  },
  {
    id: "android",
    title: "Android (Chrome)",
    items: [
      "Ouvrez le site dans Chrome.",
      "Menu ⋮ → « Installer l’application » ou « Ajouter à l’écran d’accueil ».",
      "Confirmez l’ajout de l’icône.",
    ],
  },
  {
    id: "desktop",
    title: "Ordinateur",
    items: [
      "Chrome / Edge : icône « installer » dans la barre d’adresse.",
      "Safari macOS : favori ou raccourci dock.",
    ],
  },
] as const;

export function InstallationPage() {
  return (
    <MarketingSubpage
      hero={PAGE_HEROES.installation}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Installer l’app" },
      ]}
    >
      <MarketingPageStack className={marketingPageShellClass}>
        {steps.map((block) => (
          <MarketingSection key={block.id} labelledBy={`${block.id}-title`}>
            <MarketingHeading titleId={`${block.id}-title`} title={block.title} align="left" />
            <ol className="mt-6 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-[#1f2a7c]/80">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </MarketingSection>
        ))}

        <MarketingSection labelledBy="limits-title">
          <div className={cn(marketingCardClass, "bg-[#fafbfc] p-6")}>
            <h2 id="limits-title" className="text-base font-semibold text-[#1f2a7c]">
              À savoir
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#1f2a7c]/75">
              L’application web ne remplace pas les mises à jour d’une app store : pensez à rouvrir le site
              régulièrement pour bénéficier des dernières évolutions.
            </p>
            <p className="mt-4 text-sm">
              <Link href={FAQ_HREF} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
                FAQ
              </Link>{" "}
              ·{" "}
              <Link href={ROUTES.simulateur} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
                Simulateur
              </Link>
            </p>
          </div>
        </MarketingSection>
      </MarketingPageStack>
    </MarketingSubpage>
  );
}
