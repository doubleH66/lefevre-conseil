"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, HeartPulse, Shield } from "lucide-react";
import { ComparateurEmbed } from "@/components/marketing/comparateur-embed";
import { MutuelleSimulator } from "@/components/mutuelle/MutuelleSimulator";
import { CONTACT_HREF, ROUTES } from "@/lib/content/routes";
import { marketingProseClass, marketingTitleClass } from "@/components/marketing/marketing-styles";
import { cn } from "@/lib/utils";

type Mode = "mutuelle" | "assurance-pret";

const MODES: { id: Mode; label: string; icon: React.ReactNode; hash: string }[] = [
  {
    id: "mutuelle",
    label: "Mutuelle santé",
    icon: <HeartPulse className="size-4" aria-hidden />,
    hash: "mutuelle",
  },
  {
    id: "assurance-pret",
    label: "Assurance de prêt",
    icon: <Shield className="size-4" aria-hidden />,
    hash: "comparateur",
  },
];

function modeFromHash(hash: string): Mode | null {
  const id = hash.replace(/^#/, "");
  if (id === "mutuelle" || id === "outils-sante-pret") return "mutuelle";
  if (id === "comparateur" || id === "assurance-pret") return "assurance-pret";
  return null;
}

type ServiceComparateurBlockProps = {
  /** Ancre scroll (hub expertises). */
  id?: string;
  className?: string;
  sourcePage?: string;
  /** `inline` : sous-section page service · `standalone` : bloc hub expertises. */
  layout?: "inline" | "standalone";
  titleId?: string;
};

/** Simulateur mutuelle + comparateur iframe (Assur Distribution). */
export function ServiceComparateurBlock({
  id = "outils-sante-pret",
  className,
  sourcePage = ROUTES.expertises,
  layout = "inline",
  titleId = "service-comparateur-title",
}: ServiceComparateurBlockProps) {
  const [mode, setMode] = React.useState<Mode>("mutuelle");

  React.useEffect(() => {
    const syncFromHash = () => {
      const next = modeFromHash(window.location.hash);
      if (next) setMode(next);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function selectMode(next: Mode) {
    setMode(next);
    const hash = MODES.find((m) => m.id === next)?.hash;
    if (hash && layout === "standalone") {
      window.history.replaceState(null, "", `#${hash}`);
    }
  }

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
        Mutuelle santé et assurance emprunteur
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-[15px] leading-relaxed text-[#1f2a7c]/70">
        Demandez une proposition mutuelle en ligne, ou comparez votre assurance de prêt. Un conseiller
        affine ensuite avec vous les garanties et le budget.
      </p>

      <div
        className="mx-auto mt-6 flex max-w-md flex-col gap-2 rounded-2xl border border-[#1f2a7c]/10 bg-[#1f2a7c]/[0.03] p-1.5 sm:flex-row"
        role="tablist"
        aria-label="Type de comparaison"
      >
        {MODES.map(({ id: modeId, label, icon }) => (
          <button
            key={modeId}
            type="button"
            role="tab"
            aria-selected={mode === modeId}
            aria-controls={`${id}-${modeId}-panel`}
            id={`${id}-${modeId}-tab`}
            onClick={() => selectMode(modeId)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors",
              mode === modeId
                ? "bg-[#1f2a7c] text-white shadow-sm"
                : "text-[#1f2a7c]/65 hover:bg-white hover:text-[#1f2a7c]",
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div
        id={`${id}-${mode}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-${mode}-tab`}
        className="mt-6 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_18px_50px_rgba(23,33,59,0.06)]"
      >
        {mode === "mutuelle" ? (
          <div className="px-4 py-6 sm:px-6 sm:py-8">
            <p className="text-sm font-semibold text-[#1f2a7c]">Proposition mutuelle personnalisée</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Parcours en 6 étapes : profil, coordonnées, besoins santé et budget. Philippe Lefèvre vous
              recontacte pour une offre adaptée — sans souscription en ligne ni engagement.
            </p>
            <div className="mt-6">
              <MutuelleSimulator sourcePage={sourcePage} />
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
              <p className="text-sm font-semibold text-[#1f2a7c]">Assurance emprunteur</p>
              <p className="mt-1 text-sm text-neutral-600">
                Étude en ligne pour votre prêt immobilier ou professionnel — délégation d&apos;assurance possible
                (loi Lemoine).
              </p>
            </div>
            <div className="bg-neutral-50/80 p-4 sm:p-6">
              <ComparateurEmbed />
            </div>
          </>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-[#1f2a7c]/55">
        {mode === "assurance-pret" ? <>Outil Assur Distribution · </> : null}
        Pour un accompagnement personnalisé,{" "}
        <Link href={CONTACT_HREF} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
          contactez le cabinet
        </Link>
        .
      </p>
    </div>
  );
}
