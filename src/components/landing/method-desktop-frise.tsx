"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ClipboardList, Compass, RefreshCw, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MethodStepImageId } from "@/lib/content/media";
import { cn } from "@/lib/utils";

export type MethodFriseStep = {
  id: MethodStepImageId;
  tab: string;
  title: string;
  text: string;
  image: string;
};

const METHOD_ICONS: Record<MethodStepImageId, LucideIcon> = {
  situation: Compass,
  objectifs: Target,
  strategie: ClipboardList,
  suivi: RefreshCw,
};

const TRACK_TOP = "top-6";

function MethodFriseDot({
  isActive,
  isPast,
}: {
  isActive: boolean;
  isPast: boolean;
}) {
  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center">
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#17213b]/20 bg-[#17213b]/5 transition-[opacity,transform] duration-200",
          isActive ? "scale-100 opacity-100" : "scale-90 opacity-0",
        )}
      />
      <motion.span
        animate={{
          backgroundColor: isActive || isPast ? "#17213b" : "#faf7f2",
          borderColor: isActive || isPast ? "#17213b" : "#d8cec2",
          scale: isActive ? 1.1 : 1,
        }}
        transition={{ duration: 0.25 }}
        className="relative z-10 block size-4 rounded-full border-2"
      />
    </span>
  );
}

function MethodFriseTrack({
  steps,
  activeIndex,
  onSelect,
}: {
  steps: readonly MethodFriseStep[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const n = steps.length;
  const progressRatio = n <= 1 ? 0 : activeIndex / (n - 1);

  return (
    <div className="relative h-[5.75rem]">
      <div
        className={cn("absolute h-px bg-[#d8cec2]", TRACK_TOP)}
        style={{
          left: `calc(100% / ${n} / 2)`,
          right: `calc(100% / ${n} / 2)`,
        }}
        aria-hidden
      />
      <motion.div
        className={cn("absolute h-px origin-left bg-[#17213b]", TRACK_TOP)}
        style={{ left: `calc(100% / ${n} / 2)` }}
        initial={false}
        animate={{
          width: n <= 1 ? 0 : `calc((100% - (100% / ${n})) * ${progressRatio})`,
        }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        aria-hidden
      />

      <div
        className="grid h-full"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        role="tablist"
        aria-label="Étapes de la méthode Lefèvre Conseil"
      >
        {steps.map((step, index) => {
          const isActive = activeIndex === index;
          const isPast = index < activeIndex;
          const tabId = `method-frise-tab-${step.id}`;
          const panelId = `method-frise-panel-${step.id}`;

          return (
            <button
              key={step.id}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onMouseEnter={() => onSelect(index)}
              onFocus={() => onSelect(index)}
              className="group flex cursor-default flex-col items-center rounded-lg px-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#17213b]/25 focus-visible:ring-offset-2"
            >
              <span className="flex h-12 w-full items-center justify-center">
                <MethodFriseDot isActive={isActive} isPast={isPast} />
              </span>
              <span
                className={cn(
                  "text-[11px] font-semibold uppercase tracking-[0.14em] tabular-nums transition-colors",
                  isActive ? "text-[#1f2a7c]" : isPast ? "text-[#1f2a7c]/75" : "text-[#8b8278] group-hover:text-[#1f2a7c]",
                )}
              >
                0{index + 1}
              </span>
              <span
                className={cn(
                  "mt-0.5 text-center text-[13px] font-medium leading-tight tracking-[-0.02em] transition-colors",
                  isActive ? "text-[#17213b]" : isPast ? "text-[#17213b]/80" : "text-[#8b8278] group-hover:text-[#17213b]",
                )}
              >
                {step.tab}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MethodFrisePanel({
  step,
  index,
  panelId,
  labelledBy,
}: {
  step: MethodFriseStep;
  index: number;
  panelId: string;
  labelledBy: string;
}) {
  const Icon = METHOD_ICONS[step.id];

  return (
    <article
      id={panelId}
      role="tabpanel"
      aria-labelledby={labelledBy}
      className="grid items-center gap-8 overflow-hidden rounded-[1.5rem] border border-[#1f2a7c]/10 bg-white shadow-[0_18px_50px_rgba(23,33,59,0.07)] ring-1 ring-[#1f2a7c]/[0.04] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-10"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1f2a7c]/[0.04] lg:aspect-auto lg:min-h-[280px] lg:rounded-r-none">
        <Image
          src={step.image}
          alt={step.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 42vw, 100vw"
        />
      </div>
      <div className="flex flex-col justify-center px-6 pb-7 pt-2 sm:px-8 sm:pb-8 lg:py-8 lg:pr-10">
        <div className="flex items-center gap-3">
          <span className="text-[clamp(2rem,3vw,2.75rem)] font-semibold leading-none tracking-[-0.04em] text-[#1f2a7c]/12 tabular-nums">
            0{index + 1}
          </span>
          <span className="flex size-11 items-center justify-center rounded-2xl bg-[#1f2a7c]/[0.07] text-[#1f2a7c]">
            <Icon className="size-5" aria-hidden strokeWidth={1.85} />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1f2a7c]/45">
            {step.tab}
          </span>
        </div>
        <h3 className="mt-4 text-balance text-[clamp(1.25rem,2vw,1.65rem)] font-medium leading-tight tracking-[-0.025em] text-[#1f2a7c]">
          {step.title}
        </h3>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#1f2a7c]/72 sm:text-base">
          {step.text}
        </p>
      </div>
    </article>
  );
}

export function MethodDesktopFrise({ steps }: { steps: readonly MethodFriseStep[] }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const reduceMotion = useReducedMotion();
  const active = steps[activeIndex]!;

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(steps.length - 1, i + 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(steps.length - 1);
      }
    },
    [steps.length],
  );

  const panelTransition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="mx-auto mt-12 max-w-5xl xl:mt-14" onKeyDown={onKeyDown}>
      <MethodFriseTrack steps={steps} activeIndex={activeIndex} onSelect={setActiveIndex} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={panelTransition}
          className="mt-8 xl:mt-10"
        >
          <MethodFrisePanel
            step={active}
            index={activeIndex}
            panelId={`method-frise-panel-${active.id}`}
            labelledBy={`method-frise-tab-${active.id}`}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
