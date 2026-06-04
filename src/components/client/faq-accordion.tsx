"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { HighlightReveal } from "@/components/ui/highlight-reveal";
import { RichText } from "@/components/ui/rich-text";
import { SearchHighlight } from "@/components/ui/search-highlight";
import { cn } from "@/lib/utils";

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1");
}

const questionHighlightPill = "rounded-lg px-1.5 pb-0.5";

export type FaqItem = {
  q: string;
  a: string;
  icon?: LucideIcon;
};

export function FaqAccordion({
  items,
  className,
  questionEmphasis = "none",
  searchQuery = "",
  singleOpen = true,
}: {
  items: readonly FaqItem[];
  className?: string;
  questionEmphasis?: "none" | "highlight";
  searchQuery?: string;
  singleOpen?: boolean;
}) {
  const hasSearch = searchQuery.trim().length > 0;
  const baseId = React.useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const [openSet, setOpenSet] = React.useState<Set<number>>(() => new Set());

  const transition = React.useMemo(
    () =>
      reduceMotion
        ? { duration: 0.15 }
        : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
    [reduceMotion],
  );

  const toggle = React.useCallback(
    (index: number) => {
      setOpenSet((prev) => {
        if (singleOpen) {
          if (prev.has(index)) return new Set();
          return new Set([index]);
        }
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      });
    },
    [singleOpen],
  );

  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item, index) => {
        const isOpen = openSet.has(index);
        const triggerId = `faq-${baseId}-t-${index}`;
        const panelId = `faq-${baseId}-p-${index}`;
        const Icon = item.icon;

        return (
          <li key={`${item.q}-${index}`}>
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_4px_24px_rgba(10,20,40,0.08)]">
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-neutral-50/80 sm:px-5"
              >
                <span className="flex min-w-0 flex-1 items-center gap-3.5">
                  {Icon ? (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1f2a7c]/[0.07]">
                      <Icon className="size-4 text-[#1f2a7c]/70" aria-hidden />
                    </span>
                  ) : null}
                  <span className="text-sm font-medium leading-snug text-[#1f2a7c] sm:text-[15px]">
                    {questionEmphasis === "highlight" ? (
                      <HighlightReveal variant="light" delay="none" className={questionHighlightPill}>
                        {hasSearch ? (
                          <SearchHighlight text={item.q} query={searchQuery} />
                        ) : (
                          item.q
                        )}
                      </HighlightReveal>
                    ) : hasSearch ? (
                      <SearchHighlight text={item.q} query={searchQuery} />
                    ) : (
                      item.q
                    )}
                  </span>
                </span>
                <motion.span
                  aria-hidden
                  className="shrink-0 text-[#1f2a7c]/35"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={transition}
                >
                  <ChevronDown className="size-5" />
                </motion.span>
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={cn(
                  "grid border-t border-neutral-200/80 bg-[#fafbfd] transition-[grid-template-rows] duration-200 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-4 pt-3 sm:px-5">
                    {hasSearch ? (
                      <p className="text-sm leading-relaxed text-[#1f2a7c]/72 sm:text-[15px]">
                        <SearchHighlight text={stripInlineMarkdown(item.a)} query={searchQuery} />
                      </p>
                    ) : (
                      <RichText className="text-sm leading-relaxed text-[#1f2a7c]/72 sm:text-[15px]">
                        {item.a}
                      </RichText>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
