import type { ReactNode } from "react";
import { HighlightReveal } from "@/components/ui/highlight-reveal";
import {
  marketingHighlightPill,
  marketingInnerClass,
  marketingKickerClass,
  marketingProseClass,
  marketingSectionClass,
  marketingTitleClass,
} from "@/components/marketing/marketing-styles";
import { cn } from "@/lib/utils";

export function MarketingPageStack({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("relative z-0", className)}>{children}</div>;
}

type MarketingSectionProps = {
  id?: string;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
  variant?: "white" | "flush";
};

export function MarketingSection({
  id,
  labelledBy,
  children,
  className,
  variant = "white",
}: MarketingSectionProps) {
  if (variant === "flush") {
    return (
      <section id={id} aria-labelledby={labelledBy} className={cn("scroll-mt-28", className)}>
        {children}
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(marketingSectionClass, "scroll-mt-28", className)}
    >
      <div className={marketingInnerClass}>{children}</div>
    </section>
  );
}

type MarketingHeadingProps = {
  kicker?: string;
  title: ReactNode;
  titleId?: string;
  lead?: ReactNode;
  align?: "center" | "left";
  className?: string;
};

export function MarketingHeading({
  kicker,
  title,
  titleId,
  lead,
  align = "center",
  className,
}: MarketingHeadingProps) {
  const centered = align === "center";

  return (
    <header className={cn(centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl", className)}>
      {kicker ? (
        <p className={cn(marketingKickerClass, centered && "inline-flex items-center justify-center gap-2")}>
          {centered ? <span aria-hidden className="inline-block h-px w-5 bg-[#1f2a7c]/40" /> : null}
          {kicker}
        </p>
      ) : null}
      <h2 id={titleId} className={cn("mt-3", marketingTitleClass, marketingProseClass)}>
        {title}
      </h2>
      {lead ? (
        <div
          className={cn(
            "mt-5 text-[1.0625rem] leading-snug sm:mt-6 sm:text-lg sm:leading-relaxed",
            marketingProseClass,
            centered && "mx-auto max-w-2xl",
          )}
        >
          {lead}
        </div>
      ) : null}
    </header>
  );
}

export function MarketingLead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "mx-auto mt-5 max-w-2xl text-balance text-[1.0625rem] leading-snug sm:mt-6 sm:text-lg sm:leading-relaxed",
        marketingProseClass,
        className,
      )}
    >
      {children}
    </p>
  );
}

export function MarketingHighlight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <HighlightReveal variant="light" delay="none" className={cn(marketingHighlightPill, className)}>
      {children}
    </HighlightReveal>
  );
}
