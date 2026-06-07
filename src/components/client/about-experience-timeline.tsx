"use client";

import * as React from "react";
import { useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-footer";
import { cn } from "@/lib/utils";

const LG_MEDIA_QUERY = "(min-width: 1024px)";
/** Centre vertical de la pastille desktop - aligné sur la ligne de progression. */
const DESKTOP_TRACK_LINE_TOP = "top-6";

function subscribeLgMediaQuery(onChange: () => void) {
  const mq = window.matchMedia(LG_MEDIA_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getLgMediaQuerySnapshot() {
  return window.matchMedia(LG_MEDIA_QUERY).matches;
}

function useIsLgUp() {
  return useSyncExternalStore(subscribeLgMediaQuery, getLgMediaQuerySnapshot, () => false);
}

export type AboutTimelineMilestone = {
  year: string;
  /** Titre court affiché sur la frise (optionnel - sinon dérivé de la description). */
  title?: string;
  description: string;
  bullets?: readonly string[];
};

type AboutExperienceTimelineProps = {
  milestones: readonly AboutTimelineMilestone[];
  className?: string;
  tone?: "light" | "dark";
  /** `dot-grid` - fond pointillé type section méthode (scroll). */
  surface?: "card" | "dot-grid";
  navigationAriaLabel?: string;
};

function TimelineDotGrid() {
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

function timelineHeading(m: AboutTimelineMilestone): string {
  if (m.title?.trim()) return m.title.trim();
  const d = m.description.replace(/\s+/g, " ").trim();
  const colon = d.indexOf(":");
  if (colon >= 28 && colon <= 100) return d.slice(0, colon).trim();
  const sentence = d.match(/^.{25,130}?[.!?](?=\s|$)/u);
  if (sentence) return sentence[0].trim();
  if (d.length <= 96) return d;
  const cut = d.slice(0, 93);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > 40 ? cut.slice(0, sp) : cut).trim()}…`;
}

function TimelineDot({
  isActive,
  isPast,
  onDarkSurface = false,
  compact = false,
}: {
  isActive: boolean;
  isPast: boolean;
  onDarkSurface?: boolean;
  compact?: boolean;
}) {
  const dotFill =
    isActive || isPast
      ? onDarkSurface
        ? "#ffffff"
        : "#17213b"
      : onDarkSurface
        ? "rgba(255,255,255,0.15)"
        : "#faf7f2";
  const dotBorder =
    isActive || isPast
      ? onDarkSurface
        ? "#ffffff"
        : "#17213b"
      : onDarkSurface
        ? "rgba(255,255,255,0.4)"
        : "#d8cec2";

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        compact ? "size-7" : "size-10",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[opacity,transform] duration-200 ease-out",
          compact ? "size-6" : "size-9",
          onDarkSurface
            ? "border-white/25 bg-white/10"
            : "border-[#17213b]/20 bg-[#17213b]/5",
          isActive ? "scale-100 opacity-100" : "scale-90 opacity-0",
        )}
      />
      <motion.span
        animate={{
          backgroundColor: dotFill,
          borderColor: dotBorder,
          scale: isActive ? 1.1 : 1,
        }}
        transition={{ duration: 0.25 }}
        className={cn(
          "relative z-10 block rounded-full border-2",
          compact ? "h-2.5 w-2.5" : "h-4 w-4",
        )}
      />
    </span>
  );
}

function MilestoneRichText({
  milestone,
  className,
  active = false,
}: {
  milestone: AboutTimelineMilestone;
  className?: string;
  active?: boolean;
}) {
  return (
    <motion.div className={className}>
      <p className="text-pretty">{milestone.description}</p>
      {milestone.bullets && milestone.bullets.length > 0 ? (
        <ul
          className={cn(
            "mt-4 space-y-2 border-t pt-4 text-left text-[15px] leading-relaxed sm:text-base",
            active ? "border-white/20 text-white/85" : "border-[#e5ddd2] text-[#5c544e]",
          )}
        >
          {milestone.bullets.map((b) => (
            <li key={b} className="flex gap-2.5">
              <span
                aria-hidden
                className={cn(
                  "mt-2 inline-block size-1 shrink-0 rounded-full",
                  active ? "bg-white/50" : "bg-[#17213b]/35",
                )}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </motion.div>
  );
}

function TimelineDetailCard({
  milestone,
  panelId,
  labelledBy,
  tone,
  centered = false,
}: {
  milestone: AboutTimelineMilestone;
  panelId: string;
  labelledBy: string;
  tone: "light" | "dark";
  centered?: boolean;
}) {
  const isDark = tone === "dark";

  return (
    <motion.div
      id={panelId}
      role="tabpanel"
      aria-labelledby={labelledBy}
      className={cn(
        "rounded-2xl border p-5 sm:p-6",
        isDark
          ? "border-white/15 bg-white/[0.08]"
          : "border-[#e5dfd4] bg-white/95 shadow-[0_16px_40px_rgba(23,33,59,0.06)]",
        centered && "lg:mx-auto lg:max-w-3xl lg:text-center",
      )}
    >
      <motion.div
        className={cn(
          "flex flex-wrap items-baseline gap-x-3 gap-y-1",
          centered && "lg:flex-col lg:items-center lg:gap-y-2",
        )}
      >
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums tracking-wide",
            isDark ? "bg-white/15 text-white" : "bg-[#17213b]/8 text-[#17213b]",
          )}
        >
          {milestone.year}
        </span>
        <h3
          className={cn(
            "min-w-0 flex-1 text-pretty text-lg font-semibold leading-snug tracking-[-0.03em] sm:text-xl",
            isDark ? "text-white" : "text-[#17213b]",
            centered && "lg:flex-none lg:text-2xl",
          )}
        >
          {timelineHeading(milestone)}
        </h3>
      </motion.div>
      <MilestoneRichText
        milestone={milestone}
        active={isDark}
        className={cn(
          "mt-4 text-sm leading-7 sm:text-[15px] sm:leading-8",
          isDark ? "text-white/85" : "text-[#6b625b]",
          centered && "lg:mx-auto lg:max-w-2xl",
        )}
      />
    </motion.div>
  );
}

function TimelineStepButton({
  item,
  isActive,
  isPast,
  isDark,
  tabId,
  panelId,
  onSelect,
  selectOnHover = false,
}: {
  item: AboutTimelineMilestone;
  isActive: boolean;
  isPast: boolean;
  isDark: boolean;
  tabId: string;
  panelId: string;
  onSelect: () => void;
  selectOnHover?: boolean;
}) {
  const yearClass = cn(
    "text-sm font-semibold tabular-nums tracking-tight transition-colors",
    isActive
      ? isDark
        ? "text-white"
        : "text-[#17213b]"
      : isPast
        ? isDark
          ? "text-white/80"
          : "text-[#17213b]/80"
        : isDark
          ? "text-white/50 group-hover:text-white/70"
          : "text-[#8b8278] group-hover:text-[#17213b]",
  );

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      id={tabId}
      tabIndex={isActive ? 0 : -1}
      onMouseEnter={selectOnHover ? onSelect : undefined}
      onFocus={selectOnHover ? onSelect : undefined}
      onClick={selectOnHover ? undefined : onSelect}
      className={cn(
        "group relative flex flex-col items-center rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#17213b]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        selectOnHover && "cursor-default",
      )}
      aria-label={`Voir l’étape ${item.year}`}
    >
      <span className="flex h-12 w-full items-center justify-center">
        <TimelineDot isActive={isActive} isPast={isPast} onDarkSurface={isDark} />
      </span>
      <span className={cn("mt-0.5", yearClass)}>{item.year}</span>
    </button>
  );
}

function TimelineProgressLines({
  isDark,
  progressRatio,
  n,
}: {
  isDark: boolean;
  progressRatio: number;
  n: number;
}) {
  const trackClass = isDark ? "bg-white/25" : "bg-[#d8cec2]";
  const fillClass = isDark ? "bg-white" : "bg-[#17213b]";

  return (
    <>
      <div
        className={cn("absolute h-px", DESKTOP_TRACK_LINE_TOP, trackClass)}
        style={{
          left: `calc(100% / ${n} / 2)`,
          right: `calc(100% / ${n} / 2)`,
        }}
        aria-hidden
      />
      <motion.div
        className={cn("absolute h-px origin-left", DESKTOP_TRACK_LINE_TOP, fillClass)}
        style={{ left: `calc(100% / ${n} / 2)` }}
        initial={false}
        animate={{
          width: n <= 1 ? 0 : `calc((100% - (100% / ${n})) * ${progressRatio})`,
        }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        aria-hidden
      />
    </>
  );
}

function DesktopTimelineTrack({
  milestones,
  activeIndex,
  instanceId,
  isDark,
  onSelect,
}: {
  milestones: readonly AboutTimelineMilestone[];
  activeIndex: number;
  instanceId: string;
  isDark: boolean;
  onSelect: (index: number) => void;
}) {
  const n = milestones.length;
  const progressRatio = n <= 1 ? 0 : activeIndex / (n - 1);

  return (
    <div className="relative h-[5.5rem]">
      <TimelineProgressLines isDark={isDark} progressRatio={progressRatio} n={n} />
      <div
        className="grid h-full"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        {milestones.map((item, index) => {
          const tabId = `timeline-tab-${instanceId}-${index}`;
          const panelId = `timeline-panel-${instanceId}-${index}`;
          return (
            <TimelineStepButton
              key={tabId}
              item={item}
              isActive={activeIndex === index}
              isPast={index < activeIndex}
              isDark={isDark}
              tabId={tabId}
              panelId={panelId}
              onSelect={() => onSelect(index)}
              selectOnHover
            />
          );
        })}
      </div>
    </div>
  );
}

function MobileVerticalTimeline({
  milestones,
  activeIndex,
  instanceId,
  isDark,
  onSelect,
  reduceMotion,
}: {
  milestones: readonly AboutTimelineMilestone[];
  activeIndex: number;
  instanceId: string;
  isDark: boolean;
  onSelect: (index: number) => void;
  reduceMotion: boolean | null;
}) {
  const n = milestones.length;
  const progressRatio = n <= 1 ? 0 : activeIndex / (n - 1);
  const trackClass = isDark ? "bg-white/20" : "bg-[#d8cec2]";
  const fillClass = isDark ? "bg-white" : "bg-[#17213b]";
  const expandTransition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="relative pl-1">
      <motion.div
        className={cn("absolute bottom-4 left-[13px] top-4 w-0.5 rounded-full", trackClass)}
        aria-hidden
      />
      <motion.div
        className={cn("absolute left-[13px] top-4 w-0.5 origin-top rounded-full", fillClass)}
        initial={false}
        animate={{ height: `calc((100% - 2rem) * ${progressRatio})` }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        aria-hidden
      />

      <ol className="relative space-y-2">
        {milestones.map((item, index) => {
          const isActive = activeIndex === index;
          const isPast = index < activeIndex;
          const tabId = `timeline-m-tab-${instanceId}-${index}`;
          const panelId = `timeline-m-panel-${instanceId}-${index}`;
          const heading = timelineHeading(item);

          return (
            <li key={tabId}>
              <button
                type="button"
                role="tab"
                id={tabId}
                aria-selected={isActive}
                aria-expanded={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onSelect(index)}
                className={cn(
                  "relative z-10 flex w-full items-start gap-3 rounded-2xl border px-3 py-3.5 text-left outline-none transition-[background-color,border-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-offset-2",
                  isDark
                    ? "focus-visible:ring-white/35 focus-visible:ring-offset-[#1f2a7c]"
                    : "focus-visible:ring-[#17213b]/25 focus-visible:ring-offset-white",
                  isActive
                    ? isDark
                      ? "border-white/20 bg-white/[0.1] shadow-[0_10px_28px_rgba(0,0,0,0.14)]"
                      : "border-[#17213b]/12 bg-white shadow-[0_12px_32px_rgba(23,33,59,0.08)]"
                    : isDark
                      ? "border-transparent hover:bg-white/[0.06]"
                      : "border-transparent hover:bg-[#17213b]/[0.04]",
                )}
                aria-label={`${item.year} - ${heading}`}
              >
                <span className="mt-0.5 shrink-0">
                  <TimelineDot
                    compact
                    isActive={isActive}
                    isPast={isPast}
                    onDarkSurface={isDark}
                  />
                </span>
                <span className="min-w-0 flex-1 pr-1">
                  <span
                    className={cn(
                      "text-[11px] font-semibold uppercase tracking-[0.14em] tabular-nums",
                      isActive
                        ? isDark
                          ? "text-white/90"
                          : "text-[#1f2a7c]"
                        : isDark
                          ? "text-white/45"
                          : "text-[#8b8278]",
                    )}
                  >
                    {item.year}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-pretty text-[15px] font-semibold leading-snug tracking-[-0.02em]",
                      isActive
                        ? isDark
                          ? "text-white"
                          : "text-[#17213b]"
                        : isDark
                          ? "text-white/70"
                          : "text-[#5c544e]",
                      !isActive && "line-clamp-2",
                    )}
                  >
                    {heading}
                  </span>
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "mt-1 size-4 shrink-0 transition-transform duration-200",
                    isActive ? "rotate-180" : "rotate-0",
                    isDark ? (isActive ? "text-white/70" : "text-white/35") : "text-[#17213b]/40",
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isActive ? (
                  <motion.div
                    id={panelId}
                    role="tabpanel"
                    aria-labelledby={tabId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={expandTransition}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-2 pt-1 pl-[2.75rem]">
                      <MilestoneRichText
                        milestone={item}
                        active={isDark}
                        className={cn(
                          "text-sm leading-relaxed",
                          isDark ? "text-white/85" : "text-[#6b625b]",
                        )}
                      />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function AboutExperienceTimeline({
  milestones,
  className,
  tone = "light",
  surface = "card",
  navigationAriaLabel = "Parcours professionnel par année",
}: AboutExperienceTimelineProps) {
  const instanceId = React.useId();
  const isLgUp = useIsLgUp();
  const reduceMotion = useReducedMotion();
  const isDark = tone === "dark";
  const isDotGrid = surface === "dot-grid";

  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, milestones.length - 1)));
  }, [milestones.length]);

  const selectStep = React.useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(milestones.length - 1, i + 1));
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
        setActiveIndex(milestones.length - 1);
      }
    },
    [milestones.length],
  );

  const active = milestones[activeIndex];
  const n = milestones.length;

  if (n === 0) return null;

  const panelTransition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  const activeTabId = isLgUp
    ? `timeline-tab-${instanceId}-${activeIndex}`
    : `timeline-m-tab-${instanceId}-${activeIndex}`;
  const activePanelId = isLgUp
    ? `timeline-panel-${instanceId}-${activeIndex}`
    : `timeline-m-panel-${instanceId}-${activeIndex}`;

  return (
    <div
      className={cn("w-full", className)}
      data-timeline-tone={tone}
      onKeyDown={onKeyDown}
    >
      <div
        className={cn(
          isDotGrid &&
            "relative overflow-hidden rounded-3xl border border-[#1f2a7c]/12 bg-white px-4 py-6 sm:px-6 sm:py-8 lg:rounded-[3rem] lg:px-10 lg:py-10",
          !isDotGrid && isDark && "text-white",
          !isDotGrid &&
            !isDark &&
            "rounded-[1.75rem] border border-[#e8dfd4] bg-white/60 p-5 shadow-[0_22px_70px_rgba(23,33,59,0.055)] backdrop-blur sm:p-8 lg:rounded-[2rem] lg:p-10",
        )}
        style={!isDotGrid && !isDark ? { backgroundColor: "rgba(255, 255, 255, 0.72)" } : undefined}
      >
        {isDotGrid ? <TimelineDotGrid /> : null}
        <div className={cn(isDotGrid && "relative z-10")}>
        <div role="tablist" aria-label={navigationAriaLabel}>
          {isLgUp ? (
            <DesktopTimelineTrack
              milestones={milestones}
              activeIndex={activeIndex}
              instanceId={instanceId}
              isDark={isDark}
              onSelect={selectStep}
            />
          ) : (
            <MobileVerticalTimeline
              milestones={milestones}
              activeIndex={activeIndex}
              instanceId={instanceId}
              isDark={isDark}
              onSelect={selectStep}
              reduceMotion={reduceMotion}
            />
          )}
        </div>

        {isLgUp ? (
          <AnimatePresence mode="wait" initial={false}>
            {active ? (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={panelTransition}
                className="mt-6 sm:mt-8"
              >
                <TimelineDetailCard
                  milestone={active}
                  panelId={activePanelId}
                  labelledBy={activeTabId}
                  tone={tone}
                  centered
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        ) : null}
        </div>
      </div>
    </div>
  );
}
