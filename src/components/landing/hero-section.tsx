import { HeroBackground } from "@/components/landing/hero-background";
import { Highlight } from "@/components/ui/highlight";
import { CtaPrimaryLink, heroCtaRowClassName } from "@/components/ui/cta-link";
import { ContactGlassLink } from "@/components/ui/contact-glass-link";
import { GoogleLogo } from "@/components/ui/google-logo";
import { HERO_LANDING_CONTENT_CLASS, LANDING_HERO_RADIUS_CLASS, LANDING_HERO_SECTION_CLASS } from "@/lib/content/hero-shell";
import { CONTACT_HREF, NOTRE_CABINET_HREF } from "@/lib/content/routes";
import { googleBadgeClassName } from "@/lib/styles/cta";
import { cn } from "@/lib/utils";

function GoogleBadge() {
  return (
    <div
      className={cn(googleBadgeClassName, "text-[11px] font-medium leading-none text-white/90")}
      aria-label="Note Google 5 sur 5 - cabinet indépendant à Perpignan"
    >
      <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
        <GoogleLogo className="size-3" aria-hidden />
      </span>
      <span className="shrink-0 tracking-[0.05em] text-amber-300/95" aria-hidden>
        ★★★★★
      </span>
      <span className="shrink-0 text-white/90">5,0 Google</span>
      <span className="hidden shrink-0 text-white/35 sm:inline" aria-hidden>
        ·
      </span>
      <span className="hidden min-w-0 truncate text-white/75 sm:inline">
        Cabinet indépendant à Perpignan
      </span>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="accueil" className={LANDING_HERO_SECTION_CLASS}>
      <HeroBackground className={LANDING_HERO_RADIUS_CLASS} />

        <div className={HERO_LANDING_CONTENT_CLASS}>
          <div className="mx-auto flex w-full max-w-none flex-col px-4 sm:px-7 xl:block xl:px-11">
            <div
              className={cn(
                "mx-auto flex w-full max-w-5xl flex-col text-center xl:mx-0 xl:text-left",
                "max-xl:mt-[clamp(6rem,28vh,10.5rem)] max-xl:gap-4",
                "xl:mt-52",
              )}
            >
              <div className="flex justify-center xl:justify-start">
                <GoogleBadge />
              </div>

              <h1 className="w-full max-w-5xl text-balance text-center text-[clamp(2.125rem,5.75vw,4.875rem)] font-normal leading-[1.15] tracking-[-0.03em] text-white sm:leading-[1.2] xl:text-left">
                <span className="block">Conseil en gestion de</span>
                <span className="mt-0 block">
                  patrimoine à{" "}
                  <Highlight variant="dark" delay="hero" className="rounded-xl px-3 pb-1.5">
                    Perpignan
                  </Highlight>
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-balance text-[15px] leading-[1.55] text-white/80 max-xl:mt-0 sm:text-lg sm:leading-[1.75] xl:mx-0 xl:mt-5">
                Lefèvre Conseil accompagne particuliers, dirigeants et professions libérales dans leurs
                décisions patrimoniales : placements, retraite, transmission, prévoyance et fiscalité, au
                cabinet à Perpignan ou à distance.
              </p>

              <div className={cn("max-xl:mt-0 xl:mt-6", heroCtaRowClassName, "max-xl:gap-2 xl:justify-start")}>
                <CtaPrimaryLink
                  href={CONTACT_HREF}
                  className="max-sm:!h-12 max-sm:!min-h-12 max-sm:!w-auto max-sm:!flex-none max-sm:!px-5 max-sm:!text-sm"
                >
                  Prendre rendez-vous
                </CtaPrimaryLink>
                <ContactGlassLink
                  href={NOTRE_CABINET_HREF}
                  light
                  layout="hero"
                  className="max-sm:!h-12 max-sm:!min-h-12 max-sm:!w-auto max-sm:!flex-none max-sm:!px-5 max-sm:!text-sm"
                >
                  Découvrir le cabinet
                </ContactGlassLink>
              </div>

              <p className="mx-auto max-w-md text-balance text-center text-[12px] leading-relaxed text-white/55 max-xl:mt-0 sm:text-[13px] xl:mx-0 xl:mt-3 xl:text-left">
                Premier échange offert · Sans engagement
              </p>
            </div>
          </div>
        </div>
      </section>
  );
}
