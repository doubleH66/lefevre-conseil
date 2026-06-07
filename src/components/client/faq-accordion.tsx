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
  tone = "neutral",
  layout = "cards",
}: {
  items: readonly FaqItem[];
  className?: string;
  searchQuery?: string;
  singleOpen?: boolean;
  questionEmphasis?: "none" | "highlight";
  /** `brand` --- bordures et texte Lefèvre (accueil). */
  tone?: "neutral" | "brand";
  /** `divided` --- liste épurée avec séparateurs (sans encadrés). */
  layout?: "cards" | "divided";
}) {
  const isBrand = tone === "brand";
  const isDivided = layout === "divided";
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

  const questionLabel = (item: FaqItem) =>
    questionEmphasis === "highlight" ? (
      <HighlightReveal variant="light" delay="none" className="rounded-lg px-1.5 pb-0.5">
        {hasSearch ? <SearchHighlight text={item.q} query={searchQuery} pill="slim" /> : item.q}
      </HighlightReveal>
    ) : hasSearch ? (
      <SearchHighlight text={item.q} query={searchQuery} pill="slim" />
    ) : (
      item.q
    );

  const answerBody = (item: FaqItem) =>
    hasSearch ? (
      <SearchHighlight text={stripInlineMarkdown(item.a)} query={searchQuery} pill="slim" />
    ) : (
      <RichText>{item.a}</RichText>
    );

  return (
    <ul
      className={cn(
        isDivided
          ? cn(
              "divide-y",
              isBrand
                ? "divide-[#1f2a7c]/8 border-y border-[#1f2a7c]/8"
                : "divide-zinc-200/90 border-y border-zinc-200/90",
            )
          : "space-y-3",
        className,
      )}
    >
      {items.map((item, index) => {
        const isOpen = openSet.has(index);
        const triggerId = `faq-${baseId}-t-${index}`;
        const panelId = `faq-${baseId}-p-${index}`;
        const Icon = item.icon;

        if (isDivided) {
          return (
            <li key={`${item.q}-${index}`} className="group/faq">
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className={cn(
                  "flex w-full items-start justify-between gap-3 py-5 text-left outline-none transition-[color,background-color] duration-200 md:gap-4 md:py-6",
                  "rounded-lg focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/12 focus-visible:ring-offset-2",
                  isBrand && "hover:bg-[#1f2a7c]/[0.025]",
                  !isBrand && "hover:bg-zinc-50/80",
                )}
              >
                <span
                  className={cn(
                    "min-w-0 flex-1 text-balance text-[15px] leading-snug tracking-[-0.018em] transition-[font-weight,color] duration-200 md:text-[16px] md:leading-[1.45]",
                    isBrand
                      ? isOpen
                        ? "font-semibold text-[#1f2a7c]"
                        : "font-medium text-[#1f2a7c]/86 group-hover/faq:text-[#1f2a7c]"
                      : isOpen
                        ? "font-semibold text-zinc-950"
                        : "font-medium text-zinc-800",
                  )}
                >
                  {questionLabel(item)}
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform] duration-200",
                    isBrand
                      ? isOpen
                        ? "bg-[#1f2a7c]/10 text-[#1f2a7c]/60"
                        : "text-[#1f2a7c]/28 group-hover/faq:bg-[#1f2a7c]/6 group-hover/faq:text-[#1f2a7c]/45"
                      : isOpen
                        ? "bg-zinc-100 text-zinc-600"
                        : "text-zinc-400 group-hover/faq:bg-zinc-100 group-hover/faq:text-zinc-600",
                  )}
                >
                  <ChevronDown
                    className={cn("size-4 transition-transform duration-300 ease-out", isOpen && "rotate-180")}
                    aria-hidden
                  />
                </span>
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div
                    className={cn(
                      "pb-5 md:pb-6",
                      isBrand
                        ? "border-l-2 border-[#1f2a7c]/12 pl-4 md:pl-5"
                        : "border-l-2 border-zinc-200 pl-4 md:pl-5",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-2xl text-sm leading-relaxed md:pr-8 md:text-[15px] md:leading-7",
                        isBrand ? "text-[#1f2a7c]/70" : "text-zinc-600",
                      )}
                    >
                      {answerBody(item)}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        }

        return (
          <li key={`${item.q}-${index}`}>
            <div
              className={cn(
                "overflow-hidden rounded-2xl border bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
                isBrand ? "border-[#1f2a7c]/12" : "border-zinc-200 shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
              )}
            >
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 bg-white px-5 py-4 text-left transition md:px-6 md:py-[1.125rem]",
                  isBrand ? "hover:bg-[#1f2a7c]/[0.03]" : "hover:bg-zinc-50",
                )}
              >
                <span className="flex min-w-0 flex-1 items-center gap-3.5">
                  {Icon ? (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                      <Icon className="size-4 text-zinc-600" aria-hidden />
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "text-sm font-medium md:text-[15px] md:leading-snug",
                      isBrand ? "text-[#1f2a7c]" : "text-zinc-950",
                    )}
                  >
                    {questionLabel(item)}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 transition-transform duration-200",
                    isBrand ? "text-[#1f2a7c]/35" : "text-zinc-950/40",
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
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  isBrand ? "bg-[#1f2a7c]/[0.035]" : "bg-zinc-50",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div
                    className={cn(
                      "border-t px-5 pb-4 pt-3 text-sm leading-7 md:px-6",
                      isBrand
                        ? "border-[#1f2a7c]/10 text-[#1f2a7c]/78"
                        : "border-zinc-200/90 text-zinc-700",
                    )}
                  >
                    {hasSearch ? <p>{answerBody(item)}</p> : answerBody(item)}
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
