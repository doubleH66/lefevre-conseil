import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { NOTRE_CABINET_HREF } from "@/lib/content/routes";
import {
  CABINET_CONTACT,
  CABINET_PORTRAIT_IMAGE_URL,
  CABINET_PORTRAIT_OBJECT_POSITION,
} from "@/lib/content/site";
import { CabinetIntroExpand } from "@/components/client/cabinet-intro-expand";
import { Highlight } from "@/components/ui/highlight";
import { CtaPrimaryLink, heroCtaRowClassName } from "@/components/ui/cta-link";
import { cn } from "@/lib/utils";

const cabinetIntroProseColor =
  "text-[#1f2a7c]/78 max-lg:text-[#1f2a7c]/72 lg:text-[#1f2a7c]/88";

const stats = [
  { value: "19+", label: "Années d’expertise" },
  { value: "100+", label: "Clients satisfaits" },
  { value: "40+", label: "Partenaires" },
] as const;

function highlightPillClassName() {
  return "rounded-lg px-1.5 pb-0.5";
}

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
      className="mx-2.5 mt-3 bg-white text-[#1f2a7c] lg:mx-4 lg:mt-4"
      aria-labelledby="cabinet-intro-title"
    >
      <div className="px-4 py-10 sm:px-7 sm:py-12 xl:px-11 xl:py-14">
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
                Patrimoine, fiscalité et transmission : conseil en gestion de patrimoine en Occitanie, ouvert sur la
                France entière.
              </h2>

              <div
                className={cn(
                  "mx-auto mt-5 max-w-none space-y-4 text-balance text-center text-[1.0625rem] font-normal leading-snug tracking-[-0.012em] sm:mt-6 sm:text-lg sm:leading-relaxed lg:mt-6 xl:mx-0 xl:text-left",
                  cabinetIntroProseColor,
                )}
              >
                <p>
                  {CABINET_CONTACT.name} structure des{" "}
                  <Highlight variant="light" className={highlightPillClassName()}>
                    parcours patrimoniaux
                  </Highlight>{" "}
                  depuis {`${CABINET_CONTACT.address.city} (${CABINET_CONTACT.address.postalCode})`}, en
                  Pyrénées-Orientales. Nous accompagnons ménages, dirigeants et professions réglementées sur tout le{" "}
                  <Highlight variant="light" delay="hero" className={highlightPillClassName()}>
                    territoire national
                  </Highlight>{" "}
                  : entretiens au cabinet, visioconférence ou coordination avec vos autres interlocuteurs.
                </p>

                <div className="hidden lg:block">
                  <p>
                    En qualité d’
                    <Highlight variant="light" delay="hero" className={highlightPillClassName()}>
                      agent de l’épargne
                    </Highlight>
                    , nous articulons vos priorités : épargne longue durée, horizon retraite, prévoyance, arbitrage
                    fiscal dans le respect du cadre légal, solutions d’investissement (assurance vie, PER) et
                    stratégies de transmission. Une relation{" "}
                    <Highlight variant="light" className={highlightPillClassName()}>
                      indépendante et pédagogique
                    </Highlight>
                    , pour des décisions posées dans la durée.
                  </p>
                </div>

                <CabinetIntroExpand>
                  <p className="pt-4">
                    En qualité d’
                    <Highlight variant="light" delay="hero" className={highlightPillClassName()}>
                      agent de l’épargne
                    </Highlight>
                    , nous articulons vos priorités : épargne longue durée, horizon retraite, prévoyance, arbitrage
                    fiscal dans le respect du cadre légal, solutions d’investissement (assurance vie, PER) et
                    stratégies de transmission. Une relation{" "}
                    <Highlight variant="light" className={highlightPillClassName()}>
                      indépendante et pédagogique
                    </Highlight>
                    , pour des décisions posées dans la durée.
                  </p>
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
                  unoptimized
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
