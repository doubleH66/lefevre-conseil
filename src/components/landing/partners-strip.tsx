import { partners } from "@/lib/content/partners";
import { cn } from "@/lib/utils";

function LogoCard({ partner }: { partner: (typeof partners)[number] }) {
  const tooltip = `${partner.name} — ${partner.ratio}`;

  return (
    <div
      className="group/logo relative flex h-16 w-36 shrink-0 cursor-default items-center justify-center py-3 md:h-[4.5rem] md:w-44 md:shrink-0 md:px-2 lg:h-[5.5rem] lg:w-52 lg:px-3"
      title={tooltip}
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
   * `hero` : chevauchement sous le hero arrondi (même offset que l’accueil).
   * `page` : bandeau standard sous le contenu (ex. À propos).
   */
  layout?: "hero" | "page";
  className?: string;
};

/** Bandeau « Partenaires de confiance » + carrousel CSS (Server Component). */
export function PartnersStrip({ layout = "page", className }: PartnersStripProps) {
  return (
    <div
      className={cn(
        "mx-2.5 px-4 sm:px-7 lg:mx-4 xl:px-11",
        layout === "hero" ? "pb-2 pt-7 sm:pb-3 sm:pt-8 lg:-mt-12 lg:pb-3 lg:pt-10" : "pb-2 pt-6 sm:pb-3 sm:pt-8 lg:pt-10",
        className,
      )}
    >
      <div className="group relative z-10 m-auto w-full max-w-none min-w-0">
        <div className="flex w-full min-w-0 flex-col items-stretch gap-3 sm:gap-5 xl:flex-row xl:items-center xl:gap-0">
          <div className="hidden shrink-0 xl:block xl:max-w-44 xl:border-r xl:border-[#1f2a7c]/15 xl:pr-6">
            <p className="text-center text-[13px] font-semibold leading-snug tracking-wide text-[#1f2a7c] sm:text-sm xl:text-end">
              Partenaires de confiance
            </p>
          </div>
          <div className="relative z-[10] min-w-0 w-full py-0 xl:w-[calc(100%-11rem)]">
            <InfiniteSlider>
              {partners.map((partner) => (
                <LogoCard key={partner.name} partner={partner} />
              ))}
            </InfiniteSlider>
          </div>
        </div>
      </div>
    </div>
  );
}
