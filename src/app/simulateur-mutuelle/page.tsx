import type { Metadata } from "next";
import Link from "next/link";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { MutuelleSimulator } from "@/components/mutuelle/MutuelleSimulator";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { COMPARATEUR_HREF, CONTACT_HREF, ROUTES } from "@/lib/content/routes";

const PATH = ROUTES.simulateurMutuelle;

export const metadata: Metadata = {
  title: "Mutuelle santé | Proposition personnalisée | Lefèvre Conseil",
  description:
    "Parcours en 6 étapes : profil, coordonnées, besoins santé et budget. Philippe Lefèvre vous recontacte pour une offre adaptée — sans souscription en ligne ni engagement.",
  alternates: { canonical: PATH },
};

const BREADCRUMBS = [
  { label: "Accueil", href: "/" },
  { label: "Simulateurs", href: ROUTES.simulateurs },
  { label: "Mutuelle santé" },
] as const;

export default function SimulateurMutuellePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Simulateurs", path: ROUTES.simulateurs },
          { name: "Mutuelle santé", path: PATH },
        ]}
      />
      <MarketingSubpage hero={PAGE_HEROES.simulateurMutuelle} breadcrumbs={[...BREADCRUMBS]}>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto mb-8 max-w-3xl text-center sm:text-left">
            <p className="text-sm font-semibold text-[#1f2a7c]">Proposition mutuelle personnalisée</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Parcours en 6 étapes : profil, coordonnées, besoins santé et budget. Philippe Lefèvre vous
              recontacte pour une offre adaptée — sans souscription en ligne ni engagement.
            </p>
          </div>

          <MutuelleSimulator sourcePage={PATH} />

          <p className="mt-8 text-center text-sm text-neutral-500">
            Besoin d’une assurance de prêt ?{" "}
            <Link
              href={COMPARATEUR_HREF}
              className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline"
            >
              Comparer mon assurance emprunteur
            </Link>
            . Pour un accompagnement personnalisé,{" "}
            <Link href={CONTACT_HREF} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
              contactez le cabinet
            </Link>
            .
          </p>
        </main>
      </MarketingSubpage>
    </>
  );
}
