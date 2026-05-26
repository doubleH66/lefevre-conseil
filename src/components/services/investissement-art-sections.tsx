import Link from "next/link";
import {
  Building2,
  FileCheck,
  Frame,
  Palette,
  Shield,
  Sparkles,
  TrendingDown,
  Truck,
  Unlock,
  Users,
} from "lucide-react";
import {
  ART_ACCOMPANIMENT_STEPS,
  ART_CONTACT_SUBJECT,
  ART_INVESTMENT_IMAGES,
  ART_NOUVEAUTES,
  ART_TAX_BENEFITS,
  ART_VISUAL_BENEFITS,
} from "@/lib/content/investissement-art-content";
import { CONTACT_HREF } from "@/lib/content/routes";
import { marketingKickerClass, marketingTitleClass } from "@/components/marketing/marketing-styles";
import { cn } from "@/lib/utils";

const artContactHref = `${CONTACT_HREF}?objet=${encodeURIComponent(ART_CONTACT_SUBJECT)}`;

const visualIcons = [Sparkles, Palette, Users] as const;
const taxIcons = [TrendingDown, Unlock, Shield] as const;
const stepIcons = [Frame, FileCheck, Truck] as const;

/** Images WordPress externes — <img> natif pour éviter la config next/image. */
function ArtRemoteImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn("size-full object-cover", className)}
    />
  );
}

function ArtBlock({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cn("mx-2.5 mt-3 bg-white lg:mx-4 lg:mt-4", className)}>
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">{children}</div>
    </div>
  );
}

function SectionTitle({ kicker, title, id }: { kicker?: string; title: string; id: string }) {
  return (
    <header className="text-center">
      {kicker ? <p className={marketingKickerClass}>{kicker}</p> : null}
      <h2 id={id} className={cn("mt-2", marketingTitleClass)}>
        {title}
      </h2>
    </header>
  );
}

export function InvestissementArtSections() {
  return (
    <>
      <ArtBlock id="nouveautes">
        <SectionTitle title="Les nouveautés du moment" id="art-nouveautes-title" />
        <ul className="mt-8 grid gap-5 sm:grid-cols-3">
          {ART_NOUVEAUTES.map((piece) => (
            <li key={piece.id}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#1f2a7c]/10 bg-[#fafbfc] shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  <ArtRemoteImage
                    src={piece.image}
                    alt={piece.imageAlt}
                    className="transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex flex-1 flex-col px-4 py-4 text-center">
                  <h3 className="text-base font-semibold text-[#1f2a7c]">{piece.title}</h3>
                  <p className="mt-1 text-sm text-[#1f2a7c]/65">
                    {piece.artist}
                    <span className="text-[#1f2a7c]/40"> · </span>
                    {piece.dimensions}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center">
          <Link
            href={artContactHref}
            className="inline-flex items-center justify-center rounded-full bg-[#1f2a7c] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Je suis intéressé(e)
          </Link>
        </div>
      </ArtBlock>

      <ArtBlock>
        <SectionTitle title="Les avantages visuels" id="art-visual-benefits-title" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {ART_VISUAL_BENEFITS.map((item, i) => {
            const Icon = visualIcons[i] ?? Building2;
            return (
              <li
                key={item.title}
                className="rounded-2xl border border-[#1f2a7c]/10 bg-white px-5 py-6 text-center shadow-sm"
              >
                <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-[#1f2a7c]/8">
                  <Icon className="size-5 text-[#1f2a7c]" aria-hidden />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold text-[#1f2a7c]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1f2a7c]/65">{item.description}</p>
              </li>
            );
          })}
        </ul>
      </ArtBlock>

      <ArtBlock>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionTitle title="Un accompagnement complet" id="art-accompaniment-title" />
            <ol className="mt-8 space-y-5">
              {ART_ACCOMPANIMENT_STEPS.map((step, i) => {
                const Icon = stepIcons[i] ?? Frame;
                return (
                  <li key={step.title} className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1f2a7c]/8">
                      <Icon className="size-4.5 text-[#1f2a7c]" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#1f2a7c]">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#1f2a7c]/70">{step.description}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#1f2a7c]/10 shadow-md lg:aspect-square">
            <ArtRemoteImage
              src={ART_INVESTMENT_IMAGES.accompagnement}
              alt="Bureau professionnel décoré avec une œuvre d'art"
            />
          </div>
        </div>
      </ArtBlock>

      <ArtBlock>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-2xl border border-[#1f2a7c]/10 shadow-md lg:order-1 lg:aspect-[5/4]">
            <ArtRemoteImage
              src={ART_INVESTMENT_IMAGES.fiscalite}
              alt="Espace de réunion avec une grande œuvre d'art murale"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionTitle title="Les avantages sur la fiscalité" id="art-tax-benefits-title" />
            <ul className="mt-8 space-y-4">
              {ART_TAX_BENEFITS.map((item, i) => {
                const Icon = taxIcons[i] ?? TrendingDown;
                return (
                  <li
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-[#1f2a7c]/10 bg-[#fafbfc] px-5 py-4"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1f2a7c]/8">
                      <Icon className="size-4.5 text-[#1f2a7c]" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#1f2a7c]">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#1f2a7c]/70">{item.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-[#1f2a7c]/55">
              * Sous conditions légales et avec validation de votre expert-comptable. Le cabinet ne garantit pas une
              déductibilité systématique.
            </p>
          </div>
        </div>
      </ArtBlock>
    </>
  );
}
