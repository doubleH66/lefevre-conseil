"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { MarketingPageStack } from "@/components/marketing/marketing-section";
import {
  marketingCardClass,
  marketingInnerClass,
  marketingPageShellClass,
  fieldClass,
} from "@/components/marketing/marketing-styles";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { CABINET_CONTACT, formatAddressLine } from "@/lib/content/site";
import { ADVISOR_ROUND_AVATAR_IMAGE_URL, ADVISOR_ROUND_AVATAR_OBJECT_POSITION } from "@/lib/content/site";
import { ROUTES, SIMULATEUR_HREF } from "@/lib/content/routes";
import { submitSiteLead } from "@/lib/site-lead/submit-site-lead";
import { cn } from "@/lib/utils";

const BREADCRUMBS = [
  { label: "Accueil", href: "/" },
  { label: "Prendre rendez-vous" },
] as const;

/** « Vous êtes » - profil du demandeur. */
const CONTACT_PROFILES = [
  "Particulier",
  "Dirigeant / indépendant",
  "Profession libérale",
  "Entreprise",
] as const;

/** « Votre besoin principal ». */
const CONTACT_NEEDS = [
  "Gestion de patrimoine",
  "Placements / épargne",
  "Retraite",
  "Transmission",
  "Fiscalité patrimoniale",
  "Prévoyance / assurance",
  "Autre",
] as const;

const CONTACT_MAP_ASPECT =
  "relative w-full aspect-[16/9] min-h-[12rem] sm:aspect-[21/9] lg:aspect-[3/1] lg:min-h-[14rem] lg:max-h-[min(22rem,36vh)] xl:aspect-[3.2/1]";

const ContactMap = dynamic(() => import("@/components/contact/contact-map"), {
  ssr: false,
  loading: () => (
    <div
      className={cn(CONTACT_MAP_ASPECT, "flex items-center justify-center bg-white text-sm text-neutral-400")}
    >
      Chargement…
    </div>
  ),
});

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

const contactFieldClass = cn(
  fieldClass,
  "h-12 rounded-2xl border-neutral-200/90 bg-[#fafbfd] px-4 py-0 text-[15px] shadow-[inset_0_1px_2px_rgba(10,20,40,0.03)]",
  "transition-[border-color,background-color,box-shadow] duration-200",
  "hover:border-neutral-300 hover:bg-white",
  "focus:border-[#1f2a7c]/35 focus:bg-white focus:ring-[3px] focus:ring-[#1f2a7c]/10",
);

const contactTextareaClass = cn(
  contactFieldClass,
  "h-auto min-h-[11rem] resize-y py-3.5 leading-relaxed",
);

const contactLabelClass = "mb-2.5 block text-[13px] font-semibold tracking-[-0.01em] text-[#1f2a7c]/85";

function FormStepDots({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Étape ${step} sur 2`}>
      {[1, 2].map((n) => (
        <div
          key={n}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            n === step ? "w-8 bg-[#1f2a7c]" : "w-1.5 bg-[#1f2a7c]/15",
          )}
        />
      ))}
    </div>
  );
}

function ContactFormHeader({ step }: { step: 1 | 2 }) {
  return (
    <div className="border-b border-neutral-100 px-6 py-6 sm:px-10 sm:py-7">
      <FormStepDots step={step} />

      <div className="mt-5 space-y-2">
        <h2 id="contact-form-title" className="text-xl font-semibold tracking-tight text-[#1f2a7c] sm:text-2xl">
          {step === 1 ? "Vos coordonnées" : "Votre besoin"}
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-[#1f2a7c]/60 sm:text-[15px]">
          {step === 1
            ? "Prénom, nom, e-mail et téléphone pour vous recontacter."
            : "Indiquez votre profil et votre besoin, puis décrivez votre situation."}
        </p>
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  required,
  optional,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={contactLabelClass}>
        {label}
        {required ? <span className="ml-0.5 text-[#1f2a7c]/35">*</span> : null}
        {optional ? <span className="ml-1.5 font-normal text-[#1f2a7c]/40">(facultatif)</span> : null}
      </label>
      {children}
    </div>
  );
}

function OptionPicker({
  legend,
  options,
  value,
  onChange,
  columns = 2,
}: {
  legend: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  columns?: 1 | 2;
}) {
  return (
    <fieldset>
      <legend className={contactLabelClass}>{legend}</legend>
      <div className={cn("grid grid-cols-1 gap-2.5", columns === 2 && "sm:grid-cols-2")}>
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? "" : option)}
              className={cn(
                "group relative flex min-h-[3rem] items-center rounded-2xl border px-4 py-3 text-left text-[14px] font-medium leading-snug tracking-[-0.01em] transition-all duration-200",
                selected
                  ? "border-[#1f2a7c] bg-[#1f2a7c]/[0.06] text-[#1f2a7c] shadow-[0_0_0_1px_rgba(31,42,124,0.1),0_10px_24px_-18px_rgba(31,42,124,0.45)]"
                  : "border-neutral-200/90 bg-[#fafbfd] text-[#1f2a7c]/72 hover:border-neutral-300 hover:bg-white",
              )}
            >
              <span className="pr-7">{option}</span>
              <span
                className={cn(
                  "absolute right-3 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full border transition-all duration-200",
                  selected
                    ? "border-[#1f2a7c] bg-[#1f2a7c] text-white"
                    : "border-neutral-200 bg-white text-transparent group-hover:border-neutral-300",
                )}
                aria-hidden
              >
                <Check className="size-3" />
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="rounded-2xl border border-red-200/90 bg-red-50/90 px-4 py-3 text-sm leading-relaxed text-red-800">
      {children}
    </p>
  );
}

// ─── Multi-step form ─────────────────────────────────────────────────────────

function ContactForm({ initialSubject = "" }: { initialSubject?: string }) {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [values, setValues] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profile: "",
    need: initialSubject,
    message: "",
  });
  const [gdprConsent, setGdprConsent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const set = (k: keyof typeof values, v: string) => {
    setValues((p) => ({ ...p, [k]: v }));
    setError(null);
  };

  const canContinue =
    values.firstName.trim().length > 0 &&
    values.lastName.trim().length > 0 &&
    isValidEmail(values.email);

  const goNext = () => {
    if (!values.firstName.trim() || !values.lastName.trim()) {
      setError("Veuillez indiquer votre prénom et votre nom.");
      return;
    }
    if (!isValidEmail(values.email)) {
      setError("Veuillez saisir une adresse e-mail valide.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const goBack = () => {
    setError(null);
    setStep(1);
  };

  const submit = async () => {
    if (!values.message.trim()) {
      setError("Veuillez décrire votre demande.");
      return;
    }
    if (!gdprConsent) {
      setError("Veuillez accepter la politique de confidentialité.");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await submitSiteLead({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      currentSituation: values.profile.trim() || undefined,
      patrimonialGoal: values.need.trim() || undefined,
      requestType: values.need.trim() || "Prise de rendez-vous",
      message: values.message.trim(),
      contactPreference: "either",
      gdprConsent: true,
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <section className={cn(marketingCardClass, "overflow-hidden px-6 py-12 text-center sm:px-8")}>
        <h2 className="text-xl font-semibold text-[#1f2a7c]">Message envoyé</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#1f2a7c]/70">
          Merci pour votre message. Vous recevrez une confirmation par e-mail et le cabinet vous recontactera rapidement.
        </p>
        <Link
          href={ROUTES.home}
          className="mt-6 inline-block text-sm font-semibold text-[#1f2a7c] underline-offset-2 hover:underline"
        >
          Retour à l&apos;accueil
        </Link>
      </section>
    );
  }

  return (
    <section aria-labelledby="contact-form-title" className={cn(marketingCardClass, "overflow-hidden shadow-[0_18px_50px_-28px_rgba(31,42,124,0.28)]")}>
      <ContactFormHeader step={step} />

      <div className="overflow-hidden">
        {step === 1 ? (
          <div key="step-1" className="space-y-7 px-6 py-8 sm:space-y-8 sm:px-10 sm:py-10">
            {error ? <FormAlert>{error}</FormAlert> : null}

            <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
              <FormField id="c-firstname" label="Prénom" required>
                <input
                  id="c-firstname"
                  type="text"
                  autoComplete="given-name"
                  required
                  placeholder="Ex. Jean"
                  value={values.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  className={contactFieldClass}
                />
              </FormField>

              <FormField id="c-lastname" label="Nom" required>
                <input
                  id="c-lastname"
                  type="text"
                  autoComplete="family-name"
                  required
                  placeholder="Ex. Dupont"
                  value={values.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  className={contactFieldClass}
                />
              </FormField>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
              <FormField id="c-email" label="Adresse e-mail" required>
                <input
                  id="c-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="vous@exemple.fr"
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canContinue && goNext()}
                  className={contactFieldClass}
                />
              </FormField>

              <FormField id="c-phone" label="Téléphone" optional>
                <input
                  id="c-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="06 12 34 56 78"
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={contactFieldClass}
                />
              </FormField>
            </div>

            <div className="border-t border-neutral-100 pt-2 sm:pt-3">
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1f2a7c] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#182266] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#1f2a7c]/35 disabled:shadow-none sm:w-auto"
              >
                Continuer
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-disabled:translate-x-0 group-disabled:translate-y-0"
                />
              </button>
              {!canContinue ? (
                <p className="mt-3 text-[13px] leading-relaxed text-[#1f2a7c]/45">
                  Renseignez votre nom et votre e-mail pour continuer.
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <div key="step-2" className="space-y-7 px-6 py-8 sm:space-y-8 sm:px-10 sm:py-10">
            <div className="rounded-2xl border border-[#1f2a7c]/10 bg-[#1f2a7c]/[0.03] p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <p className="text-[13px] font-semibold text-[#1f2a7c]/45">Récapitulatif</p>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-[15px] leading-relaxed text-[#1f2a7c]">
                    <span className="font-medium">
                      {values.firstName} {values.lastName}
                    </span>
                    <span className="text-[#1f2a7c]/25">·</span>
                    <span className="text-[#1f2a7c]/75">{values.email}</span>
                    {values.phone ? (
                      <>
                        <span className="text-[#1f2a7c]/25">·</span>
                        <span className="text-[#1f2a7c]/75">{values.phone}</span>
                      </>
                    ) : null}
                  </div>
                  {values.need ? (
                    <p className="inline-flex items-center rounded-full border border-[#1f2a7c]/12 bg-white px-3 py-1 text-[13px] font-medium text-[#1f2a7c]">
                      {values.need}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={goBack}
                  className="shrink-0 text-[13px] font-semibold text-[#1f2a7c]/55 underline-offset-4 transition-colors hover:text-[#1f2a7c] hover:underline"
                >
                  Modifier
                </button>
              </div>
            </div>

            {error ? <FormAlert>{error}</FormAlert> : null}

            <OptionPicker
              legend="Vous êtes"
              options={CONTACT_PROFILES}
              value={values.profile}
              onChange={(profile) => set("profile", profile)}
            />

            <OptionPicker
              legend="Votre besoin principal"
              options={CONTACT_NEEDS}
              value={values.need}
              onChange={(need) => set("need", need)}
            />

            <FormField id="c-message" label="Votre message" required>
              <textarea
                id="c-message"
                rows={7}
                autoFocus
                placeholder="Décrivez brièvement votre situation, vos objectifs ou votre question…"
                value={values.message}
                onChange={(e) => set("message", e.target.value)}
                className={contactTextareaClass}
              />
            </FormField>

            <label className="flex items-start gap-3 rounded-2xl border border-neutral-200/80 bg-[#fafbfd] px-4 py-4 text-sm leading-relaxed text-[#1f2a7c]/75">
              <input
                type="checkbox"
                checked={gdprConsent}
                onChange={(e) => setGdprConsent(e.target.checked)}
                className="mt-0.5 size-4 rounded border-neutral-300 text-[#1f2a7c] focus:ring-[#1f2a7c]/20"
              />
              <span>
                J&apos;accepte que mes données soient utilisées pour traiter ma demande, conformément à la{" "}
                <Link href={ROUTES.confidentialite} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
                  politique de confidentialité
                </Link>
                .
              </span>
            </label>

            <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-2 sm:flex-row sm:items-center sm:pt-3">
              <button
                type="button"
                onClick={goBack}
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-[#1f2a7c]/12 bg-white px-5 text-sm font-semibold text-[#1f2a7c] transition-colors hover:bg-[#1f2a7c]/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/30 disabled:opacity-50"
                aria-label="Retour à l'étape précédente"
              >
                <ArrowLeft aria-hidden className="size-4" />
                Retour
              </button>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={loading}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1f2a7c] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#182266] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/40 focus-visible:ring-offset-2 disabled:opacity-60 sm:flex-none"
              >
                {loading ? "Envoi en cours…" : "Envoyer ma demande de rendez-vous"}
                {!loading ? (
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                ) : null}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function ContactPage({ initialSubject = "" }: { initialSubject?: string }) {
  const { phone, phoneTel, email, openingHours } = CABINET_CONTACT;
  const mapsQuery = encodeURIComponent(
    `${CABINET_CONTACT.address.street} ${CABINET_CONTACT.address.postalCode} ${CABINET_CONTACT.address.city}`,
  );

  return (
    <MarketingSubpage hero={PAGE_HEROES.contact} breadcrumbs={[...BREADCRUMBS]} hideBilanCta>
      <MarketingPageStack className={marketingPageShellClass}>
        <div className={cn(marketingInnerClass, "max-w-6xl")}>
          <ContactForm initialSubject={initialSubject} />

          <section
            aria-label="Carte du cabinet"
            className={cn(marketingCardClass, "mt-10 overflow-hidden xl:mt-12")}
          >
            <div className={cn(CONTACT_MAP_ASPECT, "relative overflow-hidden")}>
              <ContactMap />
              <Link
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 z-10 inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#1f2a7c] shadow-[0_4px_20px_rgba(10,20,40,0.12)] ring-1 ring-neutral-200/90 transition-[background-color,box-shadow] duration-150 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/25 sm:bottom-5 sm:right-5"
              >
                Itinéraire
                <ArrowUpRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </section>

          <section
            aria-labelledby="cabinet-title"
            className={cn(marketingCardClass, "mt-6 overflow-hidden px-5 py-5 sm:px-6 sm:py-6")}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md ring-2 ring-[#1f2a7c]/10 sm:size-16">
                  <Image
                    src={ADVISOR_ROUND_AVATAR_IMAGE_URL}
                    alt="Philippe Lefèvre - conseiller en gestion de patrimoine"
                    fill
                    sizes="64px"
                    className="object-cover"
                    style={{ objectPosition: ADVISOR_ROUND_AVATAR_OBJECT_POSITION }}
                  />
                </div>
                <div className="min-w-0">
                  <h2 id="cabinet-title" className="text-base font-semibold tracking-tight text-[#1f2a7c] sm:text-lg">
                    Philippe Lefèvre
                  </h2>
                  <p className="mt-0.5 text-sm leading-snug text-[#1f2a7c]/60">
                    Conseiller en gestion de patrimoine · Sur rendez-vous
                  </p>
                </div>
              </div>

              <ul className="flex min-w-0 flex-1 flex-col gap-2.5 text-sm text-[#1f2a7c] sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5 sm:gap-y-2 lg:justify-center">
                <li>
                  <a
                    href={`tel:${phoneTel}`}
                    className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-medium transition-colors hover:text-[#1f2a7c]/80"
                  >
                    <Phone className="size-3.5 shrink-0 opacity-70" aria-hidden />
                    {phone}
                    <span className="font-normal text-[#1f2a7c]/55">· Du lundi au vendredi, 9h - 18h</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-1.5 font-medium break-all transition-colors hover:text-[#1f2a7c]/80"
                  >
                    <Mail className="size-3.5 shrink-0 opacity-70" aria-hidden />
                    {email}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 font-medium transition-colors hover:text-[#1f2a7c]/80"
                  >
                    <MapPin className="mt-0.5 size-3.5 shrink-0 opacity-70" aria-hidden />
                    {formatAddressLine()}
                  </a>
                </li>
                <li className="inline-flex items-center gap-1.5 text-[#1f2a7c]/70">
                  <Clock className="size-3.5 shrink-0 opacity-70" aria-hidden />
                  {openingHours.label}
                </li>
              </ul>

              <div className="flex min-w-0 shrink-0 flex-col gap-2.5 lg:max-w-[18rem] lg:items-end lg:text-right">
                <ul className="w-full space-y-1.5 rounded-xl border border-[#1f2a7c]/12 bg-[#1f2a7c]/[0.04] px-4 py-3.5 lg:w-auto lg:text-left">
                  {[
                    "Premier échange offert",
                    "Rendez-vous au cabinet ou à distance",
                    "Réponse personnalisée",
                    "Confidentialité",
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-2 text-[13px] font-medium text-[#1f2a7c]">
                      <Check className="size-3.5 shrink-0 text-[#1f2a7c]/60" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="text-xs leading-relaxed text-[#1f2a7c]/55">
                  Préparer votre échange ?{" "}
                  <Link
                    href={SIMULATEUR_HREF}
                    className="font-medium text-[#1f2a7c] underline decoration-[#1f2a7c]/25 underline-offset-2 hover:decoration-[#1f2a7c]/50"
                  >
                    Lancer le simulateur patrimonial
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </MarketingPageStack>
    </MarketingSubpage>
  );
}
