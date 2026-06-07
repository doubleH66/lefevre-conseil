import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BadgeCheck,
  GraduationCap,
  Lock,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Video,
} from "lucide-react";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { HighlightReveal } from "@/components/ui/highlight-reveal";
import { FaqSectionClient } from "@/components/client/faq-section-client";
import {
  LANDING_SECTION_INNER_Y,
  LANDING_SECTION_INSET,
  LANDING_SECTION_SHELL,
} from "@/lib/content/landing-layout";
import { bilanCtaSectionClassName } from "@/components/landing/bilan-cta-section";
import { CtaBand } from "@/components/landing/cta-band";
import { PartnersStrip } from "@/components/landing/partners-strip";
import { type FaqItem } from "@/components/client/faq-accordion";
import { FAQPageJsonLd } from "@/components/seo/page-jsonld";
import {
  AboutExperienceTimeline,
  type AboutTimelineMilestone,
} from "@/components/client/about-experience-timeline";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import {
  CONTACT_HREF,
  NOTRE_CABINET_HREF,
  ROUTES,
} from "@/lib/content/routes";
import {
  CABINET_CONTACT,
  CABINET_PORTRAIT_IMAGE_URL,
  CABINET_PORTRAIT_OBJECT_POSITION,
  formatAddressLine,
} from "@/lib/content/site";
import { cn } from "@/lib/utils";

const aboutProse = "text-[#1f2a7c]/78 max-lg:text-[#1f2a7c]/72 lg:text-[#1f2a7c]/88";

const sectionShell = "mx-2.5 lg:mx-4";
const sectionInner = "px-4 py-12 sm:px-7 sm:py-14 xl:px-11 xl:py-16";
const kickerClass =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1f2a7c]/70";
const sectionTitleClass =
  "mt-3 text-balance text-[clamp(1.45rem,3vw,2.25rem)] font-normal leading-[1.1] tracking-[-0.03em] text-[#1f2a7c]";

function highlightPillClassName() {
  return "rounded-lg px-1.5 pb-0.5";
}

const HERO_REASSURANCES: readonly { icon: LucideIcon; label: string }[] = [
  { icon: BadgeCheck, label: "Premier échange offert" },
  { icon: MapPin, label: "Sur rendez-vous à Perpignan" },
  { icon: Video, label: "Possible à distance" },
];

const METHOD_STEPS: readonly { step: string; title: string; text: string }[] = [
  {
    step: "01",
    title: "Comprendre votre situation",
    text: "Nous faisons le point sur votre situation personnelle, familiale, professionnelle et fiscale.",
  },
  {
    step: "02",
    title: "Identifier vos priorités",
    text: "Retraite, transmission, épargne, protection, fiscalité ou projet d’investissement : nous clarifions vos objectifs.",
  },
  {
    step: "03",
    title: "Étudier les solutions possibles",
    text: "Le cabinet analyse les solutions adaptées à votre profil, votre horizon, votre tolérance au risque et vos contraintes.",
  },
  {
    step: "04",
    title: "Suivre dans le temps",
    text: "Votre patrimoine évolue. Le suivi permet d’ajuster les décisions selon vos projets, votre situation et le cadre réglementaire.",
  },
];

const VALUES: readonly { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Sparkles,
    title: "Clarté",
    text: "Des explications simples pour comprendre les enjeux avant de décider.",
  },
  {
    icon: GraduationCap,
    title: "Pédagogie",
    text: "Un accompagnement pensé pour rendre les sujets patrimoniaux plus accessibles.",
  },
  {
    icon: Lock,
    title: "Confidentialité",
    text: "Une relation de confiance, avec une attention particulière portée à vos informations personnelles.",
  },
  {
    icon: RefreshCw,
    title: "Suivi",
    text: "Une stratégie patrimoniale doit évoluer avec votre situation, vos projets et le cadre fiscal.",
  },
];

const PROOF_STATS: readonly { value: string; label: string }[] = [
  { value: "19+", label: "années d’expertise" },
  { value: "100+", label: "clients satisfaits" },
  { value: "40+", label: "partenaires" },
  { value: "5,0", label: "Google" },
];

/**
 * Frise : on conserve uniquement des dates réelles déjà présentes sur le site
 * (aucune date inventée), resserrées à 6 jalons pour la lisibilité.
 */
const TIMELINE_MILESTONES: readonly AboutTimelineMilestone[] = [
  {
    year: "2007",
    title: "Premières années d’accompagnement",
    description:
      "Débuts en tant que conseiller indépendant en immobilier d’investissement au sein d’un réseau national : montage de dossiers, analyse de rendement et accompagnement des premiers investisseurs.",
  },
  {
    year: "2010",
    title: "Vers une indépendance complète",
    description:
      "Passage à une indépendance complète, en binôme avec un CGPI et au sein de la Chambre des indépendants du patrimoine : le conseil s’élargit déjà au-delà du seul immobilier.",
  },
  {
    year: "2013",
    title: "Assurance-vie, prévoyance et retraite",
    description:
      "Ouverture vers l’assurance-vie, la prévoyance et les contrats collectifs : des réponses structurées aux enjeux de revenus, de protection sociale et de retraite.",
  },
  {
    year: "2018",
    title: "Épargne et placements renforcés",
    description:
      "Renforcement de l’offre épargne et placements en partenariat avec des groupes historiques : diversification des supports, exigence de transparence et de suivi.",
  },
  {
    year: "2022",
    title: "Accompagnement des dirigeants",
    description:
      "Montée en puissance sur la prévoyance et les enveloppes de placement, en prolongement de l’immobilier patrimonial et de l’optimisation fiscale, avec un conseil dédié aux dirigeants.",
  },
  {
    year: "2024",
    title: "Lefèvre Conseil à Perpignan",
    description:
      "Constitution de la SASU Lefèvre Conseil : un cadre clarifié et une offre patrimoniale intégrée pour accompagner particuliers, dirigeants et professions libérales, au cabinet ou à distance.",
  },
];

export const CABINET_FAQ: readonly FaqItem[] = [
  {
    q: "Où est situé Lefèvre Conseil ?",
    a: `Lefèvre Conseil est basé au ${formatAddressLine()}. Les rendez-vous se font sur place, par téléphone ou en visioconférence.`,
  },
  {
    q: "Qui accompagne le cabinet ?",
    a: "Le cabinet accompagne les particuliers, dirigeants, indépendants et professions libérales sur leurs sujets patrimoniaux : placements, retraite, transmission, prévoyance et fiscalité patrimoniale.",
  },
  {
    q: "Comment se déroule un premier échange ?",
    a: "Le premier échange permet de comprendre votre situation, vos objectifs et les sujets à approfondir. Il est confidentiel, clair et sans engagement.",
  },
  {
    q: "Lefèvre Conseil accompagne-t-il à distance ?",
    a: "Oui. Le cabinet accompagne ses clients au cabinet à Perpignan, par téléphone ou en visioconférence, en Occitanie et partout en France.",
  },
];

const CONTACT_CARD_ITEMS: readonly {
  label: string;
  value: string;
  href?: string;
}[] = [
  {
    label: "Adresse",
    value: `${CABINET_CONTACT.address.street}, ${CABINET_CONTACT.address.postalCode} ${CABINET_CONTACT.address.city}`,
  },
  {
    label: "Horaires",
    value: CABINET_CONTACT.openingHours.label,
  },
  {
    label: "Téléphone",
    value: CABINET_CONTACT.phone,
    href: `tel:${CABINET_CONTACT.phoneTel}`,
  },
  {
    label: "Email",
    value: CABINET_CONTACT.email,
    href: `mailto:${CABINET_CONTACT.email}`,
  },
];

const LEGAL_LINKS: readonly { label: string; href: string }[] = [
  { label: "Mentions légales", href: ROUTES.mentionsLegales },
  { label: "Réclamations clients", href: ROUTES.reclamations },
  { label: "Confidentialité", href: ROUTES.confidentialite },
];

export function NotreCabinetPage() {
  return (
    <MarketingSubpage
      hero={PAGE_HEROES.notreCabinet}
      hideBilanCta
      heroCtas={{
        primary: { href: CONTACT_HREF, label: "Prendre rendez-vous" },
      }}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Notre cabinet" },
      ]}
    >
      <FAQPageJsonLd items={CABINET_FAQ} path={NOTRE_CABINET_HREF} />

      <main className="flex-1 overflow-x-clip bg-white pb-6 text-neutral-950 sm:pb-10">
        {/* Réassurances sous le hero */}
        <div className={cn(sectionShell, "mt-4")}>
          <ul className="grid gap-2.5 sm:grid-cols-3">
            {HERO_REASSURANCES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-[#1f2a7c]/10 bg-[#f5f6fb] px-4 py-3"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#1f2a7c] shadow-sm">
                  <Icon className="size-[1.125rem]" aria-hidden strokeWidth={1.85} />
                </span>
                <span className="text-sm font-medium text-[#1f2a7c]">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Présentation du cabinet */}
        <section
          id="presentation"
          aria-labelledby="presentation-title"
          className={cn(sectionShell, "scroll-mt-28")}
        >
          <div className={cn(sectionInner)}>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <h2 id="presentation-title" className={cn(sectionTitleClass, "mt-0")}>
                  Un accompagnement patrimonial clair, humain et suivi dans le temps
                </h2>
                <div
                  className={cn(
                    "mt-5 space-y-4 text-[15px] leading-relaxed sm:text-base",
                    aboutProse,
                  )}
                >
                  <p>
                    Basé à{" "}
                    <HighlightReveal variant="light" className={highlightPillClassName()}>
                      Perpignan
                    </HighlightReveal>
                    , Lefèvre Conseil accompagne ses clients sur les grands sujets de la gestion de
                    patrimoine : épargne, placements, retraite, transmission, prévoyance, assurance
                    emprunteur et fiscalité patrimoniale.
                  </p>
                  <p>
                    L’objectif du cabinet n’est pas de proposer une solution standardisée, mais de
                    comprendre votre situation, vos contraintes et vos projets afin de construire une{" "}
                    <HighlightReveal
                      variant="light"
                      delay="hero"
                      className={highlightPillClassName()}
                    >
                      stratégie adaptée
                    </HighlightReveal>
                    .
                  </p>
                  <p>
                    Chaque accompagnement repose sur une relation de confiance, une pédagogie claire et
                    un{" "}
                    <HighlightReveal variant="light" className={highlightPillClassName()}>
                      suivi dans la durée
                    </HighlightReveal>
                    .
                  </p>
                </div>
              </div>

              <aside className="rounded-2xl border border-[#1f2a7c]/8 bg-white p-5 sm:p-6">
                <h3 className="text-balance text-[clamp(1.125rem,2vw,1.35rem)] font-normal leading-[1.1] tracking-[-0.03em] text-[#1f2a7c]">
                  Coordonnées
                </h3>
                <ul className="mt-4 divide-y divide-[#1f2a7c]/8 border-y border-[#1f2a7c]/8">
                  {CONTACT_CARD_ITEMS.map(({ label, value, href }) => (
                    <li key={label} className="py-4">
                      <p className="text-[15px] font-medium leading-snug tracking-[-0.018em] text-[#1f2a7c]/86">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="mt-1 block text-sm leading-relaxed text-[#1f2a7c]/70 underline-offset-4 hover:text-[#1f2a7c] hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm leading-relaxed text-[#1f2a7c]/70">{value}</p>
                      )}
                    </li>
                  ))}
                </ul>
                <Link
                  href={CONTACT_HREF}
                  className="group mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#1f2a7c]/12 bg-white px-4 py-2.5 text-sm font-semibold text-[#1f2a7c]/78 shadow-sm transition-[color,box-shadow,border-color] hover:border-[#1f2a7c]/20 hover:text-[#1f2a7c] hover:shadow-md"
                >
                  Prendre rendez-vous
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </aside>
            </div>
          </div>
        </section>

        {/* 3. Philippe Lefèvre */}
        <section
          id="philippe-lefevre"
          aria-labelledby="philippe-title"
          className={cn(sectionShell, "scroll-mt-28")}
        >
          <div className="overflow-hidden rounded-[1.75rem] border border-[#1f2a7c]/12 bg-[#f5f6fb] lg:rounded-[2rem]">
            <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
              <div className="order-2 p-4 sm:p-5 lg:order-1 xl:p-6">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-neutral-100 sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:rounded-[1.75rem]">
                  <Image
                    src={CABINET_PORTRAIT_IMAGE_URL}
                    alt="Philippe Lefèvre, conseiller patrimonial à Perpignan"
                    fill
                    className="object-cover"
                    style={{ objectPosition: CABINET_PORTRAIT_OBJECT_POSITION }}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f2a7c]/25 via-transparent to-transparent" />
                </div>
              </div>

              <div className="order-1 px-4 py-10 sm:px-7 sm:py-12 lg:order-2 lg:py-14 xl:px-11 xl:py-16">
                <p className={kickerClass}>Votre interlocuteur</p>
                <h2 id="philippe-title" className={sectionTitleClass}>
                  Philippe Lefèvre, votre interlocuteur patrimonial
                </h2>
                <div
                  className={cn(
                    "mt-5 space-y-4 text-[15px] leading-relaxed sm:text-base",
                    aboutProse,
                  )}
                >
                  <p>
                    L’accompagnement patrimonial repose avant tout sur{" "}
                    <HighlightReveal variant="light" className={highlightPillClassName()}>
                      l’écoute et la confiance
                    </HighlightReveal>
                    . Philippe Lefèvre prend le temps de comprendre votre situation, vos objectifs et
                    vos priorités avant de vous orienter vers des solutions adaptées.
                  </p>
                  <p>
                    Son rôle est de rendre les sujets patrimoniaux plus lisibles : placements,{" "}
                    <HighlightReveal
                      variant="light"
                      delay="hero"
                      className={highlightPillClassName()}
                    >
                      retraite
                    </HighlightReveal>
                    ,{" "}
                    <HighlightReveal variant="light" className={highlightPillClassName()}>
                      transmission
                    </HighlightReveal>
                    , protection familiale, fiscalité ou organisation globale du patrimoine.
                  </p>
                  <p>
                    L’approche du cabinet est volontairement pédagogique : expliquer les options,
                    présenter les avantages et les limites, puis accompagner les décisions dans la
                    durée.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Frise chronologique */}
        <section
          id="parcours"
          aria-labelledby="parcours-title"
          className={cn(sectionShell, "scroll-mt-28")}
        >
          <div className="px-4 pt-12 sm:px-7 sm:pt-14 xl:px-11 xl:pt-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className={kickerClass}>Notre parcours</p>
              <h2 id="parcours-title" className={sectionTitleClass}>
                Un parcours construit dans la durée
              </h2>
              <p
                className={cn(
                  "mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed sm:text-base",
                  aboutProse,
                )}
              >
                L’expérience du cabinet s’inscrit dans une logique de suivi, de proximité et
                d’accompagnement patrimonial sur le long terme.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <AboutExperienceTimeline
              milestones={TIMELINE_MILESTONES}
              tone="light"
              surface="dot-grid"
            />
          </div>
        </section>

        {/* 5. Méthode */}
        <section
          id="methode"
          aria-labelledby="methode-title"
          className={cn(sectionShell, "scroll-mt-28")}
        >
          <div className={cn(sectionInner)}>
            <div className="mx-auto max-w-3xl text-center">
              <p className={kickerClass}>Notre méthode</p>
              <h2 id="methode-title" className={sectionTitleClass}>
                Une méthode simple pour avancer avec clarté
              </h2>
            </div>

            <ol className="mt-10 grid gap-4 sm:grid-cols-2">
              {METHOD_STEPS.map((item) => (
                <li
                  key={item.step}
                  className="relative flex h-full flex-col rounded-2xl border border-[#1f2a7c]/10 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl bg-[#1f2a7c]/[0.07] text-sm font-semibold tabular-nums text-[#1f2a7c]">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold text-[#1f2a7c]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#1f2a7c]/70">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6. Valeurs */}
        <section
          id="valeurs"
          aria-labelledby="valeurs-title"
          className={cn(sectionShell, "scroll-mt-28")}
        >
          <div className={cn(sectionInner, "pt-0 sm:pt-0 xl:pt-0")}>
            <div className="mx-auto max-w-3xl text-center">
              <p className={kickerClass}>Nos engagements</p>
              <h2 id="valeurs-title" className={sectionTitleClass}>
                Les engagements du cabinet
              </h2>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="flex h-full flex-col rounded-2xl border border-[#1f2a7c]/10 bg-white p-5 shadow-sm sm:p-6"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#1f2a7c]/[0.07] text-[#1f2a7c]">
                    <Icon className="size-5" aria-hidden strokeWidth={1.85} />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-[#1f2a7c]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#1f2a7c]/70">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7. Chiffres / preuves */}
        <section
          id="chiffres"
          aria-labelledby="chiffres-title"
          className={cn(sectionShell, "scroll-mt-28")}
        >
          <div className="overflow-hidden rounded-[1.75rem] border border-[#1f2a7c]/12 bg-[#1f2a7c] text-white lg:rounded-[2rem]">
            <div className={cn(sectionInner)}>
              <div className="mx-auto max-w-3xl text-center">
                <h2
                  id="chiffres-title"
                  className="text-balance text-[clamp(1.35rem,2.6vw,1.9rem)] font-normal leading-[1.15] tracking-[-0.02em]"
                >
                  L’expérience du cabinet en quelques repères
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75 sm:text-base">
                  Ces repères traduisent l’expérience du cabinet, la fidélité des clients accompagnés et
                  la qualité du réseau de partenaires mobilisés.
                </p>
              </div>

              <ul className="mx-auto mt-9 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
                {PROOF_STATS.map(({ value, label }) => (
                  <li
                    key={label}
                    className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-5 text-center"
                  >
                    <p className="inline-flex items-center gap-1 text-[clamp(1.25rem,2.6vw,1.75rem)] font-semibold leading-none tracking-[-0.02em] tabular-nums">
                      {label === "Google" ? (
                        <Star className="size-4 fill-amber-300 text-amber-300" aria-hidden />
                      ) : null}
                      {value}
                    </p>
                    <p className="mt-1.5 text-[11px] font-medium leading-snug text-white/65 sm:text-xs">
                      {label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 8. Partenaires */}
        <section
          id="partenaires"
          aria-labelledby="partenaires-title"
          className={cn(sectionShell, "scroll-mt-28")}
        >
          <div className="px-4 pt-14 text-center sm:px-7 sm:pt-16 xl:px-11">
            <p className={kickerClass}>Réseau</p>
            <h2 id="partenaires-title" className={cn(sectionTitleClass, "mx-auto")}>
              Des partenaires de confiance
            </h2>
            <p
              className={cn(
                "mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed sm:text-base",
                aboutProse,
              )}
            >
              Lefèvre Conseil s’appuie sur des partenaires reconnus afin d’étudier des solutions
              adaptées aux objectifs, au profil et à l’horizon de chaque client.
            </p>
          </div>
          <PartnersStrip layout="page" />
        </section>

        {/* 9. Cadre professionnel */}
        <section
          id="cadre"
          aria-labelledby="cadre-title"
          className={cn(sectionShell, "scroll-mt-28")}
        >
          <div className="px-4 pt-12 sm:px-7 sm:pt-14 xl:px-11">
            <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-[#1f2a7c]/12 bg-[#f5f6fb] px-5 py-7 text-center sm:px-8 sm:py-9 lg:rounded-[2rem]">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white text-[#1f2a7c] shadow-sm">
                <ShieldCheck className="size-5" aria-hidden strokeWidth={1.85} />
              </span>
              <h2
                id="cadre-title"
                className="mt-4 text-balance text-[clamp(1.25rem,2.4vw,1.7rem)] font-normal leading-[1.15] tracking-[-0.02em] text-[#1f2a7c]"
              >
                Un cadre professionnel clair
              </h2>
              <p
                className={cn(
                  "mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed sm:text-base",
                  aboutProse,
                )}
              >
                Le cabinet exerce dans un cadre réglementé. Les informations légales, les modalités de
                réclamation et les coordonnées officielles de Lefèvre Conseil sont accessibles depuis
                les pages dédiées du site.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px]">
                {LEGAL_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="font-medium text-[#1f2a7c] underline decoration-[#1f2a7c]/30 underline-offset-2 hover:decoration-[#1f2a7c]/70"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 10. Mini FAQ */}
        <section
          id="faq"
          aria-labelledby="faq-title"
          className={cn(LANDING_SECTION_SHELL, "scroll-mt-28 border-t border-[#1f2a7c]/8")}
        >
          <div className={cn(LANDING_SECTION_INSET, LANDING_SECTION_INNER_Y)}>
            <FaqSectionClient
              items={CABINET_FAQ}
              kicker="Questions fréquentes"
              title="Vos questions sur le cabinet"
              titleId="faq-title"
              titleClassName={sectionTitleClass}
              contentClassName="max-w-4xl"
            />
          </div>
        </section>

        {/* 11. CTA final */}
        <section className={cn(bilanCtaSectionClassName, "mt-2 lg:mb-0")}>
          <CtaBand
            eyebrow={false}
            centered
            showSecondaryCta={false}
            primaryLabel="Prendre rendez-vous"
            primaryHref={CONTACT_HREF}
            title="Faisons le point sur votre situation patrimoniale."
            description="Un premier échange pour comprendre vos objectifs et vous orienter vers les solutions adaptées."
          />
        </section>
      </main>
    </MarketingSubpage>
  );
}
