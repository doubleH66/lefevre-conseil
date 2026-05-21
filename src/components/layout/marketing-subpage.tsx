import { SubpageShell, type SubpageBreadcrumb } from "@/components/layout/subpage-shell";
import type { PageHeroConfig } from "@/lib/content/page-heroes";
import { SUBPAGE_DEFISCAL_HERO_MIN_CLASS } from "@/lib/content/page-heroes";

type MarketingSubpageProps = {
  breadcrumbs: readonly SubpageBreadcrumb[];
  hero: PageHeroConfig;
  children: React.ReactNode;
  hideBilanCta?: boolean;
};

/**
 * Gabarit pages intérieures : bandeau photo défiscalisation (titre + accroche animée + fil d’Ariane).
 */
export function MarketingSubpage({ breadcrumbs, hero, children, hideBilanCta }: MarketingSubpageProps) {
  return (
    <SubpageShell
      heroMinHeightClass={SUBPAGE_DEFISCAL_HERO_MIN_CLASS}
      hideBilanCta={hideBilanCta}
      heroLead={{
        title: hero.title,
        tagline: hero.tagline,
        titleId: hero.titleId,
        taglineHighlightAfter: hero.taglineHighlightAfter,
      }}
      breadcrumbs={breadcrumbs}
    >
      <div data-nav-theme="light" className="relative z-0 flex flex-1 flex-col">
        {children}
      </div>
    </SubpageShell>
  );
}
