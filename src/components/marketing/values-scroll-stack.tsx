"use client";

import * as React from "react";
import { HighlightReveal } from "@/components/ui/highlight-reveal";
import { cn } from "@/lib/utils";

export type ValueCardPart = {
  text: string;
  highlight?: boolean;
};

export type ValueCardItem = {
  title: string;
  kicker?: string;
  parts: readonly ValueCardPart[];
};

type ValuesScrollStackProps = {
  values: readonly ValueCardItem[];
  highlightClassName?: string;
  className?: string;
};

const STICKY_TOP_BASE = 88;
const STICKY_STEP = 18;

function ValueCardContent({
  value,
  highlightClassName,
}: {
  value: ValueCardItem;
  highlightClassName: string;
}) {
  return (
    <>
      {value.kicker ? (
        <p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1f2a7c]/55 lg:block">
          {value.kicker}
        </p>
      ) : null}
      <h3 className={cn("text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl", value.kicker && "mt-2")}>
        {value.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
        {value.parts.map((part, index) =>
          part.highlight ? (
            <HighlightReveal key={`${value.title}-hl-${index}`} variant="light" className={highlightClassName}>
              {part.text}
            </HighlightReveal>
          ) : (
            <React.Fragment key={`${value.title}-t-${index}`}>{part.text}</React.Fragment>
          ),
        )}
      </p>
    </>
  );
}

export function ValuesScrollStack({ values, highlightClassName, className }: ValuesScrollStackProps) {
  const count = values.length;
  const sectionMinHeight = `calc(${count} * min(52vh, 28rem) + 12rem)`;

  return (
    <div
      className={cn("relative mx-auto w-full max-w-lg sm:max-w-xl", className)}
      style={{ minHeight: sectionMinHeight }}
    >
      {values.map((value, index) => (
        <article
          key={value.title}
          className={cn(
            "sticky mb-5 rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-[0_18px_50px_rgba(23,33,59,0.08)] sm:p-7",
            "ring-1 ring-[#1f2a7c]/[0.06] transition-shadow duration-300",
            index === count - 1 && "mb-0",
          )}
          style={{
            top: STICKY_TOP_BASE + index * STICKY_STEP,
            zIndex: index + 1,
          }}
        >
          <ValueCardContent value={value} highlightClassName={highlightClassName ?? ""} />
        </article>
      ))}
    </div>
  );
}
