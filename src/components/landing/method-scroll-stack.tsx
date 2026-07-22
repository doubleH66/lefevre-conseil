"use client";

import Image from "next/image";
import * as React from "react";
import { ClipboardList, Compass, RefreshCw, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { MethodDesktopFrise } from "@/components/landing/method-desktop-frise";
import { FlickeringGrid } from "@/components/ui/flickering-footer";
import {
  LANDING_SCROLL_MARGIN,
  LANDING_SECTION_INNER_Y,
  LANDING_SECTION_INSET,
  LANDING_SECTION_SHELL,
} from "@/lib/content/landing-layout";
import { METHOD_STEP_IMAGES, type MethodStepImageId } from "@/lib/content/media";
import {
  getMethodStickyChromeProgress,
  METHOD_STICKY_ID,
  resetMethodStickyChrome,
  setMethodStickyChromeProgress,
} from "@/lib/method-sticky-chrome";
import { cn } from "@/lib/utils";

type MethodStep = {
  id: MethodStepImageId;
  tab: string;
  icon: LucideIcon;
  title: string;
  text: string;
  image: string;
};

const METHOD_STEPS: MethodStep[] = [
  {
    id: "situation",
    tab: "Situation",
    icon: Compass,
    title: "Comprendre votre situation",
    text: "Nous faisons le point sur votre situation personnelle, professionnelle, familiale et fiscale afin d’identifier vos priorités.",
    image: METHOD_STEP_IMAGES.situation,
  },
  {
    id: "objectifs",
    tab: "Objectifs",
    icon: Target,
    title: "Définir vos objectifs",
    text: "Retraite, transmission, épargne, prévoyance, fiscalité ou projet d’investissement : nous clarifions les objectifs à court, moyen et long terme.",
    image: METHOD_STEP_IMAGES.objectifs,
  },
  {
    id: "strategie",
    tab: "Stratégie",
    icon: ClipboardList,
    title: "Construire une stratégie adaptée",
    text: "Le cabinet étudie les solutions possibles et vous explique les avantages, limites, frais et risques de chaque orientation.",
    image: METHOD_STEP_IMAGES.strategie,
  },
  {
    id: "suivi",
    tab: "Suivi",
    icon: RefreshCw,
    title: "Suivre et ajuster dans le temps",
    text: "Votre patrimoine évolue. L’accompagnement permet d’ajuster les décisions selon votre situation, vos projets et le cadre réglementaire.",
    image: METHOD_STEP_IMAGES.suivi,
  },
];

/** Hauteur de scroll par étape — l’écran reste bloqué pendant le glissement. */
const SCROLL_VH_PER_STEP = 85;
const WHEEL_LOCK_MS = 640;

function getTrackHeightVh(stepCount: number) {
  return 100 + Math.max(0, stepCount - 1) * SCROLL_VH_PER_STEP;
}

function MethodIntroHeader() {
  return (
    <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
      <h2
        id="home-method-title"
        className="text-balance text-[clamp(1.3rem,3.8vw,2.25rem)] font-normal leading-[1.1] tracking-[-0.03em] text-[#1f2a7c]"
      >
        Une méthode claire pour prendre de meilleures décisions patrimoniales
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-relaxed text-[#1f2a7c]/75 sm:mt-4 sm:text-[15px]">
        Chaque situation patrimoniale est différente. Lefèvre Conseil privilégie une approche
        progressive, pédagogique et personnalisée.
      </p>
    </div>
  );
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
        maxOpacity={0.14}
        flickerChance={0.08}
      />
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
        "overflow-hidden rounded-[1.35rem] border border-[#1f2a7c]/10 bg-white shadow-[0_18px_50px_rgba(23,33,59,0.1)] ring-1 ring-[#1f2a7c]/[0.04]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1f2a7c]/[0.04] sm:aspect-[2/1]">
        <Image
          src={step.image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 420px"
          priority={index === 0}
        />
      </div>
      <div className="flex items-start gap-4 p-5 sm:gap-5 sm:p-6">
        <div className="flex shrink-0 flex-col items-center gap-2.5">
          <span className="text-[clamp(1.75rem,5vw,2.5rem)] font-semibold leading-none tracking-[-0.04em] text-[#1f2a7c]/15 tabular-nums">
            0{index + 1}
          </span>
          <span className="flex size-10 items-center justify-center rounded-2xl bg-[#1f2a7c]/[0.07] text-[#1f2a7c]">
            <Icon className="size-4" aria-hidden strokeWidth={1.85} />
          </span>
        </div>
        <div className="min-w-0 pt-0.5">
          <h3 className="text-balance text-[clamp(1.05rem,3.4vw,1.35rem)] font-medium leading-tight tracking-[-0.02em] text-[#1f2a7c]">
            {step.title}
          </h3>
          <p className="mt-2.5 text-[14px] leading-relaxed text-[#1f2a7c]/72 sm:text-[15px]">
            {step.text}
          </p>
        </div>
      </div>
    </article>
  );
}

/** Sticky plein écran + changement d’étape au scroll (mobile). */
function MethodMobileStickyStack() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const wheelLock = React.useRef(false);
  const touchStartY = React.useRef(0);
  const activeRef = React.useRef(0);
  const scrollingRef = React.useRef(false);

  const stepCount = METHOD_STEPS.length;
  const trackHeightVh = getTrackHeightVh(stepCount);

  const goToStep = React.useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(stepCount - 1, index));
      activeRef.current = next;
      setActive(next);
    },
    [stepCount],
  );

  const scrollToStep = React.useCallback(
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

      window.setTimeout(
        () => {
          scrollingRef.current = false;
        },
        reduceMotion ? 0 : WHEEL_LOCK_MS,
      );
    },
    [goToStep, reduceMotion, stepCount],
  );

  React.useEffect(() => {
    activeRef.current = active;
  }, [active]);

  React.useEffect(() => () => resetMethodStickyChrome(), []);

  React.useEffect(() => {
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
      if (!scrollingRef.current && index !== activeRef.current) goToStep(index);
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
    if ((current === 0 && direction < 0) || (current === stepCount - 1 && direction > 0)) return;

    event.preventDefault();
    if (wheelLock.current || scrollingRef.current) return;

    wheelLock.current = true;
    scrollToStep(current + direction);
    window.setTimeout(() => {
      wheelLock.current = false;
    }, WHEEL_LOCK_MS);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? 0;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    if (reduceMotion || !isTrackPinned()) return;

    const delta = touchStartY.current - (event.touches[0]?.clientY ?? 0);
    if (Math.abs(delta) < 56 || wheelLock.current || scrollingRef.current) return;

    const direction = Math.sign(delta);
    const current = activeRef.current;
    if ((current === 0 && direction < 0) || (current === stepCount - 1 && direction > 0)) return;

    event.preventDefault();
    wheelLock.current = true;
    scrollToStep(current + direction);
    window.setTimeout(() => {
      wheelLock.current = false;
    }, WHEEL_LOCK_MS);
  };

  if (reduceMotion) {
    return (
      <ol className="mx-auto mt-8 grid max-w-3xl gap-4 px-1">
        {METHOD_STEPS.map((step, index) => (
          <li key={step.id}>
            <MethodStepCard step={step} index={index} />
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div id={METHOD_STICKY_ID} ref={trackRef} style={{ height: `${trackHeightVh}vh` }}>
      <div className="sticky top-0 box-border flex h-[100dvh] items-stretch py-2.5 sm:py-3">
        <div
          className="relative mx-auto flex h-full w-full max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-[1.5rem] border border-[#1f2a7c]/10 bg-white shadow-[0_24px_60px_-30px_rgba(23,33,59,0.12)]"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          aria-roledescription="carousel"
          aria-label="Les quatre étapes de la méthode Lefèvre Conseil"
        >
          <MethodDotGrid />

          <div
            className={cn(
              "relative z-10 flex min-h-0 flex-1 flex-col pb-5 pt-7 sm:pb-6 sm:pt-8",
              LANDING_SECTION_INSET,
            )}
          >
            <MethodIntroHeader />

            <nav
              className="method-sticky-tabs relative z-20 mx-auto mt-5 grid h-[44px] w-full max-w-xl grid-cols-4 rounded-full border border-[#1f2a7c]/10 bg-white/90 p-1.5 shadow-sm backdrop-blur-sm sm:mt-6 sm:h-[50px]"
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
                  className="relative z-[1] rounded-full border-0 bg-transparent px-1 text-[10px] font-semibold tracking-[-0.01em] text-[#1f2a7c]/55 transition-colors duration-300 aria-selected:text-white sm:text-[11px]"
                >
                  {step.tab}
                </button>
              ))}
            </nav>

            <div className="relative mx-auto mt-5 min-h-0 w-full max-w-lg flex-1 sm:mt-6">
              <div className="relative h-full min-h-[280px]">
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
            </div>

            <p className="mt-auto pt-3 text-center text-[11px] font-medium tabular-nums tracking-[0.14em] text-[#1f2a7c]/45">
              0{active + 1} / 0{stepCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Section « Notre méthode » — sticky scroll (mobile) ; frise (desktop). */
export function MethodScrollStack() {
  return (
    <section
      data-nav-theme="light"
      aria-labelledby="home-method-title"
      className={cn("relative bg-white", LANDING_SCROLL_MARGIN)}
    >
      {/* Mobile — vrai sticky scroll */}
      <div className={cn("lg:hidden", LANDING_SECTION_SHELL)}>
        <MethodMobileStickyStack />
      </div>

      {/* Desktop — frise */}
      <div
        className={cn(
          "relative hidden overflow-hidden rounded-[1.75rem] border border-[#1f2a7c]/12 bg-white lg:block lg:rounded-[2rem]",
          LANDING_SECTION_SHELL,
          LANDING_SECTION_INSET,
          LANDING_SECTION_INNER_Y,
        )}
      >
        <MethodDotGrid />
        <div className="relative z-10">
          <MethodIntroHeader />
          <MethodDesktopFrise
            steps={METHOD_STEPS.map(({ id, tab, title, text, image }) => ({
              id,
              tab,
              title,
              text,
              image,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
