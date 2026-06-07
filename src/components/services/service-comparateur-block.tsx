"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, HeartPulse, Shield } from "lucide-react";
import { ComparateurEmbed } from "@/components/marketing/comparateur-embed";
import { HeroCtaPrimaryLink } from "@/components/marketing/hero-site-cta";
import { CONTACT_HREF, ROUTES, SIMULATEUR_MUTUELLE_HREF } from "@/lib/content/routes";
import { marketingProseClass, marketingTitleClass } from "@/components/marketing/marketing-styles";
import { cn } from "@/lib/utils";

type Mode = "mutuelle" | "assurance-pret";

const MODES: { id: Mode; label: string; icon: React.ReactNode }[] = [
  { id: "mutuelle", label: "Mutuelle santé", icon: <HeartPulse className="size-4" aria-hidden /> },
  { id: "assurance-pret", label: "Assurance de prêt", icon: <Shield className="size-4" aria-hidden /> },
];

/** Comparateur / simulateur --- page Prévoyance & assurance de prêt. */
export function ServiceComparateurBlock() {
  const [mode, setMode] = React.useState<Mode>("mutuelle");

  return (
    <div className="mt-10 border-t border-[#1f2a7c]/10 pt-10">
      <h2 className={cn("text-center", marketingTitleClass, marketingProseClass)}>
        Mutuelle santé et assurance emprunteur
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-[15px] leading-relaxed text-[#1f2a7c]/70">
        Demandez une proposition mutuelle en quelques minutes, ou comparez votre assurance de prêt. Un conseiller
        affine ensuite avec vous les garanties et le budget.
      </p>

      <div
        className="mx-auto mt-6 flex max-w-md flex-col gap-2 rounded-2xl border border-[#1f2a7c]/10 bg-[#1f2a7c]/[0.03] p-1.5 sm:flex-row"
        role="tablist"
        aria-label="Type de comparaison"
      >
        {MODES.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors",
              mode === id
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
        className="mt-6 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_18px_50px_rgba(23,33,59,0.06)]"
        role="tabpanel"
      >
        {mode === "mutuelle" ? (
          <div className="px-5 py-8 sm:px-10 sm:py-10">
            <p className="text-sm font-semibold text-[#1f2a7c]">Proposition mutuelle personnalisée</p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
              Parcours simple en 6 étapes : profil, coordonnées, besoins santé et budget. Philippe Lefèvre vous
              recontacte pour une offre adaptée --- sans souscription en ligne ni engagement.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <HeroCtaPrimaryLink href={SIMULATEUR_MUTUELLE_HREF}>
                <span className="inline-flex items-center gap-2">
                  Obtenir ma proposition
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </HeroCtaPrimaryLink>
              <Link
                href={ROUTES.simulateur}
                className="text-sm font-semibold text-[#1f2a7c] underline-offset-2 hover:underline"
              >
                Simulateur patrimonial
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
              <p className="text-sm font-semibold text-[#1f2a7c]">Assurance emprunteur</p>
              <p className="mt-1 text-sm text-neutral-600">
                Étude en ligne pour votre prêt immobilier ou professionnel --- délégation d&apos;assurance possible
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
        {mode === "assurance-pret" ? (
          <>
            Outil Assur Distribution ·{" "}
          </>
        ) : null}
        Pour un accompagnement personnalisé,{" "}
        <Link href={CONTACT_HREF} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
          contactez le cabinet
        </Link>
        .
      </p>
    </div>
  );
}
