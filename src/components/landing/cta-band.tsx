import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  HERO_BACKGROUND_DESKTOP_SRC,
  HERO_BACKGROUND_MOBILE_SRC,
} from "@/components/landing/hero-background";
import { cn } from "@/lib/utils";
import { CtaPrimaryLink, heroCtaRowClassName } from "@/components/ui/cta-link";
import { ContactGlassLink } from "@/components/ui/contact-glass-link";
import { heroCtaRowCompactClassName } from "@/lib/styles/cta";
import { CONSEILS_HREF, CONTACT_HREF, SIMULATION_HREF, articleHref } from "@/lib/content/routes";
import { HOME_ARTICLES_TEASER } from "@/lib/content/articles";

type CtaBandProps = {
  /** Texte au-dessus du titre ; `false` masque la ligne (défaut : « Prochaine étape » si omis). */
  eyebrow?: string | false;
  /** Image de fond ; si absent, dégradé bleu seul. */
  backgroundImage?: boolean;
  /**
   * Avec `backgroundImage` : remplace le portrait cabinet (webp CDN) par ce visuel
   * (ex. carte Défiscalisation du carrousel - JPEG local).
   */
  backgroundImageSrc?: string;
  /** Voile et dégradé noirs plus marqués (lisibilité + ambiance plus sombre). */
  deepBlackOverlay?: boolean;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /** Utile quand le haut de page propose déjà simulation + contact. */
  showSecondaryCta?: boolean;
  /** Typo titre / texte + grille CTA comme le hero (accueil). */
  heroTypography?: boolean;
  /** Libellés responsive + flèche comme le CTA simulation du hero. */
  primaryWithSimulationArrow?: boolean;
  /** Sous les CTA : liens vers trois articles + page Conseils (accueil). */
  latestAdviceTeaser?: boolean;
};

export function CtaBand({
  eyebrow: eyebrowProp,
  backgroundImage = false,
  backgroundImageSrc,
  deepBlackOverlay = false,
  title = "Discutons de votre situation.",
  description = "Un premier échange, confidentiel et sans engagement, pour comprendre vos objectifs et voir comment nous pouvons vous accompagner.",
  primaryLabel = "Faire une simulation",
  primaryHref = SIMULATION_HREF,
  secondaryLabel = "Contact",
  secondaryHref = CONTACT_HREF,
  showSecondaryCta = true,
  heroTypography = false,
  primaryWithSimulationArrow = false,
  latestAdviceTeaser = false,
}: CtaBandProps) {
  const eyebrowHidden = eyebrowProp === false;
  const eyebrowText = eyebrowHidden ? null : (eyebrowProp ?? "Prochaine étape");

  return (
    <section
      aria-labelledby="cta-band-title"
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-[#1f2a7c]/15 px-6 py-10 text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.5)] sm:px-10 sm:py-12 lg:px-14 lg:py-14",
        !backgroundImage && "bg-gradient-to-br from-[#1f2a7c] via-[#1f2a7c] to-[#0f164a]",
      )}
    >
      {backgroundImage ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {backgroundImageSrc ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- asset local ou CDN arbitraire */}
                <img
                  src={backgroundImageSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  sizes="(min-width: 1024px) 80vw, 100vw"
                />
              </>
            ) : (
              <picture className="absolute inset-0 block h-full w-full">
                <source media="(min-width: 1024px)" srcSet={HERO_BACKGROUND_DESKTOP_SRC} type="image/webp" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO_BACKGROUND_MOBILE_SRC}
                  alt=""
                  className="h-full w-full object-cover object-center"
                  sizes="(min-width: 1024px) 80vw, 100vw"
                />
              </picture>
            )}
            {/* Même traitement que le hero ; `deepBlackOverlay` renforce le dégradé noir. */}
            <div
              className={cn(
                "absolute inset-0",
                deepBlackOverlay ? "bg-black/[0.58]" : "bg-black/40",
              )}
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-b xl:bg-gradient-to-r",
                deepBlackOverlay
                  ? "from-black/80 via-black/68 to-black/52 xl:from-black/[0.88] xl:via-black/62 xl:to-black/38"
                  : "from-black/55 via-black/42 to-black/22 xl:from-black/60 xl:via-black/30 xl:to-transparent",
              )}
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_55%)]"
          />
        </>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_55%)]"
        />
      )}
      <div
        className={cn(
          "relative z-[2] flex flex-col",
          heroTypography
            ? "min-h-0 gap-0 sm:min-h-0"
            : "min-h-[min(20rem,52svh)] gap-8 sm:min-h-[18rem] lg:gap-10",
        )}
      >
        <div>
          {eyebrowText ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">{eyebrowText}</p>
          ) : null}
          <h2
            id="cta-band-title"
            className={cn(
              eyebrowText ? "mt-3" : "mt-0",
              heroTypography
                ? "w-full max-w-5xl text-balance text-[clamp(1.75rem,5vw,3.5rem)] font-normal leading-[1.05] tracking-[-0.045em] text-white"
                : "text-2xl font-semibold tracking-tight text-white sm:text-3xl",
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "max-w-2xl",
              heroTypography
                ? "mt-6 text-balance text-[15px] font-normal leading-[1.55] text-white/80 sm:mt-8 sm:text-lg sm:leading-8"
                : "mt-3 text-[15px] leading-relaxed text-white/75",
            )}
          >
            {description}
          </p>
        </div>
        <div
          className={cn(
            heroTypography ? heroCtaRowClassName : heroCtaRowCompactClassName,
            heroTypography
              ? "mt-10 sm:mt-12"
              : "mt-auto gap-2.5 border-t border-white/10 pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 sm:border-t-0 sm:pt-0 lg:justify-start",
          )}
        >
          <CtaPrimaryLink
            href={primaryHref}
            className={cn(
              "group",
              !heroTypography && "lg:min-w-[12.5rem] lg:px-6",
              heroTypography && "lg:min-w-[14rem] xl:min-w-[14rem]",
            )}
          >
            {primaryWithSimulationArrow ? (
              <>
                <span className="md:hidden">Simulation</span>
                <span className="hidden md:inline">{primaryLabel}</span>
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </>
            ) : (
              primaryLabel
            )}
          </CtaPrimaryLink>
          {showSecondaryCta ? (
            <ContactGlassLink
              href={secondaryHref}
              light
              layout="hero"
              className={cn(!heroTypography && "lg:min-w-[8.75rem] lg:px-5", heroTypography && "xl:min-w-[10.25rem]")}
            >
              {secondaryLabel}
            </ContactGlassLink>
          ) : null}
        </div>
        {latestAdviceTeaser ? (
          <div
            className={cn(
              "border-t border-white/15 pt-8",
              heroTypography ? "mt-10 sm:mt-12" : "mt-8 sm:mt-10",
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
              Nos derniers conseils
            </p>
            <ul className="mt-4 max-w-2xl space-y-3">
              {HOME_ARTICLES_TEASER.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={articleHref(article.slug)}
                    className="group block rounded-lg text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                  >
                    <span className="line-clamp-2 text-sm font-medium leading-snug text-white transition-colors group-hover:text-white/90">
                      {article.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-white/50">
                      {article.category} · {article.date}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={CONSEILS_HREF}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
            >
              Tous les conseils
              <ArrowUpRight aria-hidden className="size-3.5 shrink-0 opacity-90" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
