"use client";

import * as React from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { MarketingPageStack } from "@/components/marketing/marketing-section";
import {
  marketingCardClass,
  marketingInnerClass,
  marketingKickerClass,
  marketingPageShellClass,
  fieldClass,
} from "@/components/marketing/marketing-styles";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { CABINET_CONTACT, CONTACT_SUBJECTS, formatAddressLine } from "@/lib/content/site";
import { ADVISOR_ROUND_AVATAR_IMAGE_URL, ADVISOR_ROUND_AVATAR_OBJECT_POSITION } from "@/lib/site-brand";
import { BILAN_PATRIMOINE_HREF } from "@/lib/content/routes";
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
      className={cn(CONTACT_MAP_ASPECT, "flex items-center justify-center bg-neutral-100 text-sm text-neutral-400")}
    >
      Chargement…
    </div>
  ),
});

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

// ─── Stepper indicator ──────────────────────────────────────────────────────────
function StepDots({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Étape ${step} sur 2`}>
      {[1, 2].map((n) => (
        <div
          key={n}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            n === step ? "w-6 bg-[#1f2a7c]" : "w-1.5 bg-[#1f2a7c]/20",
          )}
        />
      ))}
      <span className="ml-1 text-[11px] font-semibold tabular-nums text-[#1f2a7c]/40">
        {step}&nbsp;/&nbsp;2
      </span>
    </div>
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

function ContactFormFromSearchParams({ email }: { email: string }) {
  const searchParams = useSearchParams();
  const initialSubject = resolveContactSubject(searchParams.get("objet"));
  return <ContactForm email={email} initialSubject={initialSubject} />;
}

function ContactForm({ email, initialSubject = "" }: { email: string; initialSubject?: string }) {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [dir, setDir] = React.useState(1);
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: initialSubject,
    message: "",
  });
  const [error, setError] = React.useState<string | null>(null);

  const set = (k: keyof typeof values, v: string) => {
    setValues((p) => ({ ...p, [k]: v }));
    setError(null);
  };

  const goNext = () => {
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

  const submit = () => {
    if (!values.message.trim()) {
      setError("Veuillez décrire votre demande.");
      return;
    }
    const subject = encodeURIComponent(
      `Contact site${values.subject ? ` — ${values.subject}` : ""}${values.name ? ` — ${values.name}` : ""}`,
    );
    const body = encodeURIComponent(
      [
        `Nom : ${values.name || "—"}`,
        `Email : ${values.email}`,
        values.phone ? `Tél : ${values.phone}` : "",
        values.subject ? `Objet : ${values.subject}` : "",
        "",
        values.message,
      ]
        .filter((l) => l !== undefined && l !== null)
        .join("\n"),
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <section aria-labelledby="form-title" className={cn(marketingCardClass, "overflow-hidden")}>
      {/* Header */}
      <div className="flex items-start justify-between border-b border-neutral-100 px-6 py-5 sm:px-8 sm:py-6">
        <div>
          <p className={marketingKickerClass}>Écrivez-nous</p>
          <h2 id="form-title" className="mt-2 text-balance text-[clamp(1.2rem,2.8vw,1.65rem)] font-normal tracking-[-0.03em] text-[#1f2a7c]">
            {step === 1 ? "Vos coordonnées" : "Votre message"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1f2a7c]/65">
            Nous vous répondons sous{" "}
            <span className="font-semibold text-[#1f2a7c]">24 heures</span>, en cabinet ou à distance.
          </p>
        </div>
        <div className="mt-1 shrink-0">
          <StepDots step={step} />
        </div>
      </div>

      {/* Steps */}
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
              className="space-y-4 px-6 py-6 sm:px-8 sm:py-7"
            >
              {error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
                  {error}
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium text-[#1f2a7c]/80">
                    Prénom NOM
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jean Dupont"
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="c-phone" className="mb-1.5 block text-sm font-medium text-[#1f2a7c]/80">
                    Téléphone{" "}
                    <span className="font-normal text-[#1f2a7c]/45">(facultatif)</span>
                  </label>
                  <input
                    id="c-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="06 XX XX XX XX"
                    value={values.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium text-[#1f2a7c]/80">
                  Adresse e-mail <span className="text-red-500">*</span>
                </label>
                <input
                  id="c-email"
                  type="email"
                  autoComplete="email"
                  placeholder="vous@exemple.fr"
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && goNext()}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="c-subject" className="mb-1.5 block text-sm font-medium text-[#1f2a7c]/80">
                  Objet
                </label>
                <select
                  id="c-subject"
                  value={values.subject}
                  onChange={(e) => set("subject", e.target.value)}
                  className={fieldClass}
                >
                  <option value="">— Sélectionnez —</option>
                  {CONTACT_SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={goNext}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1f2a7c] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#182266] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/40 focus-visible:ring-offset-2 sm:w-auto"
              >
                Suivant
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </button>
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
              className="space-y-4 px-6 py-6 sm:px-8 sm:py-7"
            >
              {/* Récap step 1 */}
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#1f2a7c]/10 bg-[#1f2a7c]/[0.03] px-4 py-3">
                <span className="min-w-0 truncate text-sm font-medium text-[#1f2a7c]">
                  {values.name || "—"}
                </span>
                <span className="text-[#1f2a7c]/30">·</span>
                <span className="min-w-0 truncate text-sm text-[#1f2a7c]/70">{values.email}</span>
                {values.subject && (
                  <>
                    <span className="text-[#1f2a7c]/30">·</span>
                    <span className="min-w-0 truncate text-sm text-[#1f2a7c]/70">{values.subject}</span>
                  </>
                )}
                <button
                  type="button"
                  onClick={goBack}
                  className="ml-auto shrink-0 text-[11px] font-semibold text-[#1f2a7c]/55 underline-offset-2 hover:text-[#1f2a7c] hover:underline"
                >
                  Modifier
                </button>
              </div>

              {error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
                  {error}
                </p>
              )}

              <div>
                <label htmlFor="c-message" className="mb-1.5 block text-sm font-medium text-[#1f2a7c]/80">
                  Votre message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="c-message"
                  rows={6}
                  autoFocus
                  placeholder="Décrivez votre demande…"
                  value={values.message}
                  onChange={(e) => set("message", e.target.value)}
                  className={cn(fieldClass, "min-h-[10rem] resize-y")}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex h-[2.625rem] items-center justify-center gap-1.5 rounded-full border border-[#1f2a7c]/15 px-4 text-sm font-semibold text-[#1f2a7c] transition-colors hover:bg-[#1f2a7c]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/30"
                  aria-label="Retour à l'étape précédente"
                >
                  <ArrowLeft aria-hidden className="size-4" />
                  Retour
                </button>
                <button
                  type="button"
                  onClick={submit}
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1f2a7c] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#182266] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/40 focus-visible:ring-offset-2 sm:flex-none"
                >
                  Envoyer
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-neutral-100 bg-[#1f2a7c]/[0.03] px-6 py-3.5 sm:px-8">
        <p className="text-xs leading-relaxed text-[#1f2a7c]/55">
          En cliquant sur « Envoyer », votre messagerie s'ouvre avec un brouillon pré-rempli à destination de{" "}
          <a
            href={`mailto:${email}`}
            className="font-medium text-[#1f2a7c] underline decoration-[#1f2a7c]/25 underline-offset-2"
          >
            {email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  children,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
}) {
  const body = (
    <div className="flex items-start gap-3.5 px-5 py-4 sm:px-6">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-[#1f2a7c]/8 text-[#1f2a7c]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1f2a7c]/45">{label}</p>
        <div className="mt-0.5 text-sm font-medium text-[#1f2a7c] break-words">{children}</div>
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
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-8">
            <Suspense
              fallback={
                <div className="px-6 py-12 text-center text-sm text-[#1f2a7c]/55 sm:px-8">Chargement du formulaire…</div>
              }
            >
              <ContactFormFromSearchParams email={email} />
            </Suspense>

            <div className="flex flex-col gap-5">
              <section
                aria-labelledby="cabinet-title"
                className={cn(marketingCardClass, "overflow-hidden")}
              >
                <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-5 sm:px-6 sm:py-6">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md ring-2 ring-[#1f2a7c]/10 sm:size-[4.5rem]">
                    <Image
                      src={ADVISOR_ROUND_AVATAR_IMAGE_URL}
                      alt="Philippe Lefèvre — conseiller en gestion de patrimoine"
                      fill
                      sizes="72px"
                      className="object-cover"
                      style={{ objectPosition: ADVISOR_ROUND_AVATAR_OBJECT_POSITION }}
                    />
                  </div>
                  <div>
                    <p className={marketingKickerClass}>Votre interlocuteur</p>
                    <h2 id="cabinet-title" className="mt-1 text-lg font-semibold tracking-tight text-[#1f2a7c]">
                      Philippe Lefèvre
                    </h2>
                    <p className="mt-0.5 text-sm text-[#1f2a7c]/60">Conseil indépendant · Sur rendez-vous</p>
                  </div>
                </div>

                <ul>
                  <InfoRow icon={<Phone className="size-4" />} label="Téléphone" href={`tel:${phoneTel}`}>
                    {phone}
                  </InfoRow>
                  <InfoRow icon={<Mail className="size-4" />} label="E-mail" href={`mailto:${email}`}>
                    {email}
                  </InfoRow>
                  <InfoRow
                    icon={<MapPin className="size-4" />}
                    label="Adresse"
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    external
                  >
                    {formatAddressLine()}
                  </InfoRow>
                  <InfoRow icon={<Clock className="size-4" />} label="Horaires">
                    {CABINET_CONTACT.openingHours.label}
                  </InfoRow>
                </ul>
              </section>

              <div className="rounded-2xl border border-[#1f2a7c]/12 bg-[#1f2a7c] px-5 py-5 text-white shadow-sm sm:px-6 sm:py-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">Bilan patrimonial</p>
                <p className="mt-2 text-balance text-[15px] font-semibold leading-snug sm:text-base">
                  Réaliser mon bilan patrimonial
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Analyse complète, indépendante, sans engagement — en cabinet ou à distance.
                </p>
                <div className="mt-5">
                  <CtaPrimaryLink
                    href={BILAN_PATRIMOINE_HREF}
                    className="!h-11 !min-h-11 w-full !min-w-0 sm:w-auto"
                  >
                    Démarrer mon bilan
                    <ArrowUpRight aria-hidden className="size-4 shrink-0" />
                  </CtaPrimaryLink>
                </div>
              </div>
            </div>
          </div>

          <section
            aria-label="Carte du cabinet"
            className={cn(marketingCardClass, "mt-8 overflow-hidden xl:mt-10")}
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
