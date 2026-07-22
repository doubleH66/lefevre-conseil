import Link from "next/link";
import { ArrowRight, HeartPulse, Shield } from "lucide-react";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import {
  COMPARATEUR_HREF,
  CONTACT_HREF,
  ROUTES,
  SIMULATEUR_MUTUELLE_HREF,
} from "@/lib/content/routes";
import { cn } from "@/lib/utils";

const TOOLS = [
  {
    href: SIMULATEUR_MUTUELLE_HREF,
    icon: HeartPulse,
    title: "Mutuelle santé",
    eyebrow: "Proposition mutuelle personnalisée",
    description:
      "Parcours en 6 étapes : profil, coordonnées, besoins santé et budget. Philippe Lefèvre vous recontacte pour une offre adaptée — sans souscription en ligne ni engagement.",
    cta: "Obtenir ma proposition mutuelle",
  },
  {
    href: COMPARATEUR_HREF,
    icon: Shield,
    title: "Assurance de prêt",
    eyebrow: "Comparateur assurance emprunteur",
    description:
      "Étude en ligne pour votre prêt immobilier ou professionnel — délégation d’assurance possible (loi Lemoine). Un conseiller affine ensuite garanties et budget.",
    cta: "Comparer mon assurance de prêt",
  },
] as const;

export function SimulateursPage() {
  return (
    <MarketingSubpage
      hero={PAGE_HEROES.simulateurs}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Simulateurs" },
      ]}
    >
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <p className="mx-auto max-w-2xl text-center text-[15px] leading-relaxed text-[#1f2a7c]/70">
          Demandez une proposition mutuelle en ligne, ou comparez votre assurance de prêt. Un conseiller
          affine ensuite avec vous les garanties et le budget.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {TOOLS.map(({ href, icon: Icon, title, eyebrow, description, cta }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex h-full flex-col rounded-2xl border border-[#1f2a7c]/10 bg-white p-6 shadow-[0_18px_50px_rgba(23,33,59,0.06)]",
                "transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[#1f2a7c]/25 hover:shadow-[0_22px_56px_rgba(23,33,59,0.1)]",
              )}
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#1f2a7c]/[0.06] text-[#1f2a7c]">
                <Icon className="size-5" aria-hidden />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f2a7c]/55">
                {eyebrow}
              </p>
              <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[#1f2a7c]">{title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">{description}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1f2a7c] transition-all group-hover:gap-2.5">
                {cta}
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-neutral-500">
          Besoin d’une simulation patrimoniale ?{" "}
          <Link
            href={ROUTES.simulateur}
            className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline"
          >
            Ouvrir le simulateur patrimonial
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
