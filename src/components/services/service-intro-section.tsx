import { ServiceExpertiseVisual } from "@/components/services/service-expertise-visual";
import { ServiceRichText } from "@/components/services/service-rich-text";
import type { ServicePremiumContent } from "@/lib/content/service-premium-types";
import { marketingProseClass, marketingTitleClass } from "@/components/marketing/marketing-styles";
import { cn } from "@/lib/utils";

type ServiceIntroSectionProps = {
  content: ServicePremiumContent;
  imageSrc: string;
  imageAlt: string;
};

/** Intro service : texte + visuel expertise (allège les blocs centrés trop denses). */
export function ServiceIntroSection({ content, imageSrc, imageAlt }: ServiceIntroSectionProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-10 xl:gap-12">
      <div className="mx-auto flex min-w-0 max-w-3xl flex-col justify-center text-center lg:mx-0 lg:max-w-none lg:text-left">
        {content.hero.intro ? (
          <ServiceRichText className="text-[15px] leading-relaxed text-neutral-600 sm:text-base">
            {content.hero.intro}
          </ServiceRichText>
        ) : null}
        <h2
          className={cn(
            content.hero.intro ? "mt-8" : "mt-0",
            marketingTitleClass,
            marketingProseClass,
          )}
        >
          <ServiceRichText as="span">{content.whyImportant.title}</ServiceRichText>
        </h2>
        <div
          className={cn(
            "mt-5 space-y-3 text-[15px] leading-relaxed",
            marketingProseClass,
          )}
        >
          {content.whyImportant.paragraphs.map((p) => (
            <ServiceRichText key={p.slice(0, 40)} className="text-[15px] leading-relaxed">
              {p}
            </ServiceRichText>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-col justify-center">
        <ServiceExpertiseVisual src={imageSrc} alt={imageAlt} priority />
      </div>
    </div>
  );
}
