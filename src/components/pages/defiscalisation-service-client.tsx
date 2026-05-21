"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FaqAccordion } from "@/components/client/faq-accordion";
import { MarketingHighlight } from "@/components/marketing/marketing-section";
import { marketingPageShellClass } from "@/components/marketing/marketing-styles";
import {
  AboutExperienceTimeline,
  type AboutTimelineMilestone,
} from "@/components/client/about-experience-timeline";
import type { ServiceContent } from "@/lib/content/service-data";
import { DEFISCALISATION_CAROUSEL_HERO_IMAGE } from "@/lib/content/services";
import { CONTACT_HREF, FAQ_HREF, ROUTES } from "@/lib/content/routes";
import {
  heroCtaPrimaryCompactClassName,
  heroCtaRowCompactClassName,
  heroCtaSecondaryOnDarkClassName,
} from "@/lib/styles/cta";
import { cn } from "@/lib/utils";

const METHODE_MILESTONES: readonly AboutTimelineMilestone[] = [
  {
    year: "01",
    title: "Analyse",
    description:
      "On étudie la situation fiscale, patrimoniale et familiale : revenus, patrimoine existant, charges, objectifs et contraintes de liquidité.",
  },
  {
    year: "02",
    title: "Simulation",
    description:
      "On compare plusieurs pistes adaptées à vos objectifs, avec une lecture chiffrée des effets et des contreparties (risque, durée, fiscalité).",
  },
  {
    year: "03",
    title: "Conseil",
    description:
      "On sélectionne les solutions cohérentes avec le bilan global, en exposant clairement avantages, limites et formalités.",
  },
  {
    year: "04",
    title: "Suivi",
    description:
      "On accompagne dans le temps : points d’étape avant les échéances fiscales, ajustements si la loi ou votre situation évolue.",
  },
];

const COMPRENDRE_ROWS = [
  {
    notion: "Déduction fiscale",
    effet: "Diminue le revenu imposable.",
    pratique: "Le mécanisme agit « en amont » du calcul de l’impôt (ex. certains versements épargne).",
  },
  {
    notion: "Réduction d’impôt",
    effet: "Diminue l’impôt dû.",
    pratique: "S’applique après le calcul de l’impôt, dans des plafonds et conditions précis.",
  },
  {
    notion: "Crédit d’impôt",
    effet: "Peut ouvrir droit à restitution selon la situation.",
    pratique: "Peut faire baisser l’impôt en dessous de zéro : la part excédentaire peut être remboursée.",
  },
] as const;

const LEVIERS_ROWS = [
  { famille: "Épargne longue durée", exemples: "PER, assurance-vie, capitalisation…" },
  { famille: "Capital-investissement", exemples: "FCPI, FIP…" },
  { famille: "Immobilier & travaux", exemples: "Locatif, rénovation, dispositifs encadrés" },
  { famille: "Profils spécifiques", exemples: "Outre-mer, TNS / Madelin, prévoyance…" },
] as const;

const SOURCES_OFFICIELLES = [
  { label: "service-public.gouv.fr", href: "https://www.service-public.gouv.fr/" },
  { label: "impots.gouv.fr", href: "https://www.impots.gouv.fr/" },
  { label: "economie.gouv.fr", href: "https://www.economie.gouv.fr/" },
] as const;

const landingSectionClass = "mx-2.5 mt-3 bg-white text-[#1f2a7c] lg:mx-4 lg:mt-4";

const landingInnerClass = "px-4 py-10 sm:px-7 sm:py-12 xl:px-11 xl:py-14";

const contentMax = "mx-auto w-full max-w-5xl text-center";

const prose = "text-[#1f2a7c]/78 max-lg:text-[#1f2a7c]/72 lg:text-[#1f2a7c]/88";

const kicker = "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1f2a7c]/45";

const pill = "rounded-lg px-1.5 pb-0.5";

const tableShell =
  "mx-auto mt-8 max-w-5xl overflow-x-auto rounded-2xl border border-[#1f2a7c]/10 bg-white/95 shadow-[0_20px_60px_-40px_rgba(31,42,124,0.12)]";

const thClass =
  "border-b border-white/15 bg-[#1f2a7c] px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white/95 sm:px-5 sm:text-[11px]";

const tdClass =
  "border-b border-[#1f2a7c]/[0.07] px-4 py-3.5 text-left align-top text-[14px] leading-relaxed text-[#1f2a7c]/82 sm:px-5 sm:text-[15px]";

function Block({
  labelledBy,
  id,
  children,
  className,
}: {
  labelledBy?: string;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(landingSectionClass, "scroll-mt-28", className)}
    >
      <div className={landingInnerClass}>{children}</div>
    </section>
  );
}

function LeadParagraph({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "mx-auto mt-5 max-w-2xl text-balance text-[1.0625rem] leading-snug sm:mt-6 sm:text-lg sm:leading-relaxed",
        prose,
        className,
      )}
    >
      {children}
    </p>
  );
}

const FOCUS_TABS = [
  {
    key: "bilan",
    label: "Bilan & priorité",
    hint: "D’abord le cadre",
    panelTitle: "Voir clair",
    body: "Revenus, patrimoine, charges, projets : une carte lisible avant d’ouvrir le volet « produit ».",
  },
  {
    key: "scenario",
    label: "Scénarios",
    hint: "Chiffré",
    panelTitle: "Comparer",
    body: "Plusieurs pistes côte à côte — fiscalité, liquidité, risque, horizon — pour mesurer l’écart avant signature.",
  },
  {
    key: "suivi",
    label: "Suivi",
    hint: "Dans le temps",
    panelTitle: "Tenir le rythme",
    body: "Déclaration, fin d’exercice, jalons du dispositif : des repères avec votre conseiller pour ajuster sans improvisation.",
  },
] as const;

function DefiscalMergedActionBand() {
  const [tab, setTab] = useState(0);

  return (
    <section
      aria-labelledby="defiscal-merged-title"
      className="mx-2.5 mt-3 scroll-mt-28 lg:mx-4 lg:mt-4"
    >
      <div className="relative min-h-[min(28rem,85svh)] overflow-hidden rounded-[1.75rem] border border-[#1f2a7c]/15 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.5)] sm:min-h-0 lg:rounded-[2rem]">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <Image
            src={DEFISCALISATION_CAROUSEL_HERO_IMAGE}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 80vw, 100vw"
            aria-hidden
          />
          {/* Même traitement que `CtaBand` avec `deepBlackOverlay` (bandeau Bilan patrimonial). */}
          <div className="absolute inset-0 bg-black/[0.58]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/68 to-black/52 xl:bg-gradient-to-r xl:from-black/[0.88] xl:via-black/62 xl:to-black/38" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_55%)]"
        />

        <div className="relative z-[2] flex flex-col gap-10 px-6 py-12 sm:gap-12 sm:px-9 sm:py-14 lg:grid lg:min-h-[26rem] lg:grid-cols-12 lg:items-stretch lg:gap-0 lg:px-11 lg:py-16">
          <div className="flex flex-col justify-center text-center text-white lg:col-span-5 lg:border-r lg:border-white/10 lg:pr-10 lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
              Lecture & prochaine étape
            </p>
            <h2
              id="defiscal-merged-title"
              className="mt-3 text-balance text-[clamp(1.45rem,4.2vw,2rem)] font-normal leading-[1.1] tracking-[-0.035em]"
            >
              Du bilan au levier, sans sauter d’étapes
            </h2>
            <p className="mx-auto mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-white/85 lg:mx-0">
              Chaque option se lit dans <span className="font-medium text-white">votre</span> situation — puis seulement
              on chiffre et on compare. Même fil conducteur pour l’épargne longue durée, l’immobilier ou le
              capital-investissement.
            </p>
            <div
              className={cn(
                "mx-auto mt-9 flex w-full max-w-md flex-col justify-center gap-3 sm:flex-row lg:mx-0",
                heroCtaRowCompactClassName,
              )}
            >
              <Link
                href={ROUTES.simulateur}
                className={cn(heroCtaPrimaryCompactClassName, "group w-full sm:w-auto")}
              >
                <span>Faire une simulation</span>
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href={CONTACT_HREF}
                className={cn(heroCtaSecondaryOnDarkClassName, "w-full sm:w-auto")}
              >
                Nous écrire
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-7 lg:pl-10">
            <div className="rounded-2xl border border-white/25 bg-white/[0.12] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md sm:p-6 lg:rounded-3xl lg:p-7">
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65 lg:text-left">
                Avec le cabinet
              </p>
              <p className="mx-auto mt-2 max-w-lg text-center text-[13px] leading-snug text-white/70 lg:mx-0 lg:text-left">
                Trois angles — transparence, chiffres, calendrier — dans un seul bloc.
              </p>
              <div
                role="tablist"
                aria-label="Trois angles d’accompagnement"
                className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start"
              >
                {FOCUS_TABS.map((item, i) => (
                  <button
                    key={item.key}
                    type="button"
                    role="tab"
                    aria-selected={tab === i}
                    aria-controls="defiscal-focus-panel"
                    id={`defiscal-focus-tab-${item.key}`}
                    onClick={() => setTab(i)}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-left text-[12px] font-semibold tracking-tight transition-all duration-200 sm:px-4 sm:text-[13px]",
                      tab === i
                        ? "border-white bg-white text-[#1f2a7c] shadow-lg shadow-black/20"
                        : "border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/15",
                    )}
                  >
                    <span className="block">{item.label}</span>
                    <span
                      className={cn(
                        "mt-0.5 block text-[10px] font-medium uppercase tracking-wide",
                        tab === i ? "text-[#1f2a7c]/55" : "text-white/55",
                      )}
                    >
                      {item.hint}
                    </span>
                  </button>
                ))}
              </div>
              <div className="relative mt-5 min-h-[6.25rem] sm:min-h-[6.5rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={FOCUS_TABS[tab]!.key}
                    id="defiscal-focus-panel"
                    role="tabpanel"
                    aria-labelledby={`defiscal-focus-tab-${FOCUS_TABS[tab]!.key}`}
                    aria-live="polite"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-xl border border-white/30 bg-white/95 p-4 text-left shadow-lg sm:p-5"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1f2a7c]/45">
                      {FOCUS_TABS[tab]!.panelTitle}
                    </p>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#1f2a7c]/88">{FOCUS_TABS[tab]!.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export type DefiscalisationServiceClientProps = {
  content: ServiceContent;
  otherServices: readonly { name: string; href: string; slug: string }[];
};

export function DefiscalisationServiceClient({ content, otherServices }: DefiscalisationServiceClientProps) {
  return (
    <main className={marketingPageShellClass}>
      <section className="relative z-0 pb-8 pt-0 sm:pb-10">
        {content.intro ? (
          <section
            aria-labelledby={`defiscal-intro-${content.slug}`}
            className="mx-auto max-w-5xl px-4 pb-2 pt-10 text-center sm:px-6 sm:pt-14 lg:px-8"
          >
            <p
              id={`defiscal-intro-${content.slug}`}
              className="mx-auto max-w-3xl text-[15px] leading-relaxed text-neutral-600 sm:text-base sm:leading-relaxed"
            >
              {content.intro}
            </p>
          </section>
        ) : null}

        <Block labelledBy="defiscal-bases-title" className={content.intro ? "mt-10 sm:mt-12" : undefined}>
          <div className={contentMax}>
            <p className={kicker}>Les bases</p>
            <h2
              id="defiscal-bases-title"
              className={cn(
                "mt-3 text-balance text-[clamp(1.28rem,3.2vw,2.05rem)] font-normal leading-[1.08] tracking-[-0.038em] sm:text-[clamp(1.35rem,2.9vw,2.2rem)]",
                prose,
              )}
            >
              Trois notions pour lire une proposition,{" "}
              <MarketingHighlight>quatre familles</MarketingHighlight>{" "}
              de leviers possibles.
            </h2>
            <LeadParagraph>
              Déduction, réduction, crédit : le vocabulaire revient souvent — ensuite on raisonne par familles
              (épargne, capital-investissement, immobilier, cas particuliers), sans catalogue de produits.
            </LeadParagraph>
          </div>

          <div className={tableShell}>
            <table className="w-full min-w-[min(100%,520px)] border-collapse">
              <caption className="sr-only">Trois notions fiscales</caption>
              <thead>
                <tr>
                  <th scope="col" className={cn(thClass, "w-[28%]")}>
                    Notion
                  </th>
                  <th scope="col" className={cn(thClass, "w-[32%]")}>
                    Effet
                  </th>
                  <th scope="col" className={thClass}>
                    En pratique
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPRENDRE_ROWS.map((row) => (
                  <tr key={row.notion} className="hover:bg-[#1f2a7c]/[0.02]">
                    <th scope="row" className={cn(tdClass, "font-medium text-[#1f2a7c]")}>
                      {row.notion}
                    </th>
                    <td className={tdClass}>{row.effet}</td>
                    <td className={cn(tdClass, "text-[#1f2a7c]/70")}>{row.pratique}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LEVIERS_ROWS.map((row) => (
              <article
                key={row.famille}
                className="rounded-2xl border border-[#1f2a7c]/10 bg-gradient-to-b from-[#fafbfc] to-white px-4 py-4 text-left shadow-sm sm:px-5 sm:py-5"
              >
                <h3 className="text-[14px] font-semibold leading-snug text-[#1f2a7c] sm:text-[15px]">{row.famille}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#1f2a7c]/65 sm:text-sm">{row.exemples}</p>
              </article>
            ))}
          </div>
        </Block>

        <Block labelledBy="defiscal-methode-title">
          <div className={contentMax}>
            <p className={kicker}>Notre méthode</p>
            <h2
              id="defiscal-methode-title"
              className={cn(
                "mt-3 text-balance text-[clamp(1.28rem,3.2vw,2.05rem)] font-normal leading-[1.08] tracking-[-0.038em]",
                prose,
              )}
            >
              <MarketingHighlight>
                Analyse
              </MarketingHighlight>{" "}
              → Simulation → Conseil →{" "}
              <MarketingHighlight>
                Suivi
              </MarketingHighlight>
            </h2>
            <LeadParagraph>
              Quatre étapes, dans l’ordre, pour structurer l’accompagnement patrimonial et fiscal.
            </LeadParagraph>
          </div>
          <div className="mx-auto mt-10 max-w-5xl lg:mt-12">
            <AboutExperienceTimeline
              milestones={METHODE_MILESTONES}
              navigationAriaLabel="Notre méthode en quatre étapes"
            />
          </div>
        </Block>

        <DefiscalMergedActionBand />

        <Block labelledBy="defiscal-faq-title" className="border-t border-[#1f2a7c]/10">
          <div className={contentMax}>
            <h2
              id="defiscal-faq-title"
              className={cn(
                "mt-0 text-balance text-[clamp(1.28rem,3.2vw,2.05rem)] font-normal leading-[1.08] tracking-[-0.038em]",
                prose,
              )}
            >
              <MarketingHighlight>
                FAQ
              </MarketingHighlight>
              ,{" "}
              <MarketingHighlight>
                vigilance
              </MarketingHighlight>{" "}
              et{" "}
              <MarketingHighlight>
                liens utiles
              </MarketingHighlight>
              .
            </h2>
            <p
              className={cn(
                "mx-auto mt-6 max-w-2xl rounded-2xl border border-[#1f2a7c]/14 bg-[#1f2a7c]/[0.05] px-5 py-4 text-left text-[14px] leading-relaxed sm:px-6 sm:text-[15px]",
                prose,
              )}
            >
              Les dispositifs fiscaux peuvent dépendre de{" "}
              <MarketingHighlight>
                plafonds
              </MarketingHighlight>
              , de{" "}
              <MarketingHighlight>
                conditions d’éligibilité
              </MarketingHighlight>
              , d’une{" "}
              <MarketingHighlight>
                durée d’engagement
              </MarketingHighlight>
              , d’un{" "}
              <MarketingHighlight>
                niveau de risque
              </MarketingHighlight>{" "}
              et de la situation personnelle du client.{" "}
              <MarketingHighlight>
                Une simulation personnalisée
              </MarketingHighlight>{" "}
              reste indispensable.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <FaqAccordion items={content.faq} questionEmphasis="highlight" />
          </div>

          <div className="mx-auto mt-8 flex max-w-3xl justify-center px-2">
            <Link
              href={FAQ_HREF}
              className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#1f2a7c] bg-white px-7 py-3.5 text-sm font-semibold text-[#1f2a7c] shadow-sm transition-colors hover:bg-[#1f2a7c]/[0.06] hover:shadow-md sm:px-8 sm:text-[15px]"
            >
              Toute la FAQ du site
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 opacity-90 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
          <div className="mx-auto mt-12 max-w-3xl border-t border-[#1f2a7c]/10 pt-10 text-center">
            <p className={kicker}>Sources officielles</p>
            <ul className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5">
              {SOURCES_OFFICIELLES.map((src) => (
                <li key={src.href}>
                  <a
                    href={src.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#1f2a7c]/70 underline decoration-[#1f2a7c]/25 underline-offset-4 transition-colors hover:text-[#1f2a7c] hover:decoration-[#1f2a7c]/50"
                  >
                    {src.label}
                    <span className="sr-only"> (ouvre un nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {otherServices.length ? (
            <div className="mx-auto mt-10 max-w-5xl border-t border-[#1f2a7c]/10 pt-10 text-center">
              <p className={kicker}>Voir aussi</p>
              <ul className="mx-auto mt-5 grid max-w-3xl gap-2.5 sm:grid-cols-2 sm:gap-3">
                {otherServices.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={service.href}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-[#1f2a7c]/10 bg-white px-4 py-3.5 text-left text-[15px] font-medium text-[#1f2a7c] transition-colors hover:border-[#1f2a7c]/22"
                    >
                      <span className="min-w-0">{service.name}</span>
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 shrink-0 text-[#1f2a7c]/30 transition-transform group-hover:translate-x-0.5 group-hover:text-[#1f2a7c]/50"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Block>
      </section>
    </main>
  );
}
