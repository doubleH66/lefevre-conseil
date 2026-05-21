import Link from "next/link";
import { SubpageShell } from "@/components/layout/subpage-shell";
import { ComparateurEmbed } from "@/components/marketing/comparateur-embed";
import { CONTACT_HREF } from "@/lib/content/routes";

export function ComparateurPage() {
  return (
    <SubpageShell
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Comparateur" },
      ]}
    >
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <header className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1f2a7c]/70">
            Assurance
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Comparateur en ligne
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-600 sm:text-base">
            Comparez les offres en quelques minutes. Pour un accompagnement personnalisé,{" "}
            <Link href={CONTACT_HREF} className="font-medium text-[#1f2a7c] underline-offset-2 hover:underline">
              contactez le cabinet
            </Link>
            .
          </p>
        </header>

        <section
          aria-label="Outil de comparaison Assur Distribution"
          className="mt-8 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_18px_50px_rgba(23,33,59,0.06)] sm:mt-10"
        >
          <ComparateurEmbed />
        </section>
      </main>
    </SubpageShell>
  );
}
