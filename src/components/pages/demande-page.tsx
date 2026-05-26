"use client";

import * as React from "react";
import Link from "next/link";
import { fieldClass, marketingCardClass, marketingProseClass } from "@/components/marketing/marketing-styles";
import { HeroCtaPrimaryButton } from "@/components/ui/hero-cta";
import { ROUTES } from "@/lib/content/routes";
import { CONTACT_SUBJECTS } from "@/lib/content/site";

const SITUATIONS = [
  "Salarié / cadre",
  "Profession libérale",
  "Dirigeant / TNS",
  "Retraité",
  "Autre",
] as const;

const CONTACT_PREFS = [
  { value: "either", label: "E-mail ou téléphone" },
  { value: "email", label: "E-mail uniquement" },
  { value: "phone", label: "Téléphone uniquement" },
] as const;

export function DemandePageClient() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/site-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fd.get("firstName"),
          lastName: fd.get("lastName"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          currentSituation: fd.get("currentSituation"),
          requestType: fd.get("requestType"),
          patrimonialGoal: fd.get("patrimonialGoal"),
          approximateAmount: fd.get("approximateAmount"),
          message: fd.get("message"),
          contactPreference: fd.get("contactPreference"),
          gdprConsent: fd.get("gdprConsent") === "on",
          website: fd.get("website"),
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Envoi impossible. Réessayez ou contactez le cabinet.");
        return;
      }

      setSuccess(true);
      form.reset();
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau et réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={`${marketingCardClass} mx-auto max-w-2xl p-8 text-center`}>
        <h2 className="text-xl font-semibold text-[#1f2a7c]">Demande envoyée</h2>
        <p className={`${marketingProseClass} mt-3`}>
          Merci pour votre confiance. Vous recevrez un e-mail de confirmation et un conseiller vous recontactera
          rapidement.
        </p>
        <Link href={ROUTES.home} className="mt-6 inline-block text-sm font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className={`${marketingCardClass} mx-auto max-w-2xl space-y-4 p-6 sm:p-8`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-[#1f2a7c]/80">Prénom *</span>
          <input name="firstName" required autoComplete="given-name" className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-[#1f2a7c]/80">Nom *</span>
          <input name="lastName" required autoComplete="family-name" className={fieldClass} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-[#1f2a7c]/80">E-mail *</span>
          <input name="email" type="email" required autoComplete="email" className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-[#1f2a7c]/80">Téléphone</span>
          <input name="phone" type="tel" autoComplete="tel" className={fieldClass} />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-[#1f2a7c]/80">Situation actuelle</span>
        <select name="currentSituation" className={fieldClass}>
          <option value="">Sélectionner…</option>
          {SITUATIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-[#1f2a7c]/80">Type de demande *</span>
        <select name="requestType" required className={fieldClass}>
          <option value="">Sélectionner…</option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-[#1f2a7c]/80">Objectif patrimonial</span>
        <input name="patrimonialGoal" placeholder="Ex. préparer la retraite, optimiser la fiscalité…" className={fieldClass} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-[#1f2a7c]/80">Montant approximatif (si pertinent)</span>
        <input name="approximateAmount" placeholder="Ex. 50 000 € à investir" className={fieldClass} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-[#1f2a7c]/80">Message libre</span>
        <textarea name="message" rows={4} className={`${fieldClass} min-h-[120px] py-3`} />
      </label>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-[#1f2a7c]/80">Préférence de contact</legend>
        <div className="flex flex-wrap gap-3">
          {CONTACT_PREFS.map((pref) => (
            <label key={pref.value} className="flex items-center gap-2 text-sm text-neutral-700">
              <input type="radio" name="contactPreference" value={pref.value} defaultChecked={pref.value === "either"} />
              {pref.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-start gap-2 text-sm text-neutral-700">
        <input name="gdprConsent" type="checkbox" required className="mt-1" />
        <span>
          J&apos;accepte que mes données soient utilisées pour traiter ma demande, conformément à la{" "}
          <Link href={ROUTES.confidentialite} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
            politique de confidentialité
          </Link>
          . *
        </span>
      </label>

      {/* Honeypot anti-spam */}
      <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">
          {error}
        </p>
      ) : null}

      <HeroCtaPrimaryButton type="submit" disabled={loading} layout="page" className="!w-full disabled:opacity-60">
        {loading ? "Envoi en cours…" : "Envoyer ma demande"}
      </HeroCtaPrimaryButton>
    </form>
  );
}
