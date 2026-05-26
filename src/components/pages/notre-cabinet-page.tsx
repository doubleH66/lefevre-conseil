import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, CalendarSync, FileSearch, Handshake, Link2 } from "lucide-react";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { HighlightReveal } from "@/components/ui/highlight-reveal";
import { CtaPrimaryLink, heroCtaRowClassName } from "@/components/ui/cta-link";
import { ContactGlassLink } from "@/components/ui/contact-glass-link";
import { PartnersStrip } from "@/components/landing/partners-strip";
import { ValuesScrollStack, type ValueCardItem } from "@/components/marketing/values-scroll-stack";
import {
  AboutExperienceTimeline,
  type AboutTimelineMilestone,
} from "@/components/client/about-experience-timeline";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { BILAN_PATRIMOINE_HREF, CONTACT_HREF } from "@/lib/content/routes";
import { CABINET_CONTACT } from "@/lib/content/site";
import {
  ADVISOR_ROUND_AVATAR_IMAGE_URL,
  ADVISOR_ROUND_AVATAR_OBJECT_POSITION,
  CABINET_PORTRAIT_IMAGE_URL,
  CABINET_PORTRAIT_OBJECT_POSITION,
} from "@/lib/site-brand";
import { cn } from "@/lib/utils";

const aboutProse =
  "text-[#1f2a7c]/78 max-lg:text-[#1f2a7c]/72 lg:text-[#1f2a7c]/88";

const EXPERIENCE_STATS = [
  { value: "+19", unit: "ans", label: "d'expertise" },
  { value: "+100", unit: "", label: "clients accompagnés" },
  { value: "+40", unit: "", label: "partenaires" },
] as const;

const TIMELINE_MILESTONES: readonly AboutTimelineMilestone[] = [
  {
    year: "2007",
    description:
      "Débuts en tant que conseiller indépendant en immobilier d'investissement au sein d'un réseau national : montage de dossiers, analyse de rendement et accompagnement des premiers investisseurs.",
  },
  {
    year: "2010",
    description:
      "Passage à une indépendance complète, en binôme avec un CGPI et au sein de la Chambre des indépendants du patrimoine : le conseil s'élargit déjà au-delà du seul brique et mortier.",
  },
  {
    year: "2013",
    description:
      "Ouverture vers l'assurance-vie, la prévoyance et les contrats collectifs : réponses structurées aux enjeux de revenus, de protection sociale et de retraite des chefs d'entreprise.",
  },
  {
    year: "2018",
    description:
      "Renforcement de l'offre épargne et placements, en partenariat avec des groupes historiques (notamment GAN et AXA) : diversification des supports, exigence de transparence et de suivi.",
  },
  {
    year: "2022",
    description:
      "Montée en puissance sur la prévoyance haut de gamme et les enveloppes de placement, en prolongement de l'immobilier patrimonial et des dispositifs d'optimisation fiscale.",
    bullets: [
      "Conseil aux dirigeants et professions réglementées : holding, ingénierie patrimoniale, articulation pro / perso.",
      "Lancement de la SAS Ellena Solution en association — assurance, prévoyance et services administratifs complémentaires.",
    ],
  },
  {
    year: "2023",
    description:
      "Veille active auprès de traders et de sociétés de gestion : affiner la lecture des marchés, comprendre les produits institutionnels et les rendre intelligibles pour les clients.",
  },
  {
    year: "2024",
    description:
      "Constitution de la SASU Lefèvre Conseil — épargne et gestion privée : cadre juridique clarifié, offre patrimoniale intégrée et accompagnement renforcé des chefs d'entreprise et de leur famille.",
  },
];

const VALUES: readonly ValueCardItem[] = [
  {
    title: "Indépendance",
    kicker: "Gagnant / gagnant",
    parts: [
      { text: "Des solutions " },
      { text: "libres de tout engagement commercial imposé", highlight: true },
      { text: " : nous sélectionnons ce qui vous correspond, " },
      { text: "sans conflit d'intérêts", highlight: true },
      { text: "." },
    ],
  },
  {
    title: "Écoute",
    parts: [
      { text: "Chaque mission débute par " },
      { text: "vos objectifs de vie", highlight: true },
      { text: ", votre calendrier fiscal et votre tolérance au risque — " },
      { text: "avant toute proposition technique", highlight: true },
      { text: "." },
    ],
  },
  {
    title: "Transparence",
    parts: [
      { text: "Honoraires et modalités expliqués clairement, " },
      { text: "arbitrages documentés", highlight: true },
      { text: " : une relation durable fondée sur la " },
      { text: "lisibilité, pas sur la complexité", highlight: true },
      { text: "." },
    ],
  },
];

const APPROCHE_STEPS: readonly {
  step: string;
  text: string;
  Icon: LucideIcon;
}[] = [
  {
    step: "01",
    text: "Un bilan patrimonial complet, sans engagement, pour cadrer la situation.",
    Icon: FileSearch,
  },
  {
    step: "02",
    text: "Des solutions sourcées auprès de partenaires sélectionnés pour leur sérieux.",
    Icon: Handshake,
  },
  {
    step: "03",
    text: "Une coordination fluide avec votre notaire, expert-comptable ou avocat fiscaliste.",
    Icon: Link2,
  },
  {
    step: "04",
    text: "Un suivi annuel pour ajuster la stratégie aux changements de vie ou de loi.",
    Icon: CalendarSync,
  },
] as const;

const TEAM = [
  {
    name: "Philippe Lefèvre",
    role: "Fondateur & conseiller en gestion de patrimoine",
    bio: "Plus de dix-neuf ans à accompagner particuliers, professions libérales et dirigeants sur l'épargne, la fiscalité, la prévoyance et la transmission.",
    highlight: true,
    initials: "PL",
    avatarUrl: ADVISOR_ROUND_AVATAR_IMAGE_URL,
  },
  {
    name: "L'équipe",
    role: "Conseil & coordination",
    bio: "Une structure à taille humaine, articulée avec un réseau d'experts (notaires, experts-comptables, sociétés de gestion) lorsque votre dossier l'exige.",
    highlight: false,
    initials: "L",
  },
] as const;

function highlightPillClassName() {
  return "rounded-lg px-1.5 pb-0.5";
}

function experienceHighlightClassName() {
  return highlightPillClassName();
}

export function NotreCabinetPage() {
  return (
    <MarketingSubpage
      hero={PAGE_HEROES.notreCabinet}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Notre cabinet" },
      ]}
    >
      <main className="flex-1 overflow-x-clip bg-white pb-6 text-neutral-950 sm:pb-10">
        {/* Présentation */}
        <section id="presentation" aria-labelledby="presentation-title" className="scroll-mt-28">
          <div className="mx-2.5 mt-3 bg-white text-[#1f2a7c] lg:mx-4 lg:mt-4">
            <div className="px-4 py-10 sm:px-7 sm:py-12 xl:px-11 xl:py-14">
              <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch lg:gap-6">
                <div className="flex flex-col justify-between lg:pr-4 xl:pr-8">
                  <div className="mx-auto w-full max-w-5xl xl:mx-0">
                    <div className="flex flex-col items-center gap-4 xl:flex-row xl:items-start xl:gap-5">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-[#1f2a7c]/15 shadow-md ring-2 ring-white sm:size-[4.5rem]">
                        <Image
                          src={ADVISOR_ROUND_AVATAR_IMAGE_URL}
                          alt={CABINET_CONTACT.name}
                          fill
                          sizes="72px"
                          className="object-cover"
                          style={{ objectPosition: ADVISOR_ROUND_AVATAR_OBJECT_POSITION }}
                        />
                      </div>
                      <div className="min-w-0 flex-1 text-center xl:text-left">
                        <p className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1f2a7c]/60 lg:block">
                          Le cabinet
                        </p>
                        <h2
                          id="presentation-title"
                          className={cn(
                            "mt-3 w-full text-balance text-center text-[clamp(1.28rem,3.2vw,2.05rem)] font-normal leading-[1.08] tracking-[-0.038em] sm:text-[clamp(1.35rem,2.9vw,2.2rem)] xl:text-left",
                            aboutProse,
                          )}
                        >
                          Lefèvre Conseil —{" "}
                          <span className="block sm:inline">
                            <HighlightReveal variant="light" className={highlightPillClassName()}>
                              conseil en gestion de patrimoine
                            </HighlightReveal>{" "}
                            à Perpignan et en Occitanie.
                          </span>
                        </h2>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "mx-auto mt-5 max-w-3xl space-y-4 text-balance text-center text-[1.0625rem] font-normal leading-snug tracking-[-0.012em] sm:mt-6 sm:text-lg sm:leading-relaxed lg:mt-6 xl:mx-0 xl:text-left",
                        aboutProse,
                      )}
                    >
                      <p className="text-pretty">
                        {CABINET_CONTACT.name} accompagne particuliers, professions libérales et dirigeants depuis{" "}
                        <span className="font-semibold text-[#1f2a7c]">
                          {CABINET_CONTACT.address.city} ({CABINET_CONTACT.address.postalCode})
                        </span>
                        , en Pyrénées-Orientales, au cœur de l'Occitanie. Fiscalité, épargne, prévoyance,
                        structuration d'entreprise et transmission : une trajectoire progressive, aujourd'hui
                        cristallisée dans un{" "}
                        <HighlightReveal variant="light" delay="hero" className={highlightPillClassName()}>
                          cabinet dédié au conseil patrimonial
                        </HighlightReveal>
                        , avec la même exigence{" "}
                        <HighlightReveal variant="light" delay="hero" className={highlightPillClassName()}>
                          partout en France
                        </HighlightReveal>{" "}
                        (cabinet, visioconférence, coordination avec vos autres conseils).
                      </p>
                      <p className="rounded-2xl border border-[#1f2a7c]/12 bg-[#eef1f9] px-4 py-4 text-left text-pretty text-[0.9375rem] leading-relaxed sm:px-5 sm:py-5 sm:text-[1.0625rem]">
                        <span className="font-serif text-[1.05rem] italic leading-snug text-[#1f2a7c] sm:text-lg">
                          « La relation avant le produit : comprendre votre vision, comparer les options, décider
                          avec des chiffres et du recul. »
                        </span>
                      </p>
                    </div>

                    <div
                      className={cn(
                        "mt-8 justify-center sm:mt-10",
                        heroCtaRowClassName,
                        "max-sm:gap-2 xl:justify-start",
                      )}
                    >
                      <CtaPrimaryLink href={BILAN_PATRIMOINE_HREF} className="group max-sm:!h-12 max-sm:!min-h-12 max-sm:!w-auto max-sm:!flex-none max-sm:!gap-2 max-sm:!px-5 max-sm:!text-sm">
                        <span className="md:hidden">Simulation</span>
                        <span className="hidden md:inline">Faire une simulation</span>
                        <ArrowUpRight
                          aria-hidden
                          className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </CtaPrimaryLink>
                      <ContactGlassLink
                        href={CONTACT_HREF}
                        layout="hero"
                        className="max-sm:!h-12 max-sm:!min-h-12 max-sm:!w-auto max-sm:!flex-none max-sm:px-5 max-sm:!text-sm"
                      />
                    </div>
                  </div>

                  <div className="mx-auto mt-8 hidden w-full max-w-5xl grid-cols-3 gap-2 sm:mt-10 sm:gap-4 md:mt-12 lg:grid xl:mx-0">
                    {EXPERIENCE_STATS.map((stat) => (
                      <div key={stat.label} className="min-w-0 px-0 py-1.5 text-center md:py-2 xl:text-left">
                        <p
                          className="tabular-nums text-[clamp(1.125rem,2.8vw,1.75rem)] font-semibold leading-none tracking-[-0.03em] text-[#1f2a7c] md:text-[clamp(1.25rem,2.4vw,1.875rem)]"
                          aria-label={`${stat.value}${stat.unit ? ` ${stat.unit}` : ""} ${stat.label}`.trim()}
                        >
                          {stat.value}
                          {stat.unit ? (
                            <span className="ml-0.5 text-[0.85em] font-medium"> {stat.unit}</span>
                          ) : null}
                        </p>
                        <p className="mt-1.5 text-pretty text-[10px] font-medium leading-snug text-[#1f2a7c]/70 sm:mt-2 sm:text-[11px] md:text-xs">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex w-full flex-col lg:h-full lg:min-h-0">
                  <div className="box-border flex min-h-0 flex-1 flex-col p-4 sm:p-5 xl:p-6">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] bg-neutral-100 md:rounded-[2.25rem] lg:aspect-auto lg:h-full lg:min-h-0 lg:rounded-[2.5rem]">
                      <Image
                        src={CABINET_PORTRAIT_IMAGE_URL}
                        alt={`${CABINET_CONTACT.name} — conseil en gestion de patrimoine à Perpignan (${CABINET_CONTACT.address.postalCode}), Pyrénées-Orientales, Occitanie`}
                        fill
                        className="object-cover"
                        style={{ objectPosition: CABINET_PORTRAIT_OBJECT_POSITION }}
                        sizes="(max-width: 1024px) 100vw, 45vw"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f2a7c]/25 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Parcours + frise timeline */}
        <section id="experience" aria-labelledby="experience-title" className="scroll-mt-28">
          <div className="mx-2.5 mt-3 px-5 pt-10 sm:px-8 sm:pt-12 lg:mx-4 lg:mt-4 lg:px-10 lg:pt-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              <div className="min-w-0 max-w-2xl lg:max-w-xl">
                <p className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1f2a7c]/55 lg:block">
                  Parcours professionnel
                </p>
                <h2
                  id="experience-title"
                  className="text-2xl font-semibold tracking-tight text-[#1f2a7c] sm:text-3xl lg:mt-2"
                >
                  Une expertise construite étape par étape
                </h2>
                <p className={cn("mt-3 text-pretty text-sm leading-relaxed sm:text-[15px]", aboutProse)}>
                  Du financement de l&apos;immobilier patrimonial à l&apos;ingénierie globale : épargne,
                  assurance-vie, prévoyance, structuration sociétaire, puis conseil en gestion de patrimoine et
                  gestion privée. Même exigence de clarté et de suivi dans la durée.
                </p>
              </div>
              <dl
                className="hidden w-full grid-cols-3 gap-x-3 gap-y-2 text-left sm:max-w-lg sm:gap-x-8 lg:grid lg:max-w-md lg:shrink-0"
                aria-label="Chiffres clés"
              >
                {EXPERIENCE_STATS.map((stat) => (
                  <div key={stat.label} className="min-w-0">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="flex flex-wrap items-baseline gap-x-1 text-xl font-semibold tabular-nums tracking-tight text-[#1f2a7c] sm:text-2xl lg:text-3xl">
                        {stat.value}
                        {stat.unit ? (
                          <span className="text-base font-medium text-[#1f2a7c]/75 sm:text-lg lg:text-xl">
                            {stat.unit}
                          </span>
                        ) : null}
                      </span>
                      <p className="mt-1.5 text-pretty text-[11px] font-medium leading-snug text-[#1f2a7c]/65 sm:text-xs">
                        {stat.label}
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mx-2.5 mt-6 overflow-hidden rounded-3xl border border-[#1f2a7c]/12 bg-[#1f2a7c] px-4 py-6 text-white sm:mt-8 sm:px-6 sm:py-8 lg:mx-4 lg:mt-6 lg:rounded-[3rem] lg:px-10 lg:py-10">
            <AboutExperienceTimeline milestones={TIMELINE_MILESTONES} tone="dark" />
          </div>
        </section>

        {/* Valeurs */}
        <section id="valeurs" aria-labelledby="values-title" className="scroll-mt-28">
          <div className="mx-2.5 mt-3 lg:mx-4 lg:mt-4">
            <div className="px-4 pt-12 sm:px-7 sm:pt-14 xl:px-11 xl:pt-16">
              <div className="mx-auto max-w-3xl text-center">
                <p className="hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1f2a7c]/70 lg:inline-flex">
                  <span aria-hidden className="inline-block h-px w-5 bg-[#1f2a7c]/40" />
                  Nos valeurs
                </p>
                <h2
                  id="values-title"
                  className="mt-4 text-balance text-[clamp(1.5rem,3.2vw,2.25rem)] font-semibold leading-[1.15] tracking-tight text-neutral-900"
                >
                  La relation avant le{" "}
                  <HighlightReveal variant="light">produit</HighlightReveal>.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-neutral-600 sm:text-base">
                  Accompagner votre trajectoire patrimoniale, c'est d'abord comprendre votre situation et vos
                  priorités. Nous cultivons une relation de confiance : chaque arbitrage est expliqué, comparé
                  et chiffré, pour des décisions sereines sur le long terme.
                </p>
              </div>

              <ValuesScrollStack
                values={VALUES}
                highlightClassName={experienceHighlightClassName()}
                className="mt-10 sm:mt-12"
              />
            </div>
          </div>
        </section>

        {/* Approche */}
        <section id="approche" aria-labelledby="approche-title" className="scroll-mt-28">
          <div className="mx-2.5 mt-3 lg:mx-4 lg:mt-4">
            <div className="overflow-hidden rounded-3xl border border-[#1f2a7c]/12 bg-white shadow-[0_1px_0_rgba(31,42,124,0.04)] lg:rounded-[2.5rem]">
              <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
                <div className="relative border-b border-[#1f2a7c]/10 bg-gradient-to-br from-[#f5f7fc] via-white to-[#eef1f9] px-6 py-10 sm:px-9 sm:py-12 lg:border-b-0 lg:border-r lg:py-14 xl:px-12 xl:py-16">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-0 hidden h-40 w-40 translate-x-1/4 -translate-y-1/4 rounded-full bg-[#1f2a7c]/[0.06] blur-2xl lg:block"
                  />
                  <div className="relative max-w-xl lg:max-w-none">
                    <p className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1f2a7c]/55 sm:text-[11px] lg:block">
                      Méthode
                    </p>
                    <h2
                      id="approche-title"
                      className="mt-3 text-balance text-[clamp(1.45rem,3vw,2.1rem)] font-semibold leading-[1.12] tracking-tight text-[#1f2a7c] sm:mt-4"
                    >
                      Notre approche
                    </h2>
                    <p
                      className={cn(
                        "mt-5 text-pretty text-[15px] font-normal leading-relaxed sm:mt-6 sm:text-[1.0625rem] sm:leading-[1.55]",
                        aboutProse,
                      )}
                    >
                      Nous prenons le temps d'analyser votre situation avant toute recommandation. Chaque proposition
                      est argumentée, confrontée à au moins deux alternatives pertinentes, et traduite en impacts
                      chiffrés pour vous.
                    </p>
                    <div className="mt-8 hidden items-center gap-3 border-t border-[#1f2a7c]/10 pt-8 sm:flex lg:mt-10 lg:pt-10">
                      <div className="h-px flex-1 max-w-[4.5rem] bg-[#1f2a7c]/25" aria-hidden />
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#1f2a7c]/45">
                        Cadrage · comparaison · décision
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-9 lg:py-12 xl:px-11 xl:py-14">
                  <ol className="relative space-y-0">
                    {APPROCHE_STEPS.map((item, i) => {
                      const Icon = item.Icon;
                      const isLast = i === APPROCHE_STEPS.length - 1;
                      return (
                        <li key={item.step} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-5">
                          {!isLast ? (
                            <span
                              aria-hidden
                              className="absolute left-[1.125rem] top-[2.75rem] bottom-0 w-px bg-gradient-to-b from-[#1f2a7c]/20 to-[#1f2a7c]/5 sm:left-[1.25rem]"
                            />
                          ) : null}
                          <div className="relative z-[1] flex shrink-0 flex-col items-center">
                            <span className="grid size-9 place-items-center rounded-full border border-[#1f2a7c]/15 bg-[#f5f7fc] text-[#1f2a7c] shadow-sm sm:size-10">
                              <Icon className="size-4 sm:size-[1.125rem]" strokeWidth={1.85} aria-hidden />
                            </span>
                          </div>
                          <div className="min-w-0 pt-0.5">
                            <p className="font-mono text-[10px] font-semibold tabular-nums tracking-[0.14em] text-[#1f2a7c]/40 sm:text-[11px]">
                              {item.step}
                            </p>
                            <p className="mt-1.5 text-pretty text-sm font-medium leading-snug text-neutral-800 sm:text-[15px] sm:leading-relaxed">
                              {item.text}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Équipe */}
        <section id="equipe" aria-labelledby="team-title" className="scroll-mt-28">
          <div className="mx-2.5 mt-3 lg:mx-4 lg:mt-4">
            <div className="px-4 pb-2 pt-10 sm:px-7 sm:pt-12 xl:px-11 xl:pt-14">
              <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
                <p className="hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1f2a7c]/70 lg:inline-flex">
                  <span aria-hidden className="inline-block h-px w-5 bg-[#1f2a7c]/40" />
                  L'équipe
                </p>
                <h2
                  id="team-title"
                  className="mt-4 text-balance text-[clamp(1.5rem,3.2vw,2.25rem)] font-semibold leading-[1.15] tracking-tight text-neutral-900"
                >
                  À votre écoute, à taille humaine.
                </h2>
              </div>

              <ul className="mx-auto mt-10 grid max-w-5xl gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-2 lg:items-stretch">
                {TEAM.map((member) => (
                  <li key={member.name} className="min-w-0 list-none">
                    <article
                      className={cn(
                        "relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 sm:p-8",
                        member.highlight
                          ? "border-[#1f2a7c]/20 bg-gradient-to-b from-white to-[#f4f6fb] shadow-md shadow-[#1f2a7c]/[0.07] ring-1 ring-[#1f2a7c]/10"
                          : "border-neutral-200/90 bg-neutral-50/80 shadow-sm",
                      )}
                    >
                      {member.highlight ? (
                        <div
                          aria-hidden
                          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1f2a7c] via-[#2d3a8c] to-[#1f2a7c]/40"
                        />
                      ) : null}
                      <div className="flex items-start gap-4 sm:gap-5">
                        {"avatarUrl" in member && member.avatarUrl ? (
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md ring-2 ring-[#1f2a7c]/15 sm:size-14">
                            <Image
                              src={member.avatarUrl}
                              alt={member.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                              style={{ objectPosition: ADVISOR_ROUND_AVATAR_OBJECT_POSITION }}
                            />
                          </div>
                        ) : (
                          <div
                            aria-hidden
                            className={cn(
                              "grid size-12 shrink-0 place-items-center rounded-2xl text-[0.8125rem] font-semibold tracking-tight sm:size-14 sm:text-[0.9375rem]",
                              member.highlight
                                ? "bg-[#1f2a7c] text-white shadow-inner shadow-black/10"
                                : "border border-neutral-200/80 bg-white text-[#1f2a7c]",
                            )}
                          >
                            {member.initials}
                          </div>
                        )}
                        <div className="min-w-0 flex-1 pt-0.5">
                          <h3 className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
                            {member.name}
                          </h3>
                          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1f2a7c]/65 sm:text-xs">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <p className="mt-5 text-pretty text-sm leading-relaxed text-neutral-600 sm:mt-6 sm:text-[15px] sm:leading-[1.6]">
                        {member.bio}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Partenaires — même bandeau qu'heritage (en bas de page) */}
        <section id="partenaires" aria-labelledby="partners-about-title" className="scroll-mt-28">
          <h2 id="partners-about-title" className="sr-only">
            Partenaires de confiance
          </h2>
          <PartnersStrip layout="page" />
        </section>
      </main>
    </MarketingSubpage>
  );
}
