"use client";

import * as React from "react";
import { HighlightReveal } from "@/components/ui/highlight-reveal";
import { marketingHighlightPill } from "@/components/marketing/marketing-styles";
import { cn } from "@/lib/utils";

/**
 * Markdown léger pour pages services :
 * **gras** · *italique* · __souligné__ · ^^surligné hero^^
 */
export function ServiceRichText({
  children,
  className,
  as: Tag = "p",
}: {
  children: string;
  className?: string;
  as?: "p" | "span" | "li" | "h2" | "h3";
}) {
  const nodes = parseInline(children);
  return <Tag className={className}>{nodes}</Tag>;
}

function parseInline(text: string): React.ReactNode[] {
  const pattern = /(\*\*(.+?)\*\*)|(__(.+?)__)|(\^\^(.+?)\^\^)|(\*(.+?)\*)/g;
  const result: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      result.push(text.slice(last, match.index));
    }

    if (match[1]) {
      result.push(
        <strong key={key++} className="font-semibold text-[#1f2a7c]">
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      result.push(
        <span key={key++} className="underline underline-offset-2 decoration-[#1f2a7c]/45">
          {match[4]}
        </span>,
      );
    } else if (match[5]) {
      result.push(
        <HighlightReveal key={key++} variant="light" delay="none" className={cn(marketingHighlightPill)}>
          {match[6]}
        </HighlightReveal>,
      );
    } else if (match[7]) {
      result.push(
        <em key={key++} className="italic not-[strong]:opacity-80">
          {match[8]}
        </em>,
      );
    }

    last = match.index + match[0].length;
  }

  if (last < text.length) {
    result.push(text.slice(last));
  }

  return result;
}
