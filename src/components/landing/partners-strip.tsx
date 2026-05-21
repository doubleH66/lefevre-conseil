"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { partners } from "@/lib/content/partners";
import { cn } from "@/lib/utils";

type TooltipState = {
  visible: boolean;
  name: string;
  ratio: string;
  x: number;
  y: number;
};

function LogoCard({
  partner,
  onTooltip,
}: {
  partner: (typeof partners)[number];
  onTooltip: React.Dispatch<React.SetStateAction<TooltipState>>;
}) {
  const show = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onTooltip({
      visible: true,
      name: partner.name,
      ratio: partner.ratio,
      x: rect.left + rect.width / 2,
      y: rect.top - 14,
    });
  };
  const hide = () => onTooltip((t) => ({ ...t, visible: false }));

  return (
    <div
      className="group/logo relative flex h-16 w-36 shrink-0 cursor-pointer items-center justify-center py-3 md:h-[4.5rem] md:w-44 md:shrink-0 md:px-2 lg:h-[5.5rem] lg:w-52 lg:px-3"
      onMouseEnter={show}
      onMouseMove={show}
      onMouseLeave={hide}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={partner.src}
        alt={`${partner.name} logo`}
        className="partner-logo-img h-11 w-full object-contain opacity-70 grayscale transition-all duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 md:h-14 md:w-full lg:h-16"
      />
    </div>
  );
}

function PartnerTooltip({ tooltip }: { tooltip: TooltipState }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!tooltip.visible || !mounted) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed z-[9999] w-[280px] -translate-x-1/2 -translate-y-full rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.16)]"
      style={{ left: tooltip.x, top: tooltip.y }}
    >
      <div className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 border-b border-r border-neutral-200/80 bg-white" />
      <p className="text-sm font-semibold text-neutral-950">{tooltip.name}</p>
      <p className="mt-2 text-xs leading-5 text-neutral-600">{tooltip.ratio}</p>
    </div>,
    document.body,
  );
}

function InfiniteSlider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-w-0 py-5 lg:py-6">
      <div className="partner-mask overflow-hidden">
        <div className="infinite-slider-track flex w-max items-center gap-8 md:gap-10 lg:gap-12">
          {children}
          <span aria-hidden className="contents">
            {children}
          </span>
        </div>
      </div>
    </div>
  );
}

type PartnersStripProps = {
  /**
   * `hero` : chevauchement sous le hero arrondi (même offset que l'accueil).
   * `page` : bandeau standard sous le contenu.
   */
  layout?: "hero" | "page";
  className?: string;
};

/** Bandeau « Partenaires de confiance » + carrousel infini avec tooltip solvabilité au survol. */
export function PartnersStrip({ layout = "page", className }: PartnersStripProps) {
  const [tooltip, setTooltip] = React.useState<TooltipState>({
    visible: false,
    name: "",
    ratio: "",
    x: 0,
    y: 0,
  });

  return (
    <>
      <div
        className={cn(
          "mx-2.5 px-4 sm:px-7 lg:mx-4 xl:px-11",
          layout === "hero"
            ? "pb-2 pt-7 sm:pb-3 sm:pt-8 lg:-mt-12 lg:pb-3 lg:pt-10"
            : "pb-2 pt-6 sm:pb-3 sm:pt-8 lg:pt-10",
          className,
        )}
      >
        <div className="group relative z-10 m-auto w-full min-w-0 max-w-none">
          <div className="flex w-full min-w-0 flex-col items-stretch gap-3 sm:gap-5 xl:flex-row xl:items-center xl:gap-0">
            <div className="hidden shrink-0 xl:block xl:max-w-44 xl:border-r xl:border-[#1f2a7c]/15 xl:pr-6">
              <p className="text-center text-[13px] font-semibold leading-snug tracking-wide text-[#1f2a7c] sm:text-sm xl:text-end">
                Partenaires de confiance
              </p>
            </div>
            <div className="relative z-[10] w-full min-w-0 py-0 xl:w-[calc(100%-11rem)]">
              <InfiniteSlider>
                {partners.map((partner) => (
                  <LogoCard key={partner.name} partner={partner} onTooltip={setTooltip} />
                ))}
              </InfiniteSlider>
            </div>
          </div>
        </div>
      </div>
      <PartnerTooltip tooltip={tooltip} />
    </>
  );
}
