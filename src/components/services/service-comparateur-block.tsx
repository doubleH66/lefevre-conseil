import Link from "next/link";
import { ArrowRight, HeartPulse, Shield } from "lucide-react";
import { marketingProseClass, marketingTitleClass } from "@/components/marketing/marketing-styles";
import { COMPARATEUR_HREF, CONTACT_HREF, SIMULATEUR_MUTUELLE_HREF } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

type ServiceComparateurBlockProps = {
  /** Ancre scroll (page service). */
  id?: string;
  className?: string;
  sourcePage?: string;
  /** `inline` : sous-section page service · `standalone` : bloc hub. */
  layout?: "inline" | "standalone";
  titleId?: string;
};

const TOOLS = [
  {
    id: "mutuelle",
    href: SIMULATEUR_MUTUELLE_HREF,
    icon: HeartPulse,
    title: "Mutuelle santé",
    description:
      "Parcours en 6 étapes : profil, coordonnées, besoins santé et budget. Sans souscription en ligne ni engagement.",
    cta: "Obtenir ma proposition mutuelle",
  },
  {
    id: "comparateur",
    href: COMPARATEUR_HREF,
    icon: Shield,
    title: "Assurance de prêt",
    description:
      "Étude en ligne pour votre prêt immobilier ou professionnel — délégation d’assurance possible (loi Lemoine).",
    cta: "Comparer mon assurance de prêt",
  },
] as const;

/** Deux outils séparés, chacun vers sa page dédiée (page prévoyance). */
export function ServiceComparateurBlock({
  id = "outils-sante-pret",
  className,
  layout = "inline",
  titleId = "service-comparateur-title",
}: ServiceComparateurBlockProps) {
  return (
    <div
      id={id}
      className={cn(
        layout === "inline" && "mt-10 border-t border-[#1f2a7c]/10 pt-10",
        "scroll-mt-28",
        className,
      )}
    >
      <h2 id={titleId} className={cn("text-center", marketingTitleClass, marketingProseClass)}>
        Outils dédiés
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-[15px] leading-relaxed text-[#1f2a7c]/70">
        Mutuelle santé et assurance de prêt sont sur des pages séparées. Un conseiller affine ensuite avec
        vous les garanties et le budget.
      </p>

      <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2">
        {TOOLS.map(({ id: toolId, href, icon: Icon, title, description, cta }) => (
          <section
            key={toolId}
            id={toolId}
            aria-labelledby={`${toolId}-title`}
            className="flex flex-col rounded-2xl border border-[#1f2a7c]/10 bg-white p-6 shadow-[0_12px_36px_rgba(23,33,59,0.05)]"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#1f2a7c]/[0.06] text-[#1f2a7c]">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 id={`${toolId}-title`} className="mt-4 text-lg font-semibold tracking-tight text-[#1f2a7c]">
              {title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{description}</p>
            <Link
              href={href}
              className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1f2a7c] transition-all hover:gap-2.5"
            >
              {cta}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </section>
        ))}
      </div>

      <p className="mt-5 text-center text-xs text-[#1f2a7c]/55">
        Pour un accompagnement personnalisé,{" "}
        <Link href={CONTACT_HREF} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
          contactez le cabinet
        </Link>
        .
      </p>
    </div>
  );
}
