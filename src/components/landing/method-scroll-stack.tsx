"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ClipboardList, Compass, RefreshCw, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { FlickeringGrid } from "@/components/ui/flickering-footer";
import {
  getMethodStickyChromeProgress,
  METHOD_STICKY_ID,
  resetMethodStickyChrome,
  setMethodStickyChromeProgress,
} from "@/lib/method-sticky-chrome";
import {
  LANDING_SCROLL_MARGIN,
  LANDING_SECTION_INSET,
  LANDING_SECTION_SHELL,
} from "@/lib/content/landing-layout";
import { cn } from "@/lib/utils";

type MethodStep = {
  id: string;
  tab: string;
  icon: LucideIcon;
  title: string;
  text: string;
};

const METHOD_STEPS: MethodStep[] = [
  {
    id: "situation",
    tab: "Situation",
    icon: Compass,
    title: "Comprendre votre situation",
    text: "Nous faisons le point sur votre situation personnelle, professionnelle, familiale et fiscale afin d’identifier vos priorités.",
  },
  {
    id: "objectifs",
    tab: "Objectifs",
    icon: Target,
    title: "Définir vos objectifs",
    text: "Retraite, transmission, épargne, prévoyance, fiscalité ou projet d’investissement : nous clarifions les objectifs à court, moyen et long terme.",
  },
  {
    id: "strategie",
    tab: "Stratégie",
    icon: ClipboardList,
    title: "Construire une stratégie adaptée",
    text: "Le cabinet étudie les solutions possibles et vous explique les avantages, limites, frais et risques de chaque orientation.",
  },
  {
    id: "suivi",
    tab: "Suivi",
    icon: RefreshCw,
    title: "Suivre et ajuster dans le temps",
    text: "Votre patrimoine évolue. L’accompagnement permet d’ajuster les décisions selon votre situation, vos projets et le cadre réglementaire.",
  },
];

const SCROLL_VH_PER_STEP = 68;
const WHEEL_LOCK_MS = 680;

function getTrackHeightVh(stepCount: number) {
  return 100 + Math.max(0, stepCount - 1) * SCROLL_VH_PER_STEP;
}

function MethodDotGrid() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]" aria-hidden>
      <FlickeringGrid
        className="h-full w-full"
        squareSize={1}
        gridGap={4}
        color="#1f2a7c"
        maxOpacity={0.18}
        flickerChance={0.09}
      />
    </div>
  );
}

function MethodIntroHeader() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1f2a7c]/70">
        Notre méthode
      </p>
      <h2
        id="home-method-title"
        className="mt-3 text-balance text-[clamp(1.4rem,3vw,2.25rem)] font-normal leading-[1.1] tracking-[-0.03em] text-[#1f2a7c]"
      >
        Une méthode claire pour prendre de meilleures décisions patrimoniales
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[#1f2a7c]/75 sm:mt-5 sm:text-base">
        Chaque situation patrimoniale est différente. Lefèvre Conseil privilégie une approche
        progressive, pédagogique et personnalisée.
      </p>
    </div>
  );
}

function MethodStepCard({
  step,
  index,
  className,
}: {
  step: MethodStep;
  index: number;
  className?: string;
}) {
  const Icon = step.icon;

  return (
    <article
      className={cn(
        "rounded-[1.5rem] border border-[#1f2a7c]/10 bg-white/95 p-6 shadow-[0_18px_50px_rgba(23,33,59,0.07)] ring-1 ring-[#1f2a7c]/[0.04] backdrop-blur-[1px] sm:p-8",
        className,
      )}
    >
      <div className="flex items-start gap-5 sm:gap-7">
        <div className="flex shrink-0 flex-col items-center gap-3">
          <span className="text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-none tracking-[-0.04em] text-[#1f2a7c]/15 tabular-nums">
            0{index + 1}
          </span>
          <span className="flex size-11 items-center justify-center rounded-2xl bg-[#1f2a7c]/[0.07] text-[#1f2a7c]">
            <Icon className="size-5" aria-hidden strokeWidth={1.85} />
          </span>
        </div>
        <div className="min-w-0 pt-1">
          <h3 className="text-balance text-[clamp(1.15rem,2.4vw,1.65rem)] font-medium leading-tight tracking-[-0.02em] text-[#1f2a7c]">
            {step.title}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[#1f2a7c]/72 sm:text-base">
            {step.text}
          </p>
        </div>
      </div>
    </article>
  );
}

/** Section « Notre méthode » — scroll multi-étapes (pattern Hey Aurenis). */
export function MethodScrollStack() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const wheelLock = useRef(false);
  const touchStartY = useRef(0);
  const activeRef = useRef(0);
  const scrollingRef = useRef(false);

  const stepCount = METHOD_STEPS.length;
  const trackHeightVh = getTrackHeightVh(stepCount);

  const goToStep = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(stepCount - 1, index));
      activeRef.current = next;
      setActive(next);
    },
    [stepCount],
  );

  const scrollToStep = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track || scrollingRef.current) return;

      const next = Math.max(0, Math.min(stepCount - 1, index));
      const rect = track.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      const scrollable = track.offsetHeight - window.innerHeight;
      const target = trackTop + (scrollable / Math.max(1, stepCount - 1)) * next;

      scrollingRef.current = true;
      goToStep(next);

      window.scrollTo({ top: target, behavior: reduceMotion ? "auto" : "smooth" });

      window.setTimeout(() => {
        scrollingRef.current = false;
      }, reduceMotion ? 0 : WHEEL_LOCK_MS);
    },
    [goToStep, reduceMotion, stepCount],
  );

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    return () => resetMethodStickyChrome();
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const track = trackRef.current;
    if (!track) return;

    const syncFromScroll = () => {
      setMethodStickyChromeProgress(getMethodStickyChromeProgress(track));

      const scrollable = track.offsetHeight - window.innerHeight;
      const scrolled = -track.getBoundingClientRect().top;

      if (scrollable <= 0) return;

      if (scrolled < -4 || scrolled > scrollable + 4) {
        if (scrolled < -8) resetMethodStickyChrome();
        return;
      }

      const progress = scrolled / scrollable;
      const index = Math.min(stepCount - 1, Math.max(0, Math.round(progress * (stepCount - 1))));

      if (!scrollingRef.current && index !== activeRef.current) {
        goToStep(index);
      }
    };

    window.addEventListener("scroll", syncFromScroll, { passive: true });
    window.addEventListener("resize", syncFromScroll, { passive: true });
    syncFromScroll();

    return () => {
      window.removeEventListener("scroll", syncFromScroll);
      window.removeEventListener("resize", syncFromScroll);
      resetMethodStickyChrome();
    };
  }, [goToStep, reduceMotion, stepCount]);

  useEffect(() => {
    if (reduceMotion) return;

    const handleKeydown = (event: KeyboardEvent) => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const inSection =
        rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
      if (!inSection) return;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        scrollToStep(activeRef.current + 1);
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        scrollToStep(activeRef.current - 1);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [reduceMotion, scrollToStep]);

  const isTrackPinned = () => {
    const track = trackRef.current;
    if (!track) return false;

    const rect = track.getBoundingClientRect();
    return rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
  };

  const handleWheel = (event: React.WheelEvent<HTMLElement>) => {
    if (reduceMotion || !isTrackPinned()) return;

    const direction = Math.sign(event.deltaY);
    if (Math.abs(event.deltaY) < 16) return;

    const current = activeRef.current;
    const isFirstAndGoingUp = current === 0 && direction < 0;
    const isLastAndGoingDown = current === stepCount - 1 && direction > 0;

    if (isFirstAndGoingUp || isLastAndGoingDown) return;

    event.preventDefault();
    if (wheelLock.current || scrollingRef.current) return;

    wheelLock.current = true;
    scrollToStep(current + direction);

    window.setTimeout(() => {
      wheelLock.current = false;
    }, WHEEL_LOCK_MS);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    if (reduceMotion || !isTrackPinned()) return;

    const delta = touchStartY.current - event.touches[0].clientY;
    if (Math.abs(delta) < 60 || wheelLock.current || scrollingRef.current) return;

    const direction = Math.sign(delta);
    const current = activeRef.current;
    const isFirstAndGoingUp = current === 0 && direction < 0;
    const isLastAndGoingDown = current === stepCount - 1 && direction > 0;

    if (isFirstAndGoingUp || isLastAndGoingDown) return;

    event.preventDefault();
    wheelLock.current = true;
    scrollToStep(current + direction);

    window.setTimeout(() => {
      wheelLock.current = false;
    }, WHEEL_LOCK_MS);
  };

  if (reduceMotion) {
    return (
      <section
        data-nav-theme="light"
        aria-labelledby="home-method-title"
        className={cn(LANDING_SECTION_SHELL, LANDING_SCROLL_MARGIN)}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-[1.75rem] border border-[#1f2a7c]/12 bg-white py-12 sm:py-14 lg:rounded-[2rem] xl:py-16",
            LANDING_SECTION_INSET,
          )}
        >
          <MethodDotGrid />
          <div className="relative z-10">
            <MethodIntroHeader />
            <ol className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
              {METHOD_STEPS.map((step, index) => (
                <li key={step.id}>
                  <MethodStepCard step={step} index={index} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      data-nav-theme="light"
      aria-labelledby="home-method-title"
      className={cn("relative bg-white", LANDING_SECTION_SHELL, LANDING_SCROLL_MARGIN)}
    >
      <div id={METHOD_STICKY_ID} ref={trackRef} style={{ height: `${trackHeightVh}vh` }}>
        <div className="sticky top-0 box-border flex h-[100dvh] items-stretch py-3 sm:py-4">
          <div
            className="relative mx-auto flex h-full w-full max-w-[calc(100vw-20px)] flex-col overflow-hidden rounded-[1.75rem] border border-[#1f2a7c]/10 bg-white shadow-[0_24px_60px_-30px_rgba(23,33,59,0.12)] lg:max-w-none lg:rounded-[2rem]"
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            aria-roledescription="carousel"
            aria-label="Les quatre étapes de la méthode Lefèvre Conseil"
          >
            <MethodDotGrid />

            <div
              className={cn(
                "relative z-10 flex min-h-0 flex-1 flex-col pb-6 pt-8 sm:pb-8 sm:pt-10 xl:pt-12",
                LANDING_SECTION_INSET,
              )}
            >
              <MethodIntroHeader />

              <nav
                className="method-sticky-tabs relative z-20 mx-auto mt-6 grid h-[46px] w-full max-w-xl grid-cols-4 rounded-full border border-[#1f2a7c]/10 bg-white/90 p-1.5 shadow-sm backdrop-blur-sm sm:mt-8 sm:h-[52px]"
                style={{ "--active": active } as React.CSSProperties}
                aria-label="Étapes de la méthode"
              >
                <div className="method-sticky-tab-indicator" aria-hidden />
                {METHOD_STEPS.map((step, index) => (
                  <button
                    key={step.id}
                    type="button"
                    id={`method-tab-${step.id}`}
                    aria-selected={active === index}
                    aria-controls={`method-slide-${step.id}`}
                    onClick={() => scrollToStep(index)}
                    className="relative z-[1] rounded-full border-0 bg-transparent px-1 text-[10px] font-semibold tracking-[-0.01em] text-[#1f2a7c]/55 transition-colors duration-300 aria-selected:text-white sm:text-[11px] md:text-xs"
                  >
                    {step.tab}
                  </button>
                ))}
              </nav>

              <div className="relative mx-auto mt-6 min-h-0 w-full max-w-3xl flex-1 sm:mt-8">
                <div className="relative min-h-[220px] sm:min-h-[240px] lg:min-h-[260px]">
                  {METHOD_STEPS.map((step, index) => (
                    <article
                      key={step.id}
                      id={`method-slide-${step.id}`}
                      role="tabpanel"
                      aria-labelledby={`method-tab-${step.id}`}
                      className="method-sticky-slide absolute inset-x-0 top-0"
                      data-active={active === index}
                    >
                      <MethodStepCard step={step} index={index} />
                    </article>
                  ))}
                </div>

                <div
                  className="absolute -right-1 top-1/2 z-20 hidden -translate-y-1/2 gap-2 sm:-right-2 lg:flex lg:flex-col xl:-right-4"
                  aria-label="Navigation des étapes"
                >
                  {METHOD_STEPS.map((step, index) => (
                    <button
                      key={step.id}
                      type="button"
                      aria-label={`Aller à ${step.tab}`}
                      onClick={() => scrollToStep(index)}
                      className="method-sticky-dot h-1.5 w-1.5 rounded-full bg-[#1f2a7c]/25 transition-all duration-300"
                      data-active={active === index}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-auto pt-4 text-center text-[11px] font-medium tabular-nums tracking-[0.14em] text-[#1f2a7c]/45 sm:pt-6">
                0{active + 1} / 0{stepCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
