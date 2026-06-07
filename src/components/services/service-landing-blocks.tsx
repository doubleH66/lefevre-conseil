import type { ReactNode } from "react";
import {
  marketingPageShellClass,
  marketingProseClass,
  marketingTitleClass,
} from "@/components/marketing/marketing-styles";
import { cn } from "@/lib/utils";

export const serviceLandingSectionClass = "mx-2.5 mt-3 bg-white text-[#1f2a7c] lg:mx-4 lg:mt-4";

export const serviceLandingInnerClass = "px-4 py-10 sm:px-7 sm:py-12 xl:px-11 xl:py-14";

export const serviceContentMaxClass = "mx-auto w-full max-w-5xl text-center";

export { marketingPageShellClass as servicePageShellClass };

export function ServiceLandingBlock({
  labelledBy,
  id,
  children,
  className,
}: {
  labelledBy?: string;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(serviceLandingSectionClass, "scroll-mt-28", className)}
    >
      <div className={serviceLandingInnerClass}>{children}</div>
    </section>
  );
}

export function ServiceLeadParagraph({ children, className }: { children: ReactNode; className?: string }) {
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

export function ServiceSectionTitle({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h2 id={id} className={cn(marketingTitleClass, marketingProseClass)}>
      {children}
    </h2>
  );
}
