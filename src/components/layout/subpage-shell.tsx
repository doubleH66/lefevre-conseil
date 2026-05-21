import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BilanCtaSection } from "@/components/landing/bilan-cta-section";
import { SubpageHeaderBackground } from "@/components/layout/subpage-header-background";
import { SiteFooter } from "@/components/layout/site-footer";
import { SubpageHeroTagline } from "@/components/layout/subpage-hero-tagline";
import { CtaPrimaryLink, heroCtaRowClassName } from "@/components/ui/cta-link";
import { ContactGlassLink } from "@/components/ui/contact-glass-link";
import { GoogleLogo } from "@/components/ui/google-logo";
import {
  BILAN_PATRIMOINE_HREF,
  SIMULATION_ANCHOR_ID,
} from "@/lib/content/routes";
import { googleBadgeClassName } from "@/lib/styles/cta";
import { cn } from "@/lib/utils";

export type SubpageBreadcrumb = {
  label: string;
  href?: string;
};

export type SubpageHeroLead = {
  title: string;
  tagline: string;
  titleId?: string;
  taglineHighlightAfter?: string;
  category?: string;
  intro?: string;
  showGoogleBadge?: boolean;
  showHeroCtas?: boolean;
  heroStyle?: "service" | "editorial";
};

const serviceShellH1Class =
  "text-balance text-[clamp(2.375rem,6.5vw+0.35rem,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.42)] sm:tracking-[-0.04em] lg:text-[clamp(2.75rem,5.2vw+1rem,4.75rem)]";

const editorialShellH1Class =
  "text-balance text-[clamp(2.25rem,7vw,5.5rem)] font-normal leading-[1.05] tracking-[-0.045em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.42)]";

function SubpageHeroGoogleBadge() {
  return (
    <div className={cn(googleBadgeClassName, "relative top-0 mb-3 sm:mb-4")} aria-label="Note Google : 5 sur 5 - 13 avis">
      <span className="inline-flex size-6 items-center justify-center rounded-full bg-white shadow-sm">
        <GoogleLogo className="size-3.5" />
      </span>
      <span className="text-[15px] leading-none tracking-[0.08em] text-amber-300">★★★★★</span>
      <span className="ml-0.5 text-[11px] font-medium leading-none text-white/85">5,0</span>
    </div>
  );
}

type SubpageShellProps = {
  children: React.ReactNode;
  breadcrumbs?: readonly SubpageBreadcrumb[];
  heroMinHeightClass?: string;
  heroLead?: SubpageHeroLead;
  bannerMode?: "photo" | "content";
  hideBilanCta?: boolean;
};

/** Gabarit pages intérieures : bandeau photo, fil d’Ariane, contenu, footer (sans navbar V1). */
export function SubpageShell({
  children,
  breadcrumbs,
  heroMinHeightClass = "min-h-[11.25rem] sm:min-h-[13.75rem] lg:min-h-[17.5rem] xl:min-h-[20rem]",
  heroLead,
  bannerMode = "photo",
  hideBilanCta = false,
}: SubpageShellProps) {
  const richHero =
    !!heroLead &&
    (heroLead.heroStyle === "editorial" ||
      heroLead.category ||
      heroLead.intro ||
      heroLead.showGoogleBadge ||
      heroLead.showHeroCtas);
  const editorial = heroLead?.heroStyle === "editorial";

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-white text-neutral-950">
      {bannerMode === "photo" ? (
        <div className="relative z-20" data-nav-theme="dark">
          <section
            className={cn(
              "relative isolate mx-2.5 mt-2.5 overflow-hidden rounded-3xl border border-black/10 bg-black lg:mx-4 lg:mt-3 lg:rounded-[3rem]",
              heroMinHeightClass,
            )}
          >
            <SubpageHeaderBackground />

            {heroLead ? (
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 z-10 flex flex-col px-4 pt-10 sm:px-7 sm:pt-11 lg:px-11 lg:pt-12",
                  richHero
                    ? cn("justify-end", breadcrumbs?.length ? "pb-24 sm:pb-28" : "pb-20")
                    : cn("justify-center", breadcrumbs?.length ? "pb-20 sm:pb-24" : "pb-8"),
                )}
              >
                <div
                  className={cn(
                    "pointer-events-auto mx-auto w-full max-w-[min(100%,52rem)] px-1 text-center sm:max-w-[min(100%,56rem)] lg:max-w-[min(100%,60rem)]",
                    editorial && "max-w-5xl xl:mx-0 xl:max-w-5xl xl:text-left",
                    !richHero && "translate-y-1 sm:translate-y-1.5",
                  )}
                >
                  <div className={cn("flex flex-col", editorial && "items-center xl:items-start")}>
                    {heroLead.showGoogleBadge ? (
                      <div className={cn("flex justify-center", editorial && "xl:justify-start")}>
                        <SubpageHeroGoogleBadge />
                      </div>
                    ) : null}
                    {heroLead.category ? (
                      <p
                        className={cn(
                          "mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55",
                          editorial && "xl:text-left",
                        )}
                      >
                        {heroLead.category}
                      </p>
                    ) : null}
                    <h1
                      id={heroLead.titleId ?? "subpage-hero-title"}
                      className={editorial ? editorialShellH1Class : serviceShellH1Class}
                    >
                      {heroLead.title}
                    </h1>
                    <div
                      className={cn(
                        editorial && "[&_p]:xl:mx-0 [&_p]:xl:max-w-[min(100%,48rem)] [&_p]:xl:text-left",
                      )}
                    >
                      <SubpageHeroTagline
                        text={heroLead.tagline}
                        highlightAfter={heroLead.taglineHighlightAfter}
                        animateOnMount={!!heroLead.taglineHighlightAfter}
                      />
                    </div>
                    {heroLead.intro ? (
                      <p
                        className={cn(
                          "mx-auto mt-5 max-w-2xl text-pretty text-[15px] font-normal leading-[1.55] text-white/80 sm:mt-6 sm:text-lg sm:leading-8",
                          editorial && "xl:mx-0",
                        )}
                      >
                        {heroLead.intro}
                      </p>
                    ) : null}
                    {heroLead.showHeroCtas ? (
                      <div
                        id={SIMULATION_ANCHOR_ID}
                        className={cn(
                          "mt-8 sm:mt-10",
                          heroCtaRowClassName,
                          editorial && "max-sm:gap-2 xl:justify-start",
                        )}
                      >
                        <CtaPrimaryLink
                          href={BILAN_PATRIMOINE_HREF}
                          className="group max-sm:!h-12 max-sm:!min-h-12 max-sm:!w-auto max-sm:!flex-none max-sm:gap-2 max-sm:!px-5 max-sm:!text-sm"
                        >
                          <span className="md:hidden">Bilan</span>
                          <span className="hidden md:inline">Réaliser mon bilan patrimonial</span>
                          <ArrowUpRight
                            aria-hidden
                            className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </CtaPrimaryLink>
                        <ContactGlassLink
                          light
                          layout="hero"
                          className="max-sm:!h-12 max-sm:!min-h-12 max-sm:!w-auto max-sm:!flex-none max-sm:px-5 max-sm:!text-sm"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {breadcrumbs?.length ? (
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/40 via-black/15 to-transparent px-4 sm:px-7 lg:px-11",
                  heroLead ? "pb-3 pt-8 sm:pb-3.5 sm:pt-9" : "pb-3.5 pt-11 sm:pb-4 sm:pt-12",
                )}
              >
                <nav aria-label="Fil d’Ariane" className="pointer-events-auto">
                  <ol className="flex flex-wrap items-baseline gap-y-0.5 text-[11px] font-medium tracking-[0.02em] text-white/55 sm:text-xs">
                    {breadcrumbs.map((crumb, index) => (
                      <li key={`${crumb.label}-${index}`} className="flex items-baseline">
                        {index > 0 ? (
                          <span
                            className="select-none px-1.5 text-[9px] text-white/20 sm:px-2 sm:text-[10px]"
                            aria-hidden
                          >
                            ·
                          </span>
                        ) : null}
                        {crumb.href ? (
                          <Link
                            href={crumb.href}
                            className="rounded-sm text-white/70 outline-none ring-white/30 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/0"
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="text-white/90" aria-current="page">
                            {crumb.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}

      <div className="relative z-0 flex flex-1 flex-col" data-nav-theme="light">
        {children}
      </div>

      {hideBilanCta ? null : (
        <div data-nav-theme="dark">
          <BilanCtaSection className="mx-2.5 mb-12 mt-10 sm:mt-12 lg:mx-4 lg:mb-16" />
        </div>
      )}

      <div data-nav-theme="dark">
        <SiteFooter />
      </div>
    </div>
  );
}
