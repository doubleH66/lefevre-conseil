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
  parts: readonly ValueCardPart[];
};

type ValuesScrollStackProps = {
  values: readonly ValueCardItem[];
  highlightClassName?: string;
  className?: string;
};

function ValueCardContent({
  value,
  highlightClassName,
}: {
  value: ValueCardItem;
  highlightClassName: string;
}) {
  return (
    <>
      <h3 className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
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
  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {values.map((value) => (
        <article
          key={value.title}
          className={cn(
            "rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-[0_18px_50px_rgba(23,33,59,0.08)] sm:p-7",
            "ring-1 ring-[#1f2a7c]/[0.06]",
          )}
        >
          <ValueCardContent value={value} highlightClassName={highlightClassName ?? ""} />
        </article>
      ))}
    </div>
  );
}
