import Link from "next/link";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { ComparateurEmbed } from "@/components/marketing/comparateur-embed";
import { CONTACT_HREF, ROUTES, SIMULATEUR_MUTUELLE_HREF } from "@/lib/content/routes";

export function ComparateurPage() {
  return (
    <MarketingSubpage
      hero={PAGE_HEROES.comparateur}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Simulateurs", href: ROUTES.simulateurs },
        { label: "Assurance de prêt" },
      ]}
    >
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:text-left">
          <p className="text-sm font-semibold text-[#1f2a7c]">Assurance emprunteur</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Étude en ligne pour votre prêt immobilier ou professionnel — délégation d’assurance possible
            (loi Lemoine). Un conseiller affine ensuite avec vous les garanties et le budget.
          </p>
        </div>

        <section
          aria-label="Comparateur assurance emprunteur Assur Distribution"
          className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_18px_50px_rgba(23,33,59,0.06)]"
        >
          <ComparateurEmbed />
        </section>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Outil Assur Distribution · Besoin d’une mutuelle santé ?{" "}
          <Link
            href={SIMULATEUR_MUTUELLE_HREF}
            className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline"
          >
            Obtenir ma proposition mutuelle
          </Link>
          . Pour un accompagnement personnalisé,{" "}
          <Link href={CONTACT_HREF} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
            contactez le cabinet
          </Link>
          .
        </p>
      </main>
    </MarketingSubpage>
  );
}
