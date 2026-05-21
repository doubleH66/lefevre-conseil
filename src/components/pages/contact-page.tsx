"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SubpageShell } from "@/components/layout/subpage-shell";
import { ContactMiniFaq } from "@/components/contact/contact-mini-faq";
import {
  HeroCtaPrimaryButton,
  HeroCtaSecondaryButton,
  HeroCtaSecondaryLink,
} from "@/components/marketing/hero-site-cta";
import {
  CABINET_CONTACT,
  CONTACT_SUBJECTS,
  formatAddressLine,
} from "@/lib/content/site";
import { ADVISOR_ROUND_AVATAR_IMAGE_URL, ADVISOR_ROUND_AVATAR_OBJECT_POSITION } from "@/lib/site-brand";
import { cn } from "@/lib/utils";

const CONTACT_BREADCRUMBS = [
  { label: "Accueil", href: "/" },
  { label: "Contact" },
] as const;

const fieldClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-[#1f2a7c]/40 focus:ring-2 focus:ring-[#1f2a7c]/15";

const CONTACT_FORM_STEPS = [
  {
    short: "Coordonnées",
    title: "Vos coordonnées",
    hint: "Indiquez au moins une adresse e-mail valide pour que nous puissions vous répondre.",
  },
  {
    short: "Demande",
    title: "Objet et message",
    hint: "Précisez le sujet et décrivez votre demande. Les champs suivis d’une astérisque (*) sont obligatoires.",
  },
  {
    short: "Vérification",
    title: "Relisez et envoyez",
    hint: "Vérifiez les informations puis ouvrez votre messagerie pour finaliser l’envoi.",
  },
] as const;

const TOTAL_STEPS = CONTACT_FORM_STEPS.length;

function isValidEmail(value: string) {
  const v = value.trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/** Carte en bandeau paysage : largeur dominante, hauteur plafonnée pour rester proportionnelle. */
const CONTACT_MAP_ASPECT =
  "relative w-full aspect-[21/9] min-h-[10.5rem] max-h-[min(22rem,42vw)] sm:aspect-[2.35/1] lg:max-h-[20rem]";

const ContactMap = dynamic(() => import("@/components/contact/contact-map"), {
  ssr: false,
  loading: () => (
    <div
      className={cn(
        CONTACT_MAP_ASPECT,
        "flex items-center justify-center bg-neutral-50/90 text-sm text-neutral-500",
      )}
    >
      Chargement de la carte…
    </div>
  ),
});

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function ContactMultiStepForm({ cabinetEmail }: { cabinetEmail: string }) {
  const [step, setStep] = React.useState(0);
  const [values, setValues] = React.useState<ContactFormValues>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [stepError, setStepError] = React.useState<string | null>(null);

  const meta = CONTACT_FORM_STEPS[step];

  React.useEffect(() => {
    setStepError(null);
  }, [step]);

  const setField = (key: keyof ContactFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    if (step === 0) {
      if (!isValidEmail(values.email)) {
        setStepError("Veuillez saisir une adresse e-mail valide.");
        return;
      }
    }
    if (step === 1) {
      if (!values.message.trim()) {
        setStepError("Veuillez décrire votre demande dans le message.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goPrev = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const openMailto = () => {
    const name = values.name.trim();
    const fromEmail = values.email.trim();
    const subjectChoice = values.subject.trim();
    const message = values.message.trim();
    const subject = encodeURIComponent(
      `Contact site${subjectChoice ? ` - ${subjectChoice}` : ""}${name ? ` - ${name}` : ""}`,
    );
    const body = encodeURIComponent(
      [
        `Nom : ${name}`,
        `Email : ${fromEmail}`,
        subjectChoice ? `Objet : ${subjectChoice}` : "",
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    window.location.href = `mailto:${cabinetEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <div className="border-b border-neutral-100 bg-neutral-50/60 px-5 py-4 sm:px-6 sm:py-5">
        <h2 id="contact-form-title" className="text-sm font-semibold text-neutral-900">
          Votre message
        </h2>
        <p className="mt-1 text-xs text-neutral-500">{meta.hint}</p>
        <div className="mt-4" aria-label="Progression du formulaire">
          <ol className="flex gap-1.5 sm:gap-2">
            {CONTACT_FORM_STEPS.map((s, index) => {
              const done = index < step;
              const current = index === step;
              return (
                <li key={s.short} className="min-w-0 flex-1" aria-current={current ? "step" : undefined}>
                  <span className="sr-only">
                    {s.short}
                    {current ? " (étape en cours)" : done ? " (terminée)" : ""}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "block h-1 rounded-full transition-colors duration-200",
                      done || current ? "bg-[#1f2a7c]" : "bg-neutral-200",
                      current && "ring-2 ring-[#1f2a7c]/25 ring-offset-2 ring-offset-neutral-50/60",
                    )}
                  />
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
            Étape {step + 1} sur {TOTAL_STEPS} · {meta.short}
          </p>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-6 sm:py-7">
        <p
          className="mb-5 text-base font-medium text-neutral-900"
          aria-live="polite"
        >
          {meta.title}
        </p>

        {stepError ? (
          <p
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {stepError}
          </p>
        ) : null}

        {step === 0 ? (
          <div className="space-y-5" role="group" aria-labelledby="contact-form-title">
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 block text-sm font-medium text-neutral-800"
              >
                Prénom NOM
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(e) => setField("name", e.target.value)}
                className={fieldClass}
                placeholder="Votre nom complet"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 block text-sm font-medium text-neutral-800"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => setField("email", e.target.value)}
                className={fieldClass}
                placeholder="vous@exemple.fr"
              />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-5" role="group" aria-labelledby="contact-form-title">
            <div>
              <label
                htmlFor="contact-subject"
                className="mb-1.5 block text-sm font-medium text-neutral-800"
              >
                Objet
              </label>
              <select
                id="contact-subject"
                name="subject"
                className={fieldClass}
                value={values.subject}
                onChange={(e) => setField("subject", e.target.value)}
              >
                <option value="">- Sélectionnez -</option>
                {CONTACT_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="mb-1.5 block text-sm font-medium text-neutral-800"
              >
                Votre message <span className="text-red-600">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={values.message}
                onChange={(e) => setField("message", e.target.value)}
                className={`${fieldClass} min-h-[8.5rem] resize-y`}
                placeholder="Décrivez votre demande…"
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <dl
            className="space-y-4 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 sm:p-5"
            role="group"
            aria-labelledby="contact-form-title"
          >
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                Prénom NOM
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">{values.name.trim() || "-"}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                Email
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">{values.email.trim()}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                Objet
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">
                {values.subject.trim() || "Non précisé"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                Votre message
              </dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-neutral-900">
                {values.message.trim()}
              </dd>
            </div>
          </dl>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          {step > 0 ? (
            <HeroCtaSecondaryButton type="button" surface="light" onClick={goPrev}>
              Précédent
            </HeroCtaSecondaryButton>
          ) : null}
          {step < TOTAL_STEPS - 1 ? (
            <HeroCtaPrimaryButton type="button" onClick={goNext}>
              Suivant
            </HeroCtaPrimaryButton>
          ) : (
            <HeroCtaPrimaryButton type="button" onClick={openMailto}>
              Envoyer
            </HeroCtaPrimaryButton>
          )}
          <HeroCtaSecondaryLink href="/" surface="light">
            Retour à l’accueil
          </HeroCtaSecondaryLink>
        </div>
      </div>
    </>
  );
}

export function ContactPage() {
  const { phone, phoneTel, email } = CABINET_CONTACT;

  return (
    <SubpageShell breadcrumbs={[...CONTACT_BREADCRUMBS]}>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Contact
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Inscrivez vos coordonnées
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-[15px] sm:leading-relaxed">
            Nous nous chargeons de vous rappeler dans les{" "}
            <span className="font-semibold text-neutral-800">24 heures</span>. Une question sur votre
            patrimoine, votre fiscalité ou vos placements ? Notre équipe vous répond.
          </p>
        </header>

        {/* Bandeau coordonnées rapides */}
        <section
          aria-label="Coordonnées du cabinet"
          className="mx-auto mt-10 grid max-w-4xl auto-rows-fr gap-3 sm:grid-cols-3 sm:gap-4"
        >
          <QuickContactCard
            icon={<Phone className="size-4" aria-hidden />}
            label="Téléphone"
            value={phone}
            href={`tel:${phoneTel}`}
          />
          <QuickContactCard
            icon={<Mail className="size-4" aria-hidden />}
            label="E-mail"
            value={email}
            href={`mailto:${email}`}
          />
          <QuickContactCard
            icon={<MapPin className="size-4" aria-hidden />}
            label="Adresse"
            value={`${CABINET_CONTACT.address.postalCode} ${CABINET_CONTACT.address.city}`}
            sub={CABINET_CONTACT.address.street}
          />
        </section>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          <section
            aria-labelledby="contact-form-title"
            className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm"
          >
            <ContactMultiStepForm cabinetEmail={email} />

            <div className="border-t border-neutral-100 bg-neutral-50/50 px-5 py-4 sm:px-6">
              <p className="text-xs leading-relaxed text-neutral-500">
                À la dernière étape, en cliquant sur « Envoyer », votre messagerie s’ouvre avec un
                brouillon prêt à l’envoi vers{" "}
                <a
                  href={`mailto:${email}`}
                  className="font-medium text-[#1f2a7c] underline decoration-[#1f2a7c]/30 underline-offset-2"
                >
                  {email}
                </a>
                .
              </p>
            </div>
          </section>

          <div className="flex min-h-0 flex-col gap-6">
            <section
              aria-labelledby="contact-info-title"
              className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm"
            >
              <div className="border-b border-neutral-100 bg-neutral-50/60 px-5 py-4 sm:px-6 sm:py-5">
                <div className="flex items-center gap-4">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md ring-2 ring-[#1f2a7c]/12 sm:size-16">
                    <Image
                      src={ADVISOR_ROUND_AVATAR_IMAGE_URL}
                      alt={`${CABINET_CONTACT.name} — conseiller en gestion de patrimoine`}
                      fill
                      sizes="64px"
                      className="object-cover"
                      style={{ objectPosition: ADVISOR_ROUND_AVATAR_OBJECT_POSITION }}
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 id="contact-info-title" className="text-sm font-semibold text-neutral-900">
                      Le cabinet
                    </h2>
                    <p className="mt-1 text-xs text-neutral-500">Sur rendez-vous, à Perpignan.</p>
                  </div>
                </div>
              </div>
              <ul className="divide-y divide-neutral-100">
                <ContactInfoRow
                  icon={<Phone className="size-4" aria-hidden />}
                  label="Téléphone"
                  value={phone}
                  href={`tel:${phoneTel}`}
                />
                <ContactInfoRow
                  icon={<Mail className="size-4" aria-hidden />}
                  label="E-mail"
                  value={email}
                  href={`mailto:${email}`}
                />
                <ContactInfoRow
                  icon={<MapPin className="size-4" aria-hidden />}
                  label="Adresse"
                  value={formatAddressLine()}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${CABINET_CONTACT.address.street} ${CABINET_CONTACT.address.postalCode} ${CABINET_CONTACT.address.city}`,
                  )}`}
                  external
                />
                <ContactInfoRow
                  icon={<Clock className="size-4" aria-hidden />}
                  label="Horaires"
                  value={CABINET_CONTACT.openingHours.label}
                />
              </ul>
            </section>

            <ContactMiniFaq />
          </div>
        </div>

        <section
          aria-labelledby="contact-map-title"
          className="mt-6 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm lg:mt-8"
        >
          <div className="flex flex-col gap-3 border-b border-neutral-100 bg-neutral-50/60 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:py-5">
            <div className="min-w-0">
              <h2 id="contact-map-title" className="text-sm font-semibold text-neutral-900">
                Localisation
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500 sm:text-sm">
                {formatAddressLine()}.
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${CABINET_CONTACT.address.street} ${CABINET_CONTACT.address.postalCode} ${CABINET_CONTACT.address.city}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[#1f2a7c]/20 bg-white px-4 py-2 text-xs font-semibold text-[#1f2a7c] transition-colors hover:bg-[#1f2a7c]/[0.06] sm:text-sm"
            >
              Itinéraire
            </a>
          </div>
          <div className={cn(CONTACT_MAP_ASPECT, "overflow-hidden bg-neutral-100")}>
            <ContactMap />
          </div>
        </section>

      </main>
    </SubpageShell>
  );
}

function QuickContactCard({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  href?: string;
}) {
  const content = (
    <div className="flex h-full items-start gap-3 rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm transition-colors hover:border-[#1f2a7c]/30">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[#1f2a7c]/10 text-[#1f2a7c]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-medium text-neutral-900">{value}</p>
        {sub ? <p className="mt-0.5 text-xs text-neutral-500">{sub}</p> : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="group block h-full">
        {content}
      </a>
    );
  }
  return content;
}

function ContactInfoRow({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <li className="flex items-start gap-3 px-5 py-4 sm:px-6">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[#1f2a7c]/10 text-[#1f2a7c]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="mt-0.5 block break-words text-sm font-medium text-neutral-900 hover:text-[#1f2a7c]"
          >
            {value}
          </a>
        ) : (
          <p className="mt-0.5 text-sm font-medium text-neutral-900">{value}</p>
        )}
      </div>
    </li>
  );
}
