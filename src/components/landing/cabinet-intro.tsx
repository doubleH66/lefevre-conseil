import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { NOTRE_CABINET_HREF } from "@/lib/content/routes";
import {
  CABINET_CONTACT,
  CABINET_PORTRAIT_IMAGE_URL,
  CABINET_PORTRAIT_OBJECT_POSITION,
} from "@/lib/content/site";
import { CabinetIntroExpand } from "@/components/client/cabinet-intro-expand";
import {
  CabinetIntroExtraParagraphs,
  CabinetIntroParagraph1,
  CabinetIntroTitleHighlights,
} from "@/components/landing/cabinet-intro-highlights";
import { CtaPrimaryLink, heroCtaRowClassName } from "@/components/ui/cta-link";
import {
  LANDING_SCROLL_MARGIN,
  LANDING_SECTION_INNER_Y,
  LANDING_SECTION_INSET,
  LANDING_SECTION_SHELL,
} from "@/lib/content/landing-layout";
import { cn } from "@/lib/utils";

const cabinetIntroProseColor =
  "text-[#1f2a7c]/78 max-lg:text-[#1f2a7c]/72 lg:text-[#1f2a7c]/88";

const stats = [
  { value: "19+", label: "Années d’expertise" },
  { value: "100+", label: "Clients satisfaits" },
  { value: "40+", label: "Partenaires" },
] as const;

function StatValue({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-0 py-1.5 text-center md:py-2 xl:text-left">
      <p className="tabular-nums text-[clamp(1.125rem,2.8vw,1.75rem)] font-semibold leading-none tracking-[-0.03em] text-[#1f2a7c] md:text-[clamp(1.25rem,2.4vw,1.875rem)]">
        {value}
      </p>
      <p className="mt-1.5 text-balance text-[10px] font-medium leading-snug text-[#1f2a7c]/70 sm:mt-2 sm:text-[11px] md:text-xs">
        {label}
      </p>
    </div>
  );
}

/** Introduction cabinet (Server Component — expand mobile via `<details>`). */
export function CabinetIntro() {
  return (
    <section
      id="apres-hero"
      data-nav-theme="light"
      className={cn(LANDING_SECTION_SHELL, LANDING_SCROLL_MARGIN, "mt-2 bg-white text-[#1f2a7c] sm:mt-3")}
      aria-labelledby="cabinet-intro-title"
    >
      <div className={cn(LANDING_SECTION_INSET, LANDING_SECTION_INNER_Y)}>
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch lg:gap-6 xl:gap-10">
          <div className="flex min-w-0 flex-col justify-between lg:pr-2 xl:pr-6">
            <div className="mx-auto w-full max-w-none xl:mx-0">
              <h2
                id="cabinet-intro-title"
                className={cn(
                  "w-full text-balance text-center text-[clamp(1.28rem,3.2vw,2.05rem)] font-normal leading-[1.08] tracking-[-0.038em] sm:text-[clamp(1.35rem,2.9vw,2.2rem)] xl:text-left",
                  cabinetIntroProseColor,
                )}
              >
                <CabinetIntroTitleHighlights />
              </h2>

              <div
                className={cn(
                  "mx-auto mt-5 max-w-none space-y-4 text-balance text-center text-[1.0625rem] font-normal leading-snug tracking-[-0.012em] sm:mt-6 sm:text-lg sm:leading-relaxed lg:mt-6 xl:mx-0 xl:text-left",
                  cabinetIntroProseColor,
                )}
              >
                <CabinetIntroParagraph1 />

                <div className="hidden space-y-4 lg:block">
                  <CabinetIntroExtraParagraphs />
                </div>

                <CabinetIntroExpand>
                  <div className="space-y-4 pt-4">
                    <CabinetIntroExtraParagraphs />
                  </div>
                </CabinetIntroExpand>
              </div>

              <div className={cn("mt-6 justify-center sm:mt-8 lg:mt-8", heroCtaRowClassName, "xl:justify-start")}>
                <CtaPrimaryLink href={NOTRE_CABINET_HREF} className="group">
                  Découvrir le cabinet
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </CtaPrimaryLink>
              </div>
            </div>

            <div className="mx-auto mt-6 grid w-full max-w-none grid-cols-3 gap-1.5 sm:mt-8 sm:gap-2 md:mt-10 xl:mx-0">
              {stats.map((stat) => (
                <StatValue key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col lg:h-full lg:min-h-0">
            <div className="box-border flex min-h-0 flex-1 flex-col p-4 sm:p-5 xl:p-6">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] bg-neutral-100 md:rounded-[2.25rem] lg:aspect-auto lg:h-full lg:min-h-0 lg:rounded-[2.5rem]">
                <Image
                  src={CABINET_PORTRAIT_IMAGE_URL}
                  alt={`Philippe Lefèvre, ${CABINET_CONTACT.name} - conseil en gestion de patrimoine à Perpignan (${CABINET_CONTACT.address.postalCode})`}
                  fill
                  className="object-cover"
                  style={{ objectPosition: CABINET_PORTRAIT_OBJECT_POSITION }}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f2a7c]/25 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
