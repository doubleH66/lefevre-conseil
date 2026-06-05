import { ArrowUpRight } from "lucide-react";
import {
  HERO_BACKGROUND_DESKTOP_SRC,
  HERO_BACKGROUND_MOBILE_SRC,
} from "@/components/landing/hero-background";
import { cn } from "@/lib/utils";
import { CtaPrimaryLink, heroCtaRowClassName } from "@/components/ui/cta-link";
import { ContactGlassLink } from "@/components/ui/contact-glass-link";
import { heroCtaRowCompactClassName } from "@/lib/styles/cta";
import { CONTACT_HREF, NOTRE_CABINET_HREF } from "@/lib/content/routes";

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
  /** Titre, texte et bouton centrés — bandeau final compact. */
  centered?: boolean;
};

export function CtaBand({
  eyebrow: eyebrowProp,
  backgroundImage = false,
  backgroundImageSrc,
  deepBlackOverlay = false,
  title = "Discutons de votre situation.",
  description = "Un premier échange, confidentiel et sans engagement, pour comprendre vos objectifs et voir comment nous pouvons vous accompagner.",
  primaryLabel = "Prendre rendez-vous",
  primaryHref = CONTACT_HREF,
  secondaryLabel = "Découvrir le cabinet",
  secondaryHref = NOTRE_CABINET_HREF,
  showSecondaryCta = true,
  heroTypography = false,
  primaryWithSimulationArrow = false,
  centered = false,
}: CtaBandProps) {
  const eyebrowHidden = eyebrowProp === false;
  const eyebrowText = eyebrowHidden ? null : (eyebrowProp ?? "Prochaine étape");
  const compactCentered = centered && !showSecondaryCta && !heroTypography;

  return (
    <section
      aria-labelledby="cta-band-title"
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-[#1f2a7c]/15 text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.5)]",
        compactCentered
          ? "px-6 py-10 sm:px-9 sm:py-11 lg:px-12 lg:py-12"
          : "px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14",
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
          compactCentered && "items-center gap-6 text-center sm:gap-7",
          heroTypography
            ? "min-h-0 gap-0 sm:min-h-0"
            : showSecondaryCta
              ? "min-h-[min(20rem,52svh)] gap-8 sm:min-h-[18rem] lg:gap-10"
              : !compactCentered && "gap-8 lg:gap-9",
        )}
      >
        <div className={cn(compactCentered && "w-full max-w-xl sm:max-w-2xl")}>
          {eyebrowText ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">{eyebrowText}</p>
          ) : null}
          <h2
            id="cta-band-title"
            className={cn(
              eyebrowText ? "mt-3" : "mt-0",
              heroTypography
                ? "w-full max-w-5xl text-balance text-[clamp(1.75rem,5vw,3.5rem)] font-normal leading-[1.05] tracking-[-0.045em] text-white"
                : compactCentered
                  ? "text-balance text-[clamp(1.35rem,4vw,1.875rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-3xl"
                  : "text-2xl font-semibold tracking-tight text-white sm:text-3xl",
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              compactCentered ? "mx-auto mt-3 max-w-lg text-balance sm:max-w-xl" : "max-w-2xl",
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
              : showSecondaryCta
                ? "mt-auto gap-2.5 border-t border-white/10 pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 sm:border-t-0 sm:pt-0 lg:justify-start"
                : compactCentered
                  ? "mt-1 justify-center"
                  : "mt-2 gap-3 sm:mt-3",
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
      </div>
    </section>
  );
}
