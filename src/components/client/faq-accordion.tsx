"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
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

export type FaqItem = { q: string; a: string };

export function FaqAccordion({
  items,
  className,
  questionEmphasis = "none",
  searchQuery = "",
}: {
  items: readonly FaqItem[];
  className?: string;
  questionEmphasis?: "none" | "highlight";
  /** Terme de recherche : les correspondances sont soulignées dans les questions et réponses. */
  searchQuery?: string;
}) {
  const hasSearch = searchQuery.trim().length > 0;
  const baseId = React.useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const [openSet, setOpenSet] = React.useState<Set<number>>(() => new Set());

  const transition = React.useMemo(
    () =>
      reduceMotion
        ? { duration: 0.15 }
        : { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const },
    [reduceMotion],
  );

  const toggle = React.useCallback((index: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  return (
    <ul
      className={cn(
        "overflow-hidden rounded-2xl border border-[#1f2a7c]/10 bg-white/90 shadow-[0_12px_40px_-28px_rgba(31,42,124,0.12)]",
        className,
      )}
    >
      {items.map((item, index) => {
        const isOpen = openSet.has(index);
        const triggerId = `faq-${baseId}-t-${index}`;
        const panelId = `faq-${baseId}-p-${index}`;

        return (
          <li
            key={`${item.q}-${index}`}
            className="border-b border-[#1f2a7c]/[0.08] last:border-b-0"
          >
            <h3 className="m-0 text-base font-normal">
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-[#1f2a7c] outline-none transition-[background-color] duration-200 hover:bg-[#1f2a7c]/[0.04] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1f2a7c]/20 sm:px-6 sm:text-[15px]"
                onClick={() => toggle(index)}
              >
                <span className="min-w-0 flex-1 leading-snug">
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
                <motion.span
                  aria-hidden
                  className="mt-0.5 shrink-0 text-[#1f2a7c]/40"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={transition}
                >
                  <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.span>
              </button>
            </h3>
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={transition}
              className="overflow-hidden will-change-[height,opacity]"
            >
              <div className="px-5 pb-4 pt-0 sm:px-6">
                {hasSearch ? (
                  <p className="text-sm leading-relaxed text-[#1f2a7c]/72 sm:text-[15px] sm:leading-relaxed">
                    <SearchHighlight text={stripInlineMarkdown(item.a)} query={searchQuery} />
                  </p>
                ) : (
                  <RichText className="text-sm leading-relaxed text-[#1f2a7c]/72 sm:text-[15px] sm:leading-relaxed">
                    {item.a}
                  </RichText>
                )}
              </div>
            </motion.div>
          </li>
        );
      })}
    </ul>
  );
}
