"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { HeroCtaPrimaryButton, HeroCtaPrimaryLink } from "@/components/marketing/hero-site-cta";
import { CONTACT_HREF, ROUTES } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

export const fieldClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-[#1f2a7c]/40 focus:ring-2 focus:ring-[#1f2a7c]/15";

export function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-neutral-600">
        <span>
          Étape {step} sur {total}
        </span>
        <span className="text-[#1f2a7c]">{pct} %</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-[#1f2a7c] transition-all duration-300"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
}

export function ChoiceCard({
  selected,
  onClick,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-[#1f2a7c] bg-[#1f2a7c]/[0.04] ring-2 ring-[#1f2a7c]/15"
          : "border-neutral-200/90 bg-white hover:border-[#1f2a7c]/25",
      )}
    >
      <p className="text-sm font-semibold text-neutral-900">{title}</p>
      {description ? (
        <p className="mt-1 text-xs leading-relaxed text-neutral-600">{description}</p>
      ) : null}
    </button>
  );
}

export function StepNav({
  onBack,
  onNext,
  nextLabel = "Continuer",
  nextDisabled,
  loading,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
        >
          Retour
        </button>
      ) : (
        <span />
      )}
      <HeroCtaPrimaryButton type="button" disabled={nextDisabled || loading} onClick={onNext}>
        {loading ? "Enregistrement…" : nextLabel}
      </HeroCtaPrimaryButton>
    </div>
  );
}

export function MutuelleConfirmation() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-8 text-center shadow-sm">
      <CheckCircle2 className="mx-auto size-12 text-emerald-700" aria-hidden />
      <h2 className="mt-4 text-xl font-semibold text-neutral-900">Votre demande a bien été envoyée</h2>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700">
        Merci pour votre demande. Philippe Lefèvre va analyser votre profil et vous recontactera rapidement
        afin de vous proposer une solution mutuelle adaptée.
      </p>
      <p className="mt-2 text-xs text-neutral-500">
        Votre demande est étudiée par un conseiller, sans engagement. Aucun contrat n&apos;est souscrit
        automatiquement.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <HeroCtaPrimaryLink href={CONTACT_HREF}>Prendre rendez-vous</HeroCtaPrimaryLink>
        <Link
          href={ROUTES.home}
          className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-200 px-6 text-sm font-semibold text-[#1f2a7c] transition-colors hover:bg-neutral-50"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

export function SimulatorShell({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
          Obtenir ma proposition mutuelle en 2 minutes
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          {subtitle ?? "Cela prend moins de 2 minutes. Votre demande est étudiée par un conseiller, sans engagement."}
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-[0_18px_50px_rgba(23,33,59,0.06)] sm:p-8">
        {children}
      </div>
    </div>
  );
}
