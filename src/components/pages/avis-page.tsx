import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  HeartHandshake,
  Lightbulb,
  MessageSquareQuote,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { MarketingHeading, MarketingSection } from "@/components/marketing/marketing-section";
import { AvisReviewsBrowser } from "@/components/pages/avis-reviews";
import { GoogleLogo } from "@/components/ui/google-logo";
import { CtaPrimaryLink } from "@/components/ui/cta-link";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { GOOGLE_REVIEWS_HREF } from "@/lib/content/reviews";
import {
  CONTACT_HREF,
  EXPERTISES_BASE_HREF,
  FAQ_HREF,
  NOTRE_CABINET_HREF,
} from "@/lib/content/routes";

const BREADCRUMBS = [
  { label: "Accueil", href: "/" },
  { label: "Avis clients" },
] as const;

const APPRECIATED: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: HeartHandshake,
    title: "L’écoute",
    text: "Une vraie prise en compte de votre situation, de vos objectifs et de vos contraintes avant toute préconisation.",
  },
  {
    icon: Lightbulb,
    title: "La pédagogie",
    text: "Des explications claires, sans jargon, pour comprendre chaque décision et garder la main sur votre patrimoine.",
  },
  {
    icon: Sparkles,
    title: "La clarté",
    text: "Des recommandations transparentes, sans promesse irréaliste ni produit imposé.",
  },
  {
    icon: Compass,
    title: "L’accompagnement sur mesure",
    text: "Une stratégie adaptée à votre profil - particulier, dirigeant ou profession libérale.",
  },
  {
    icon: MessageSquareQuote,
    title: "Le suivi dans le temps",
    text: "Un interlocuteur disponible qui assure le suivi de vos dossiers année après année.",
  },
];

const INTERNAL_LINKS: { href: string; label: string; description: string }[] = [
  {
    href: CONTACT_HREF,
    label: "Prendre rendez-vous",
    description: "Premier échange clair, confidentiel et sans engagement.",
  },
  {
    href: EXPERTISES_BASE_HREF,
    label: "Nos expertises",
    description: "Épargne, retraite, fiscalité, prévoyance, transmission, art.",
  },
  {
    href: NOTRE_CABINET_HREF,
    label: "Notre cabinet",
    description: "Qui est Lefèvre Conseil et comment nous travaillons.",
  },
  {
    href: FAQ_HREF,
    label: "Questions fréquentes",
    description: "Délais, rendez-vous, zone d’intervention et accompagnement à distance.",
  },
];

export function AvisPage() {
  return (
    <MarketingSubpage hero={PAGE_HEROES.avis} breadcrumbs={BREADCRUMBS} hideBilanCta>
      <div className="relative z-0 flex-1 bg-white pb-12 text-neutral-950 sm:pb-16">
        <AvisReviewsBrowser />

        {/* Ce que nos clients apprécient */}
        <MarketingSection labelledBy="avis-method-title" className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
          <MarketingHeading
            titleId="avis-method-title"
            title="Ce que nos clients apprécient"
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {APPRECIATED.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#1f2a7c]/[0.07]">
                  <Icon className="size-5 text-[#1f2a7c]" aria-hidden />
                </span>
                <h3 className="mt-3 text-[15px] font-semibold text-[#1f2a7c]">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#1f2a7c]/70">{text}</p>
              </li>
            ))}
          </ul>
        </MarketingSection>

        {/* CTA principal + secondaire */}
        <MarketingSection variant="flush" className="mx-auto mt-12 w-full max-w-5xl px-4 sm:mt-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-[#1f2a7c]/12 bg-[#1f2a7c] px-6 py-9 text-center text-white shadow-[0_20px_50px_-24px_rgba(31,42,124,0.8)] sm:px-10 sm:py-11">
            <h2 className="text-balance text-[clamp(1.4rem,3vw,2rem)] font-normal leading-tight tracking-[-0.03em]">
              Envie d’un accompagnement clair et indépendant ?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-[15px]">
              Le premier échange est gratuit et sans engagement, à Perpignan ou à distance partout en France.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CtaPrimaryLink href={CONTACT_HREF} className="group">
                Prendre rendez-vous
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </CtaPrimaryLink>
              <a
                href={GOOGLE_REVIEWS_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <GoogleLogo className="size-4" />
                Laisser un avis sur Google
              </a>
            </div>
          </div>
        </MarketingSection>

        {/* Maillage interne */}
        <MarketingSection labelledBy="avis-links-title" className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <MarketingHeading titleId="avis-links-title" title="Découvrir le cabinet" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {INTERNAL_LINKS.map((link) => (
              <li key={link.href} className="flex">
                <Link
                  href={link.href}
                  className="group flex h-full w-full items-start justify-between gap-4 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span>
                    <span className="block text-[15px] font-semibold text-[#1f2a7c]">{link.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-[#1f2a7c]/65">
                      {link.description}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="mt-0.5 size-5 shrink-0 text-[#1f2a7c]/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#1f2a7c]"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </MarketingSection>
      </div>
    </MarketingSubpage>
  );
}
