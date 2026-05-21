"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SERVICE_CATALOG } from "@/lib/content/services";
import { EXPERTISE_CAROUSEL_IMAGES } from "@/lib/content/services";
import { serviceDetailHref } from "@/lib/content/services";
import { cn } from "@/lib/utils";

export type HomeServiceSlide = {
  category: string;
  title: string;
  text: string;
  image: string;
  href: string;
};

function buildHomeServiceSlides(): HomeServiceSlide[] {
  return SERVICE_CATALOG.map((item) => ({
    category: "Nos expertises",
    title: item.title,
    text: item.summary,
    href: serviceDetailHref(item.slug),
    image: EXPERTISE_CAROUSEL_IMAGES[item.slug],
  }));
}

const homeServiceSlides = buildHomeServiceSlides();

/** Même style de titre que « Nos expertises » (couleur selon le fond). */
const CAROUSEL_RUBRIQUE_TYPO =
  "text-balance text-[clamp(1.35rem,3.8vw,2.125rem)] font-normal leading-[1.12] tracking-[-0.04em] md:leading-[1.08]";

/** Espace après la dernière carte : même logique que le padding page (évite la « demi-rubrique » vide). */
function CarouselTrackEndPadding() {
  return (
    <div
      aria-hidden
      className="pointer-events-none h-[430px] w-4 shrink-0 sm:w-7 md:h-[560px] xl:w-11"
    />
  );
}

function useCarouselMeasurements() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [positions, setPositions] = useState<number[]>([]);

  useLayoutEffect(() => {
    const updateMeasurements = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;

      const children = Array.from(track.children) as HTMLElement[];
      const nextPositions = children.map((child) => child.offsetLeft);
      const nextMaxTranslate = Math.max(track.scrollWidth - viewport.clientWidth, 0);

      setPositions(nextPositions);
      setMaxTranslate(nextMaxTranslate);
    };

    updateMeasurements();

    const resizeObserver = new ResizeObserver(updateMeasurements);

    if (viewportRef.current) resizeObserver.observe(viewportRef.current);
    if (trackRef.current) resizeObserver.observe(trackRef.current);

    window.addEventListener("resize", updateMeasurements);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMeasurements);
    };
  }, []);

  return { viewportRef, trackRef, maxTranslate, positions };
}

function ServiceCard({ service }: { service: HomeServiceSlide }) {
  return (
    <a
      href={service.href}
      className="group relative h-[430px] w-[78vw] max-w-[430px] shrink-0 overflow-hidden rounded-[1.75rem] border-0 bg-neutral-900 text-white no-underline shadow-none outline-none ring-0 md:h-[560px] md:w-[430px] md:rounded-[2rem]"
      aria-label={`${service.title} - ${service.category}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- cartes plein format, assets CDN */}
      <img
        src={service.image}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover md:transition-[filter] md:duration-500 md:group-hover:blur-sm"
      />

      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/42 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/20 to-transparent" />

      <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h3 className={cn(CAROUSEL_RUBRIQUE_TYPO, "max-w-[min(17rem,85vw)] text-white sm:max-w-[19rem]")}>
              {service.title}
            </h3>

            <p className="mt-3 max-w-[19rem] text-sm leading-6 text-white/72 md:mt-4 md:text-base md:leading-relaxed">
              {service.text}
            </p>
          </div>

          <ArrowUpRight className="h-6 w-6 shrink-0 text-white transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1" />
        </div>
      </div>
    </a>
  );
}

/** Bandes étroites + chute rapide opacité (bord net, peu de « trainée »). */
const SIDE_FADE_MOBILE_L =
  "linear-gradient(90deg, #fff 0%, #fff 6%, rgba(255,255,255,0.78) 28%, rgba(255,255,255,0.22) 58%, transparent 92%)";
const SIDE_FADE_MOBILE_R =
  "linear-gradient(270deg, #fff 0%, #fff 6%, rgba(255,255,255,0.78) 28%, rgba(255,255,255,0.22) 58%, transparent 92%)";
const SIDE_FADE_DESKTOP_L =
  "linear-gradient(90deg, #fff 0%, #fff 8%, rgba(255,255,255,0.82) 32%, rgba(255,255,255,0.18) 62%, transparent 94%)";
const SIDE_FADE_DESKTOP_R =
  "linear-gradient(270deg, #fff 0%, #fff 8%, rgba(255,255,255,0.82) 32%, rgba(255,255,255,0.18) 62%, transparent 94%)";

function SideFades({ atStart, atEnd }: { atStart: boolean; atEnd: boolean }) {
  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-20 w-7 transition-opacity duration-300 md:hidden",
          atStart && "opacity-0",
        )}
        style={{ backgroundImage: SIDE_FADE_MOBILE_L }}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-20 w-7 transition-opacity duration-300 md:hidden",
          atEnd && "opacity-0",
        )}
        style={{ backgroundImage: SIDE_FADE_MOBILE_R }}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-10 transition-opacity duration-300 md:block md:w-11 lg:w-12",
          atStart && "opacity-0",
        )}
        style={{ backgroundImage: SIDE_FADE_DESKTOP_L }}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-10 transition-opacity duration-300 md:block md:w-11 lg:w-12",
          atEnd && "opacity-0",
        )}
        style={{ backgroundImage: SIDE_FADE_DESKTOP_R }}
        aria-hidden
      />
    </>
  );
}

function CarouselButtons({
  activeIndex,
  maxIndex,
  onPrevious,
  onNext,
}: {
  activeIndex: number;
  maxIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="relative z-30 flex w-fit items-stretch overflow-hidden rounded-full border border-[#1f2a7c]/35 bg-[#1f2a7c] shadow-sm">
      <button
        type="button"
        onClick={onPrevious}
        disabled={activeIndex === 0}
        className="group/button grid h-10 w-10 shrink-0 place-items-center text-white transition-colors duration-200 hover:bg-white/12 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Expertise précédente"
      >
        <ChevronLeft
          className="h-5 w-5 shrink-0 text-white transition-transform duration-300 ease-out group-hover/button:-translate-y-0.5"
          strokeWidth={2}
        />
      </button>

      <span className="my-2.5 w-px shrink-0 self-stretch bg-white/25" aria-hidden />

      <button
        type="button"
        onClick={onNext}
        disabled={activeIndex === maxIndex}
        className="group/button grid h-10 w-10 shrink-0 place-items-center text-white transition-colors duration-200 hover:bg-white/12 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Expertise suivante"
      >
        <ChevronRight
          className="h-5 w-5 shrink-0 text-white transition-transform duration-300 ease-out group-hover/button:-translate-y-0.5"
          strokeWidth={2}
        />
      </button>
    </div>
  );
}

function CarouselExpertisesBar({
  activeIndex,
  maxIndex,
  onPrevious,
  onNext,
}: {
  activeIndex: number;
  maxIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="relative z-40 flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-white px-0 pb-3 pt-1 sm:gap-4 sm:px-7 sm:pb-4 sm:pt-2 xl:px-11">
      <h2
        className={cn(
          CAROUSEL_RUBRIQUE_TYPO,
          "min-w-0 max-w-[min(100%,20rem)] shrink pl-2 text-neutral-900 sm:max-w-[min(100%,28rem)] sm:pl-0",
        )}
      >
        Nos expertises
      </h2>
      <div className="shrink-0 pr-2 sm:pr-0">
        <CarouselButtons
          activeIndex={activeIndex}
          maxIndex={maxIndex}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </div>
    </div>
  );
}

function ArrowsCarousel() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const maxIndex = Math.max(homeServiceSlides.length - 1, 0);
  const { viewportRef, trackRef, maxTranslate, positions } = useCarouselMeasurements();

  const previous = () => {
    setActiveIndex((current) => Math.max(current - 1, 0));
  };

  const next = () => {
    setActiveIndex((current) => Math.min(current + 1, maxIndex));
  };

  const targetX = -Math.min(positions[activeIndex] ?? 0, maxTranslate);

  return (
    <section
      aria-label="Nos expertises"
      className="relative mt-0 w-full overflow-hidden bg-white pb-8 pt-0 text-white sm:pb-10 md:pb-12"
    >
      <CarouselExpertisesBar
        activeIndex={activeIndex}
        maxIndex={maxIndex}
        onPrevious={previous}
        onNext={next}
      />

      <div className="relative min-h-[min(26rem,68svh)] overflow-hidden pt-1 md:min-h-[30rem] md:pt-2">
        <SideFades atStart={activeIndex === 0} atEnd={activeIndex === maxIndex} />

        <div ref={viewportRef} className="overflow-hidden px-4 sm:px-7 xl:px-11">
          <motion.div
            ref={trackRef}
            animate={{ x: targetX }}
            transition={{
              type: "tween",
              duration: reduceMotion ? 0.01 : 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex w-max items-center gap-3 md:gap-4"
          >
            {homeServiceSlides.map((service) => (
              <ServiceCard key={service.href} service={service} />
            ))}
            <CarouselTrackEndPadding />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function ExpertisesCarousel() {
  return <ArrowsCarousel />;
}
