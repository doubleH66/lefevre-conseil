"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, HeartPulse, Send, Sparkles } from "lucide-react";
import { SubpageShell } from "@/components/layout/subpage-shell";
import { MutuelleEmbed } from "@/components/marketing/comparateur-embed";
import { HeroCtaPrimaryButton, HeroCtaSecondaryLink } from "@/components/marketing/hero-site-cta";
import { SERVICE_CATALOG, serviceDetailHref } from "@/lib/content/services";
import type { ServiceSlug } from "@/lib/content/services";
import { CABINET_CONTACT } from "@/lib/content/site";
import { CONTACT_HREF } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

const SIMULATEUR_BREADCRUMBS = [
  { label: "Accueil", href: "/" },
  { label: "Simulateur" },
] as const;

const fieldClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-[#1f2a7c]/40 focus:ring-2 focus:ring-[#1f2a7c]/15";

const OBJECTIFS = [
  "Réduire mes impôts",
  "Préparer ma retraite",
  "Faire fructifier mon épargne",
  "Protéger mes proches",
  "Transmettre mon patrimoine",
  "Investir dans l’immobilier",
] as const;

type SimulateurMode = "patrimoine" | "mutuelle";

export function SimulateurPage() {
  const [mode, setMode] = React.useState<SimulateurMode>("patrimoine");
  const [domain, setDomain] = React.useState<ServiceSlug | "">("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = [
      `Domaine : ${domain || "Non précisé"}`,
      `Nom : ${data.get("name")}`,
      `E-mail : ${data.get("email")}`,
      `Téléphone : ${data.get("phone") || "—"}`,
      `Situation : ${data.get("situation")}`,
      `Objectifs : ${data.get("objectifs") || "—"}`,
      "",
      String(data.get("message") ?? ""),
    ];
    const mailto = `mailto:${CABINET_CONTACT.email}?subject=${encodeURIComponent("[Simulateur] Demande de simulation")}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <SubpageShell breadcrumbs={[...SIMULATEUR_BREADCRUMBS]}>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1f2a7c]/70">
            <span aria-hidden className="inline-block h-px w-5 bg-[#1f2a7c]/40" />
            Simulateur
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Choisissez votre parcours
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-600 sm:text-base">
            Simulation patrimoniale personnalisée avec le cabinet, ou comparateur mutuelle santé en ligne.
          </p>
        </header>

        <div
          className="mx-auto mt-10 flex max-w-xl flex-col gap-2 rounded-2xl border border-neutral-200/90 bg-neutral-50/80 p-1.5 sm:flex-row"
          role="tablist"
          aria-label="Type de simulation"
        >
          <ModeTab
            active={mode === "patrimoine"}
            onClick={() => setMode("patrimoine")}
            icon={<Sparkles className="size-4" aria-hidden />}
            label="Simulation patrimoniale"
          />
          <ModeTab
            active={mode === "mutuelle"}
            onClick={() => setMode("mutuelle")}
            icon={<HeartPulse className="size-4" aria-hidden />}
            label="Obtenir ma mutuelle"
          />
        </div>

        {mode === "mutuelle" ? (
          <section
            aria-labelledby="mutuelle-embed-title"
            className="mx-auto mt-10 max-w-5xl"
          >
            <div className="mb-6 text-center sm:text-left">
              <h2 id="mutuelle-embed-title" className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
                Obtenir ma mutuelle
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
                Comparez les offres de mutuelle santé en quelques clics. Pour un conseil sur mesure,{" "}
                <Link href={CONTACT_HREF} className="font-medium text-[#1f2a7c] underline-offset-2 hover:underline">
                  contactez le cabinet
                </Link>
                .
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_18px_50px_rgba(23,33,59,0.06)]">
              <MutuelleEmbed />
            </div>
            <p className="mt-6 text-center text-sm text-neutral-500">
              Vous préférez un bilan global ?{" "}
              <button
                type="button"
                onClick={() => setMode("patrimoine")}
                className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline"
              >
                Passer à la simulation patrimoniale
              </button>
            </p>
          </section>
        ) : (
          <>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-neutral-600">
              Partagez votre situation : un conseiller vous répond sous 48 h avec une piste chiffrée.
            </p>

            <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-3xl space-y-8" noValidate>
              <section className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm">
                <div className="border-b border-neutral-100 bg-neutral-50/60 px-5 py-4 sm:px-6">
                  <h2 className="text-sm font-semibold text-neutral-900">Domaine prioritaire</h2>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                  {SERVICE_CATALOG.map((item) => {
                    const selected = domain === item.slug;
                    return (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => setDomain(item.slug)}
                        aria-pressed={selected}
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-all",
                          selected
                            ? "border-[#1f2a7c] bg-[#1f2a7c]/[0.04] ring-2 ring-[#1f2a7c]/15"
                            : "border-neutral-200/90 bg-white hover:border-[#1f2a7c]/25",
                        )}
                      >
                        <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-neutral-600">{item.summary}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm">
                <div className="border-b border-neutral-100 bg-neutral-50/60 px-5 py-4 sm:px-6">
                  <h2 className="text-sm font-semibold text-neutral-900">Votre profil</h2>
                </div>
                <div className="space-y-4 p-5 sm:p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-neutral-800">
                      Nom *
                      <input name="name" required className={cn(fieldClass, "mt-1.5")} />
                    </label>
                    <label className="block text-sm font-medium text-neutral-800">
                      E-mail *
                      <input name="email" type="email" required className={cn(fieldClass, "mt-1.5")} />
                    </label>
                  </div>
                  <label className="block text-sm font-medium text-neutral-800">
                    Téléphone
                    <input name="phone" type="tel" className={cn(fieldClass, "mt-1.5")} />
                  </label>
                  <label className="block text-sm font-medium text-neutral-800">
                    Situation familiale
                    <select name="situation" className={cn(fieldClass, "mt-1.5")} defaultValue="Célibataire">
                      {["Célibataire", "Marié(e) / Pacsé(e)", "Concubinage", "Divorcé(e)", "Veuf(ve)"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <fieldset>
                    <legend className="text-sm font-medium text-neutral-800">Objectifs</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {OBJECTIFS.map((obj) => (
                        <label
                          key={obj}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50/80 px-3 py-1.5 text-xs font-medium text-neutral-800"
                        >
                          <input type="checkbox" name="objectifs" value={obj} className="size-3.5 accent-[#1f2a7c]" />
                          {obj}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className="block text-sm font-medium text-neutral-800">
                    Précisions
                    <textarea name="message" rows={4} className={cn(fieldClass, "mt-1.5 resize-y")} />
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <HeroCtaPrimaryButton type="submit" className="sm:min-w-[14rem]">
                      <span className="inline-flex items-center gap-2">
                        <Send className="size-4" aria-hidden />
                        Recevoir ma simulation
                      </span>
                    </HeroCtaPrimaryButton>
                    <HeroCtaSecondaryLink href={CONTACT_HREF} surface="light">
                      Me faire rappeler
                    </HeroCtaSecondaryLink>
                  </div>
                  {submitted ? (
                    <p className="flex items-center gap-2 text-sm text-emerald-800">
                      <CheckCircle2 className="size-4 shrink-0" aria-hidden />
                      Brouillon prêt dans votre messagerie.
                    </p>
                  ) : null}
                </div>
              </section>
            </form>

            <p className="mx-auto mt-8 max-w-xl text-center text-sm text-neutral-500">
              Besoin d’une mutuelle santé ?{" "}
              <button
                type="button"
                onClick={() => setMode("mutuelle")}
                className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline"
              >
                Obtenir ma mutuelle en ligne
              </button>
            </p>
          </>
        )}

        <section
          aria-labelledby="simulateur-services-title"
          className="mx-auto mt-16 max-w-5xl rounded-3xl border border-neutral-200/90 bg-neutral-50/50 p-6 sm:mt-20 sm:p-8"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1f2a7c]/70">
                Expertises
              </p>
              <h2 id="simulateur-services-title" className="mt-1 text-xl font-semibold text-neutral-900">
                Découvrir nos domaines
              </h2>
            </div>
            <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1f2a7c] hover:underline">
              Tous les services
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_CATALOG.map((s) => (
              <li key={s.slug}>
                <Link
                  href={serviceDetailHref(s.slug)}
                  className="block rounded-2xl border border-neutral-200/90 bg-white px-4 py-3.5 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:border-[#1f2a7c]/25"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </SubpageShell>
  );
}

function ModeTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
        active
          ? "bg-white text-[#1f2a7c] shadow-sm"
          : "text-neutral-600 hover:bg-white/60 hover:text-neutral-900",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
