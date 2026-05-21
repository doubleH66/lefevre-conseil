import Link from "next/link";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { ComparateurEmbed } from "@/components/marketing/comparateur-embed";
import { CONTACT_HREF } from "@/lib/content/routes";

export function ComparateurPage() {
  return (
    <MarketingSubpage
      hero={PAGE_HEROES.comparateur}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Comparateur" },
      ]}
    >
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

        <section
          aria-label="Outil de comparaison Assur Distribution"
          className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_18px_50px_rgba(23,33,59,0.06)]"
        >
          <ComparateurEmbed />
        </section>

        <p className="mt-6 text-sm text-neutral-500 text-center">
          Pour un accompagnement personnalisé,{" "}
          <Link href={CONTACT_HREF} className="font-medium text-[#1f2a7c] underline-offset-2 hover:underline">
            contactez le cabinet
          </Link>
          .
        </p>
      </main>
    </MarketingSubpage>
  );
}
