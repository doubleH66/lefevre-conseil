import { ArrowUpRight } from "lucide-react";
import { HeroBackground } from "@/components/landing/hero-background";
import { Highlight } from "@/components/ui/highlight";
import { CtaPrimaryLink, heroCtaRowClassName } from "@/components/ui/cta-link";
import { ContactGlassLink } from "@/components/ui/contact-glass-link";
import { GoogleLogo } from "@/components/ui/google-logo";
import { SIMULATION_ANCHOR_ID, SIMULATION_HREF } from "@/lib/content/routes";
import { googleBadgeClassName } from "@/lib/styles/cta";
import { cn } from "@/lib/utils";

function GoogleBadge() {
  return (
    <div className={googleBadgeClassName} aria-label="Note Google : 5 sur 5 - 13 avis">
      <span className="inline-flex size-6 items-center justify-center rounded-full bg-white shadow-sm">
        <GoogleLogo className="size-3.5" />
      </span>
      <span className="text-[15px] leading-none tracking-[0.08em] text-amber-300">★★★★★</span>
      <span className="ml-0.5 text-[11px] font-medium leading-none text-white/85">5,0</span>
    </div>
  );
}

export function HeroSection() {
  return (
    <div className="relative z-20">
      <section
        id="accueil"
        className="relative isolate mx-2.5 mt-3 min-h-[85vh] overflow-hidden rounded-3xl border border-black/10 bg-black pb-24 lg:mx-4 lg:mt-4 lg:rounded-[3rem]"
      >
        <HeroBackground />

        <div className="relative z-10 py-20 pt-20 md:pb-16 lg:pb-16 lg:pt-28">
          <div className="mx-auto flex w-full max-w-none flex-col px-4 sm:px-7 xl:block xl:px-11">
            <div className="mx-auto w-full max-w-5xl text-center xl:mx-0 xl:text-left">
              <div className="mb-2 mt-6 flex justify-center sm:mt-8 xl:justify-start">
                <GoogleBadge />
              </div>

              <h1 className="mt-3 w-full max-w-5xl text-balance text-center text-[clamp(2.25rem,7vw,5.5rem)] font-normal leading-[1.05] tracking-[-0.045em] text-white sm:mt-6 md:mt-4 xl:mt-10 xl:text-left">
                <span className="block sm:inline sm:whitespace-nowrap">Faites travailler votre argent.</span>{" "}
                <span className="mt-1 block sm:mt-0 sm:inline">
                  <Highlight variant="dark" delay="hero" className="rounded-xl px-2 pb-1">
                    Réduisez vos impôts
                  </Highlight>
                  .
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-balance text-[15px] leading-[1.55] text-white/80 sm:mt-8 sm:text-lg sm:leading-8 md:hidden xl:mx-0">
                Patrimoine, fiscalité, placements :{" "}
                <strong className="font-semibold text-white">conseil indépendant</strong> à Perpignan, pour
                toute la France.
              </p>
              <p className="mx-auto mt-6 hidden max-w-2xl text-balance text-[15px] leading-[1.55] text-white/80 sm:mt-8 sm:text-lg sm:leading-8 md:block xl:mx-0">
                Particuliers ou dirigeants : un diagnostic clair pour{" "}
                <strong className="font-semibold text-white">développer votre patrimoine</strong>,{" "}
                <strong className="font-semibold text-white">alléger votre fiscalité</strong> et{" "}
                <strong className="font-semibold text-white">sécuriser vos investissements</strong> - cabinet
                indépendant, ancré à Perpignan, au service de toute la France.
              </p>

              <div
                id={SIMULATION_ANCHOR_ID}
                className={cn("mt-10 sm:mt-12", heroCtaRowClassName, "max-sm:gap-2")}
              >
                <CtaPrimaryLink
                  href={SIMULATION_HREF}
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
                  className="max-sm:!h-12 max-sm:!min-h-12 max-sm:!w-auto max-sm:!flex-none max-sm:!px-5 max-sm:!text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <a
          href="#apres-hero"
          className="pointer-events-auto absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center text-white/45 outline-none transition-colors hover:text-white/70 focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-black/25 xl:hidden"
          aria-label="Continuer : voir la suite de la page"
        >
          <span className="flex flex-col items-center -space-y-3" aria-hidden>
            <span className="hero-scroll-hint-a text-xl">⌄</span>
            <span className="hero-scroll-hint-b text-xl">⌄</span>
          </span>
        </a>
      </section>
    </div>
  );
}
