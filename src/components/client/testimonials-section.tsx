"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { GoogleLogo } from "@/components/ui/google-logo";
import { Highlight } from "@/components/ui/highlight";
import { cn } from "@/lib/utils";

/** Fiche / avis Google Local (Perpignan). */
const GOOGLE_REVIEWS_HREF =
  "https://www.google.com/search?sa=X&sca_esv=0cc88c52acce4ba2&sxsrf=ANbL-n4YRVknCa2MuHG4WnBzzZ3gjC_slw:1778781310216&q=avis%20sur%20lefevre-conseil%20perpignan&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxNDM2NrQ0MzczN7a0sDQAYjPzDYyMrxiVEssyixWKS4sUclLTUsuKUnWT8_OKUzNzFApSiwoy0_MS8xaxEqEIAGy4T8hlAAAA&rldimm=16331967673989098967&tbm=lcl&hl=fr-FR&ved=0CBAQ5foLahcKEwj4-vbirLmUAxUAAAAAHQAAAAAQCQ&biw=2137&bih=1232&dpr=1.6#lkt=LocalPoiReviews&arid=ChZDSUhNMG9nS0VJQ0FnTUNRN1lxM2Z3EAE";

type QuotePart = { text: string; strong?: boolean };

type ShowcaseTestimonial = {
  id: number;
  /** Segments du témoignage ; `strong` = mise en avant en gras. */
  quoteParts: readonly QuotePart[];
  author: string;
  /** Photo Google ; `null` = pastille initiales (`initials`). */
  avatar: string | null;
  initials?: string;
};

const showcaseTestimonials: ShowcaseTestimonial[] = [
  {
    id: 1,
    quoteParts: [
      { text: "Je travaille avec Philippe Lefevre depuis " },
      { text: "10 ans", strong: true },
      { text: ". Je l'ai toujours vu " },
      { text: "investi et assurant le suivi de ses clients", strong: true },
      { text: ". Un " },
      { text: "vrai indépendant", strong: true },
      {
        text: " motivé par la satisfaction de ses clients. C'est probablement ce qui lui permet de ne travailler qu'en ",
      },
      { text: "recommandation", strong: true },
      { text: "." },
    ],
    author: "Jean-Sébastien Maury",
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjXVNIYlruXRO89Vyix8M7iR3aDuVuBfyzCZFRrKxGUCGmdasw=w115-h115-p-rp-mo-br100",
  },
  {
    id: 2,
    quoteParts: [
      { text: "Équipe professionnelle", strong: true },
      {
        text: " qui sait accompagner ses clients en tout point et à n'importe quel moment. Ce qui est super, c'est que nous pouvons bénéficier de leurs ",
      },
      { text: "expertises", strong: true },
      { text: " dans les différents domaines. " },
      { text: "Je recommande vivement !", strong: true },
    ],
    author: "Angélique Hirmance",
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjXqTFzbLVypqz1_U5-Hm0G1CxDbeOUgg7nBaDMCyKaMCM0zUas=w115-h115-p-rp-mo-ba12-br100",
  },
  {
    id: 3,
    quoteParts: [
      { text: "Client de Lefèvre Conseil, je suis " },
      { text: "très satisfait", strong: true },
      { text: " des solutions de placement financier proposées. L'expertise sur les " },
      { text: "contrats de capitalisation", strong: true },
      {
        text: " et la gestion de l'épargne est évidente. Une approche professionnelle qui apporte une ",
      },
      { text: "vraie valeur ajoutée", strong: true },
      { text: " pour sécuriser son capital. Un " },
      { text: "cabinet de gestion de patrimoine de confiance", strong: true },
      { text: " que je recommande vivement." },
    ],
    author: "Alain PANTEL-RULI",
    avatar: null,
    initials: "AP",
  },
];

/** Badge type hero, lien vers les avis Google - flèche au survol. */
function GoogleBadgeReviewsLink() {
  return (
    <LiquidButton
      variant="stable"
      asChild
      className="group relative h-9 whitespace-nowrap rounded-full border border-[#1f2a7c]/22 bg-white px-2.5 py-1 text-[#1f2a7c] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_24px_rgba(31,42,124,0.12)] transition-colors hover:bg-[#1f2a7c]/[0.04] hover:scale-100"
    >
      <a
        href={GOOGLE_REVIEWS_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5"
        aria-label="Voir les avis Google du cabinet (ouvre dans un nouvel onglet)"
      >
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#1f2a7c]/10">
          <GoogleLogo className="size-3.5" />
        </span>
        <span className="text-[15px] leading-none tracking-[0.08em] text-amber-500">★★★★★</span>
        <span className="ml-0.5 text-[11px] font-medium leading-none text-[#1f2a7c]/90">5,0</span>
        <span className="inline-flex size-3.5 shrink-0 items-center justify-center" aria-hidden>
          <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </a>
    </LiquidButton>
  );
}

export function LefevreUniqueTestimonials() {
  const testimonials = showcaseTestimonials;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [displayedParts, setDisplayedParts] = React.useState<readonly QuotePart[]>(testimonials[0]!.quoteParts);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [mobileQuoteExpanded, setMobileQuoteExpanded] = React.useState(false);

  const activeTestimonial = testimonials[activeIndex]!;
  const isAlainReview = activeTestimonial.author === "Alain PANTEL-RULI";

  React.useEffect(() => {
    setMobileQuoteExpanded(false);
  }, [activeIndex]);

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);

    window.setTimeout(() => {
      setDisplayedParts(testimonials[index]!.quoteParts);
      setActiveIndex(index);
      window.setTimeout(() => setIsAnimating(false), 400);
    }, 200);
  };

  return (
    <div className="flex w-full max-w-full flex-col items-center gap-8 py-6 sm:gap-10 sm:py-8 md:py-10 lg:max-w-6xl xl:max-w-7xl">
      <div className="relative mx-auto w-full max-w-full rounded-[1.25rem] border border-[#1f2a7c]/10 bg-gradient-to-b from-[#1f2a7c]/[0.045] to-white px-5 pb-7 pt-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] sm:rounded-3xl sm:px-9 sm:pb-9 sm:pt-10 md:max-w-4xl md:px-10 lg:max-w-5xl xl:max-w-6xl xl:px-12 xl:pb-10 xl:pt-11">
        <span
          className="pointer-events-none absolute -left-0 -top-3 select-none font-serif text-6xl text-[#1f2a7c]/[0.1] sm:-left-1 sm:-top-5 sm:text-7xl"
          aria-hidden
        >
          &ldquo;
        </span>

        <div className="relative z-[1] mx-auto w-full max-w-4xl xl:max-w-5xl">
          <p
            id="avis-quote-text"
            key={activeIndex}
            className={cn(
              "text-center text-lg font-light leading-relaxed text-neutral-800 transition-all duration-[400ms] ease-out sm:text-xl md:text-2xl lg:text-[1.65rem] lg:leading-[1.55] xl:text-[1.75rem] xl:leading-[1.52]",
              isAlainReview && !mobileQuoteExpanded && "line-clamp-5 md:line-clamp-none",
              isAnimating ? "scale-[0.98] opacity-0 blur-sm" : "scale-100 opacity-100 blur-0",
            )}
          >
            {displayedParts.map((part, i) =>
              part.strong ? (
                <strong key={i} className="font-semibold text-neutral-900">
                  {part.text}
                </strong>
              ) : (
                <React.Fragment key={i}>{part.text}</React.Fragment>
              ),
            )}
          </p>
          {isAlainReview ? (
            <button
              type="button"
              className="mx-auto mt-4 inline-flex min-h-10 items-center justify-center rounded-full border border-[#1f2a7c]/25 bg-white px-5 py-2 text-sm font-semibold text-[#1f2a7c] shadow-sm transition-colors hover:bg-[#1f2a7c]/[0.06] active:scale-[0.99] md:hidden"
              aria-expanded={mobileQuoteExpanded}
              aria-controls="avis-quote-text"
              onClick={() => setMobileQuoteExpanded((v) => !v)}
            >
              {mobileQuoteExpanded ? "Voir moins" : "Voir +"}
            </button>
          ) : null}
        </div>

        <span
          className="pointer-events-none absolute -bottom-5 -right-0 select-none font-serif text-6xl text-[#1f2a7c]/[0.1] sm:-bottom-7 sm:text-7xl"
          aria-hidden
        >
          &rdquo;
        </span>
      </div>

      <div className="mt-1 flex flex-col items-center gap-4 sm:gap-5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {testimonials.map((testimonial, index) => {
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index && !isActive;
            const showName = isActive || isHovered;

            return (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "relative flex cursor-pointer items-center gap-0 rounded-full",
                  "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isActive ? "bg-[#1f2a7c] shadow-lg shadow-[#1f2a7c]/25" : "bg-transparent hover:bg-[#1f2a7c]/[0.08]",
                  showName ? "py-2 pl-2 pr-4" : "p-0.5",
                )}
              >
                <div className="relative shrink-0">
                  {testimonial.avatar ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- avatar Google client */
                  <img
                    src={testimonial.avatar}
                    alt={`Photo de ${testimonial.author}`}
                      className={cn(
                        "size-8 rounded-full object-cover transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                        isActive ? "ring-2 ring-white/50" : "ring-0",
                        !isActive && "hover:scale-105",
                      )}
                    />
                  ) : (
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1f2a7c] text-[11px] font-bold tracking-tight text-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                        isActive ? "ring-2 ring-white/50" : "ring-0",
                        !isActive && "hover:scale-105",
                      )}
                      aria-hidden
                    >
                      {testimonial.initials ?? "?"}
                    </span>
                  )}
                </div>

                <div
                  className={cn(
                    "grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    showName ? "ml-2 grid-cols-[1fr] opacity-100" : "ml-0 grid-cols-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <span
                      className={cn(
                        "block whitespace-nowrap text-sm font-medium transition-colors duration-300",
                        isActive ? "text-white" : "text-neutral-900",
                      )}
                    >
                      {testimonial.author}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section id="avis-clients" className="relative my-10 scroll-mt-28 bg-white sm:my-14 md:my-20">
      <div className="container z-10 mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-32px" }}
          className="mx-auto flex w-full max-w-[640px] flex-col items-center justify-center text-center lg:max-w-5xl xl:max-w-6xl"
        >
          <h2 className="w-full text-balance text-center text-[clamp(1.5rem,4.2vw,2.65rem)] font-normal leading-[1.08] tracking-[-0.04em] text-neutral-900 sm:text-[clamp(1.625rem,3.8vw,2.75rem)]">
            Ce que{" "}
            <Highlight variant="light" className="rounded-xl px-1.5 pb-0.5">
              nos clients
            </Highlight>{" "}
            disent
          </h2>
          <div className="mt-4 flex justify-center sm:mt-5">
            <GoogleBadgeReviewsLink />
          </div>
        </motion.div>

        <div className="mx-auto flex justify-center">
          <LefevreUniqueTestimonials />
        </div>
      </div>
    </section>
  );
}
