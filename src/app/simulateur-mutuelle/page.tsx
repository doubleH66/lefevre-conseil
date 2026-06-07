import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { MutuelleSimulator } from "@/components/mutuelle/MutuelleSimulator";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { ROUTES } from "@/lib/content/routes";

const PATH = ROUTES.simulateurMutuelle;

export const metadata: Metadata = {
  title: "Simulateur mutuelle santé | Lefèvre Conseil",
  description:
    "Obtenez une proposition mutuelle en quelques minutes. Demande simple, sans souscription en ligne --- un conseiller vous recontacte.",
  alternates: { canonical: PATH },
};

const BREADCRUMBS = [
  { label: "Accueil", href: "/" },
  { label: "Simulateur mutuelle" },
] as const;

export default function SimulateurMutuellePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Simulateur mutuelle", path: PATH },
        ]}
      />
      <MarketingSubpage hero={PAGE_HEROES.simulateurMutuelle} breadcrumbs={[...BREADCRUMBS]}>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <MutuelleSimulator sourcePage={PATH} />
        </main>
      </MarketingSubpage>
    </>
  );
}
