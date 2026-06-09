"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CONTACT_HREF, ROUTES } from "@/lib/content/routes";
import { SITE_BLOCK_SHELL } from "@/lib/content/landing-layout";
import {
  heroCtaPrimaryCompactClassName,
  heroCtaRowCompactClassName,
  heroCtaSecondaryOnDarkClassName,
} from "@/lib/styles/cta";
import { cn } from "@/lib/utils";

export function ServiceActionBand({
  imageSrc,
  title,
  description,
  primaryHref = CONTACT_HREF,
  primaryLabel = "Prendre rendez-vous",
  secondaryHref = ROUTES.notreCabinet,
  secondaryLabel = "Découvrir le cabinet",
}: {
  imageSrc: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section aria-labelledby="service-action-band-title" className={cn(SITE_BLOCK_SHELL, "scroll-mt-28")}>
      <div className="relative min-h-[min(28rem,85svh)] overflow-hidden rounded-[1.75rem] border border-[#1f2a7c]/15 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.5)] sm:min-h-0 lg:rounded-[2rem]">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <Image src={imageSrc} alt="" fill className="object-cover object-center" sizes="(min-width: 1024px) 80vw, 100vw" aria-hidden />
          <div className="absolute inset-0 bg-black/[0.58]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/68 to-black/52 xl:bg-gradient-to-r xl:from-black/[0.88] xl:via-black/62 xl:to-black/38" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_55%)]"
        />

          <div className="relative z-[2] flex flex-col justify-center px-6 py-12 text-center text-white sm:px-9 sm:py-14 lg:min-h-[22rem] lg:px-11 lg:py-16 lg:text-left">
          <h2
            id="service-action-band-title"
            className="mx-auto mt-3 max-w-2xl text-balance text-[clamp(1.45rem,4.2vw,2rem)] font-normal leading-[1.1] tracking-[-0.035em] lg:mx-0"
          >
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-white/85 lg:mx-0">{description}</p>
          <div className={cn("mx-auto mt-9 flex w-full max-w-md flex-col justify-center gap-3 sm:flex-row lg:mx-0", heroCtaRowCompactClassName)}>
            <Link href={primaryHref} className={cn(heroCtaPrimaryCompactClassName, "group w-full sm:w-auto")}>
              <span>{primaryLabel}</span>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <Link href={secondaryHref} className={cn(heroCtaSecondaryOnDarkClassName, "w-full sm:w-auto")}>
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
