"use client";

import * as React from "react";
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

export type FaqItem = {
  q: string;
  a: string;
  icon?: LucideIcon;
};

export function FaqAccordion({
  items,
  className,
  searchQuery = "",
  singleOpen = true,
  questionEmphasis = "none",
}: {
  items: readonly FaqItem[];
  className?: string;
  searchQuery?: string;
  singleOpen?: boolean;
  questionEmphasis?: "none" | "highlight";
}) {
  const hasSearch = searchQuery.trim().length > 0;
  const baseId = React.useId().replace(/:/g, "");
  const [openSet, setOpenSet] = React.useState<Set<number>>(() => new Set());

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
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 bg-white px-5 py-4 text-left transition hover:bg-zinc-50"
              >
                <span className="flex min-w-0 flex-1 items-center gap-3.5">
                  {Icon ? (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                      <Icon className="size-4 text-zinc-600" aria-hidden />
                    </span>
                  ) : null}
                  <span className="text-sm font-medium text-zinc-950 md:text-base">
                    {questionEmphasis === "highlight" ? (
                      <HighlightReveal variant="light" delay="none" className="rounded-lg px-1.5 pb-0.5">
                        {hasSearch ? <SearchHighlight text={item.q} query={searchQuery} /> : item.q}
                      </HighlightReveal>
                    ) : hasSearch ? (
                      <SearchHighlight text={item.q} query={searchQuery} />
                    ) : (
                      item.q
                    )}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-zinc-950/40 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={cn(
                  "grid bg-zinc-50 transition-[grid-template-rows] duration-200 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-zinc-200/90 px-5 pb-4 pt-3 text-sm leading-7 text-zinc-700">
                    {hasSearch ? (
                      <p>
                        <SearchHighlight text={stripInlineMarkdown(item.a)} query={searchQuery} />
                      </p>
                    ) : (
                      <RichText>{item.a}</RichText>
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
