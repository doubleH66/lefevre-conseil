import Link from "next/link";
import { ArrowRight, HeartPulse, Shield } from "lucide-react";
import { hubInnerWideClass, hubSectionClass } from "@/components/marketing/hub-styles";
import { marketingProseClass, marketingTitleClass } from "@/components/marketing/marketing-styles";
import { COMPARATEUR_HREF, CONTACT_HREF, SIMULATEUR_MUTUELLE_HREF } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

type ToolSection = {
  id: string;
  href: string;
  icon: typeof HeartPulse;
  title: string;
  titleId: string;
  eyebrow: string;
  description: string;
  cta: string;
};

const TOOL_SECTIONS: readonly ToolSection[] = [
  {
    id: "mutuelle",
    href: SIMULATEUR_MUTUELLE_HREF,
    icon: HeartPulse,
    title: "Mutuelle santé",
    titleId: "expertises-mutuelle-title",
    eyebrow: "Proposition personnalisée",
    description:
      "Parcours en 6 étapes : profil, coordonnées, besoins santé et budget. Philippe Lefèvre vous recontacte pour une offre adaptée — sans souscription en ligne ni engagement.",
    cta: "Obtenir ma proposition mutuelle",
  },
  {
    id: "comparateur",
    href: COMPARATEUR_HREF,
    icon: Shield,
    title: "Assurance de prêt",
    titleId: "expertises-assurance-pret-title",
    eyebrow: "Comparateur emprunteur",
    description:
      "Étude en ligne pour votre prêt immobilier ou professionnel — délégation d’assurance possible (loi Lemoine). Un conseiller affine ensuite garanties et budget.",
    cta: "Comparer mon assurance de prêt",
  },
] as const;

/** Deux blocs séparés mutuelle / assurance prêt --- hub /expertises. */
export function ExpertisesToolsSection() {
  return (
    <div className={hubSectionClass}>
      {TOOL_SECTIONS.map(({ id, href, icon: Icon, title, titleId, eyebrow, description, cta }, index) => (
        <section
          key={id}
          id={id}
          className={cn("scroll-mt-28", index > 0 && "border-t border-zinc-200")}
          aria-labelledby={titleId}
        >
          {/* Ancres legacy encore utilisées dans d’anciens liens */}
          {id === "comparateur" ? <span id="assurance-pret" className="sr-only" /> : null}
          {id === "mutuelle" ? <span id="outils-sante-pret" className="sr-only" /> : null}

          <div className={hubInnerWideClass}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#1f2a7c]/55">
                {eyebrow}
              </p>
              <h2 id={titleId} className={cn("mt-2", marketingTitleClass, marketingProseClass)}>
                {title}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-[#1f2a7c]/70">
                {description}
              </p>

              <Link
                href={href}
                className="group mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#1f2a7c] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#18226b]"
              >
                <Icon className="size-4" aria-hidden />
                {cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      ))}

      <p className="border-t border-zinc-200 px-6 py-6 text-center text-sm text-neutral-500">
        Pour un accompagnement personnalisé,{" "}
        <Link href={CONTACT_HREF} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
          contactez le cabinet
        </Link>
        .
      </p>
    </div>
  );
}
