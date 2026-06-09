"use client";

import {
  FaqSectionClient,
  type FaqSectionItem,
} from "@/components/client/faq-section-client";
import { FAQ_EXPAND_LINK, SHORT_FAQ_MAX_ITEMS } from "@/lib/content/faq-section";

type ShortFaqSectionProps = {
  items: readonly FaqSectionItem[];
  title?: string;
  titleId?: string;
  titleClassName?: string;
  contentClassName?: string;
  className?: string;
  maxItems?: number;
  showTitle?: boolean;
  footerLink?: { href: string; label: string };
};

/** FAQ courte (4 questions max) — même UI que /faq, lien vers la FAQ complète. */
export function ShortFaqSection({
  maxItems = SHORT_FAQ_MAX_ITEMS,
  footerLink = FAQ_EXPAND_LINK,
  ...props
}: ShortFaqSectionProps) {
  return (
    <FaqSectionClient
      {...props}
      maxItems={maxItems}
      showContactLink={false}
      footerLink={footerLink}
    />
  );
}
