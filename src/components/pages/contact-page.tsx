"use client";

import * as React from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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
import { CABINET_CONTACT, CONTACT_SUBJECTS, formatAddressLine } from "@/lib/content/site";
import { ADVISOR_ROUND_AVATAR_IMAGE_URL, ADVISOR_ROUND_AVATAR_OBJECT_POSITION } from "@/lib/site-brand";
import { DEMANDE_HREF, ROUTES } from "@/lib/content/routes";
import { splitFullName, submitSiteLead } from "@/lib/site-lead/submit-site-lead";
import { CtaPrimaryLink } from "@/components/ui/cta-link";
import { cn } from "@/lib/utils";

const BREADCRUMBS = [
  { label: "Accueil", href: "/" },
  { label: "Contact" },
] as const;

const CONTACT_MAP_ASPECT =
  "relative w-full aspect-[21/9] min-h-[11rem] max-h-[min(24rem,44vw)] sm:aspect-[2.35/1] lg:max-h-[22rem]";

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

const FORM_STEPS = [
  { n: 1 as const, label: "Coordonnées" },
  { n: 2 as const, label: "Message" },
];

function ContactFormHeader({ step }: { step: 1 | 2 }) {
  return (
    <div className="relative overflow-hidden border-b border-neutral-100 bg-gradient-to-br from-[#f3f5fb] via-white to-white px-6 py-8 sm:px-10 sm:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#1f2a7c]/[0.04] blur-2xl"
      />
      <ol className="relative flex items-center gap-2 sm:gap-3" aria-label="Étapes du formulaire">
        {FORM_STEPS.map((item, index) => {
          const active = step === item.n;
          const done = step > item.n;
          return (
            <React.Fragment key={item.n}>
              {index > 0 ? (
                <li aria-hidden className="h-px w-6 shrink-0 bg-neutral-200 sm:w-10" />
              ) : null}
              <li
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold tracking-[-0.01em] transition-colors duration-200 sm:px-3.5 sm:text-[13px]",
                  active
                    ? "border-[#1f2a7c]/20 bg-[#1f2a7c] text-white shadow-[0_8px_24px_-12px_rgba(31,42,124,0.55)]"
                    : done
                      ? "border-[#1f2a7c]/15 bg-[#1f2a7c]/[0.06] text-[#1f2a7c]"
                      : "border-neutral-200/90 bg-white text-[#1f2a7c]/45",
                )}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full text-[10px] font-bold",
                    active ? "bg-white/15 text-white" : done ? "bg-[#1f2a7c] text-white" : "bg-neutral-100 text-[#1f2a7c]/45",
                  )}
                >
                  {done ? <Check className="size-3" aria-hidden /> : item.n}
                </span>
                {item.label}
              </li>
            </React.Fragment>
          );
        })}
      </ol>

      <div className="relative mt-7 space-y-2.5 sm:mt-8">
        <h2 id="form-title" className="text-balance text-[clamp(1.45rem,3.2vw,2rem)] font-normal tracking-[-0.035em] text-[#1f2a7c]">
          {step === 1 ? "Parlons de votre projet" : "Quelques mots sur votre demande"}
        </h2>
        <p className="max-w-xl text-[15px] leading-relaxed text-[#1f2a7c]/60 sm:text-base sm:leading-relaxed">
          {step === 1
            ? "Laissez vos coordonnées : Philippe Lefèvre ou son équipe vous répond sous 24 h ouvrées."
            : "Précisez votre situation ou votre question. Toutes les informations restent confidentielles."}
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
        {optional ? <span className="ml-1.5 font-normal text-[#1f2a7c]/40">facultatif</span> : null}
      </label>
      {children}
    </div>
  );
}

function SubjectPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <fieldset>
      <legend className={contactLabelClass}>Sujet de votre demande</legend>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {CONTACT_SUBJECTS.map((subject) => {
          const selected = value === subject;
          return (
            <button
              key={subject}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? "" : subject)}
              className={cn(
                "group relative flex min-h-[3rem] items-center rounded-2xl border px-4 py-3 text-left text-[14px] font-medium leading-snug tracking-[-0.01em] transition-all duration-200",
                selected
                  ? "border-[#1f2a7c] bg-[#1f2a7c]/[0.06] text-[#1f2a7c] shadow-[0_0_0_1px_rgba(31,42,124,0.1),0_10px_24px_-18px_rgba(31,42,124,0.45)]"
                  : "border-neutral-200/90 bg-[#fafbfd] text-[#1f2a7c]/72 hover:border-neutral-300 hover:bg-white",
              )}
            >
              <span className="pr-7">{subject}</span>
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
const slideVariants = {
  enter: (dir: number) => ({ x: dir * 36, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: -dir * 36, opacity: 0 }),
};

function resolveContactSubject(raw: string | null): string {
  if (!raw) return "";
  const decoded = decodeURIComponent(raw).trim();
  return (CONTACT_SUBJECTS as readonly string[]).includes(decoded) ? decoded : "";
}

function ContactFormFromSearchParams() {
  const searchParams = useSearchParams();
  const initialSubject = resolveContactSubject(searchParams.get("objet"));
  return <ContactForm initialSubject={initialSubject} />;
}

function ContactForm({ initialSubject = "" }: { initialSubject?: string }) {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [dir, setDir] = React.useState(1);
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: initialSubject,
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

  const canContinue = values.name.trim().length > 0 && isValidEmail(values.email);

  const goNext = () => {
    if (!values.name.trim()) {
      setError("Veuillez indiquer votre nom.");
      return;
    }
    if (!isValidEmail(values.email)) {
      setError("Veuillez saisir une adresse e-mail valide.");
      return;
    }
    setError(null);
    setDir(1);
    setStep(2);
  };

  const goBack = () => {
    setError(null);
    setDir(-1);
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

    const { firstName, lastName } = splitFullName(values.name);
    const result = await submitSiteLead({
      firstName,
      lastName,
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      requestType: values.subject.trim() || "Contact site",
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
    <section aria-labelledby="form-title" className={cn(marketingCardClass, "overflow-hidden shadow-[0_18px_50px_-28px_rgba(31,42,124,0.28)]")}>
      <ContactFormHeader step={step} />

      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          {step === 1 ? (
            <motion.div
              key="step1"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.32, 0, 0.18, 1] }}
              className="space-y-7 px-6 py-8 sm:space-y-8 sm:px-10 sm:py-10"
            >
              {error ? <FormAlert>{error}</FormAlert> : null}

              <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
                <FormField id="c-name" label="Nom complet" required>
                  <input
                    id="c-name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Ex. Jean Dupont"
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
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

              <SubjectPicker value={values.subject} onChange={(subject) => set("subject", subject)} />

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
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.32, 0, 0.18, 1] }}
              className="space-y-7 px-6 py-8 sm:space-y-8 sm:px-10 sm:py-10"
            >
              <div className="rounded-2xl border border-[#1f2a7c]/10 bg-[#1f2a7c]/[0.03] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    <p className="text-[13px] font-semibold text-[#1f2a7c]/45">Vos coordonnées</p>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-[15px] leading-relaxed text-[#1f2a7c]">
                      <span className="font-medium">{values.name}</span>
                      <span className="text-[#1f2a7c]/25">·</span>
                      <span className="text-[#1f2a7c]/75">{values.email}</span>
                      {values.phone ? (
                        <>
                          <span className="text-[#1f2a7c]/25">·</span>
                          <span className="text-[#1f2a7c]/75">{values.phone}</span>
                        </>
                      ) : null}
                    </div>
                    {values.subject ? (
                      <p className="inline-flex items-center rounded-full border border-[#1f2a7c]/12 bg-white px-3 py-1 text-[13px] font-medium text-[#1f2a7c]">
                        {values.subject}
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
                  {loading ? "Envoi en cours…" : "Envoyer le message"}
                  {!loading ? (
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  ) : null}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  children,
  href,
  external,
  meta,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  meta?: string;
}) {
  const body = (
    <div className="flex items-start gap-4 px-6 py-5 sm:px-7 sm:py-5">
      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-[#1f2a7c]/8 text-[#1f2a7c]">
        {icon}
      </span>
      <div className="min-w-0 pt-0.5">
        <div className="text-[15px] font-medium leading-relaxed text-[#1f2a7c] break-words">{children}</div>
        {meta ? <p className="mt-1 text-sm leading-relaxed text-[#1f2a7c]/55">{meta}</p> : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <li className="border-b border-neutral-100/90 last:border-b-0 transition-colors hover:bg-[#1f2a7c]/[0.02]">
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {body}
        </a>
      </li>
    );
  }
  return <li className="border-b border-neutral-100/90 last:border-b-0">{body}</li>;
}

export function ContactPage() {
  const { phone, phoneTel, email } = CABINET_CONTACT;
  const mapsQuery = encodeURIComponent(
    `${CABINET_CONTACT.address.street} ${CABINET_CONTACT.address.postalCode} ${CABINET_CONTACT.address.city}`,
  );

  return (
    <MarketingSubpage hero={PAGE_HEROES.contact} breadcrumbs={[...BREADCRUMBS]} hideBilanCta>
      <MarketingPageStack className={marketingPageShellClass}>
        <div className={cn(marketingInnerClass, "max-w-6xl")}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start lg:gap-12 xl:gap-14">
            <Suspense
              fallback={
                <div className="px-8 py-16 text-center text-sm text-[#1f2a7c]/55 sm:px-10">Chargement du formulaire…</div>
              }
            >
              <ContactFormFromSearchParams />
            </Suspense>

            <div className="flex flex-col gap-8">
              <section
                aria-labelledby="cabinet-title"
                className={cn(marketingCardClass, "overflow-hidden")}
              >
                <div className="flex items-center gap-5 border-b border-neutral-100 px-6 py-7 sm:px-7 sm:py-8">
                  <div className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md ring-2 ring-[#1f2a7c]/10 sm:size-20">
                    <Image
                      src={ADVISOR_ROUND_AVATAR_IMAGE_URL}
                      alt="Philippe Lefèvre — conseiller en gestion de patrimoine"
                      fill
                      sizes="80px"
                      className="object-cover"
                      style={{ objectPosition: ADVISOR_ROUND_AVATAR_OBJECT_POSITION }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 id="cabinet-title" className="text-xl font-semibold tracking-tight text-[#1f2a7c]">
                      Philippe Lefèvre
                    </h2>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-[#1f2a7c]/60">
                      Conseiller en gestion de patrimoine · Sur rendez-vous
                    </p>
                  </div>
                </div>

                <ul>
                  <InfoRow icon={<Phone className="size-4" />} href={`tel:${phoneTel}`} meta="Du lundi au vendredi, 9h – 18h">
                    {phone}
                  </InfoRow>
                  <InfoRow icon={<Mail className="size-4" />} href={`mailto:${email}`}>
                    {email}
                  </InfoRow>
                  <InfoRow
                    icon={<MapPin className="size-4" />}
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    external
                  >
                    {formatAddressLine()}
                  </InfoRow>
                  <InfoRow icon={<Clock className="size-4" />}>
                    {CABINET_CONTACT.openingHours.label}
                  </InfoRow>
                </ul>
              </section>

              <div className="rounded-2xl border border-[#1f2a7c]/12 bg-[#1f2a7c] px-6 py-7 text-white shadow-sm sm:px-7 sm:py-8">
                <p className="text-lg font-semibold leading-snug tracking-tight">
                  Bilan patrimonial gratuit
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/75">
                  Analyse complète et indépendante, sans engagement — en cabinet ou à distance.
                </p>
                <div className="mt-6">
                  <CtaPrimaryLink href={ROUTES.bilanPatrimonial} className="!h-11 !min-h-11 w-full !min-w-0 sm:w-auto">
                    Réaliser mon bilan
                    <ArrowUpRight aria-hidden className="size-4 shrink-0" />
                  </CtaPrimaryLink>
                </div>
              </div>

              <p className="px-1 text-sm leading-relaxed text-[#1f2a7c]/55">
                Pour une demande détaillée (situation patrimoniale, objectifs, pièces jointes),{" "}
                <Link href={DEMANDE_HREF} className="font-medium text-[#1f2a7c] underline decoration-[#1f2a7c]/25 underline-offset-2 hover:decoration-[#1f2a7c]/50">
                  utilisez le formulaire Demande
                </Link>
                .
              </p>
            </div>
          </div>

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
        </div>
      </MarketingPageStack>
    </MarketingSubpage>
  );
}
