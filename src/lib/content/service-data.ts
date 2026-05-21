import type { ServiceSlug } from "@/lib/content/services";
import { SERVICE_CATALOG, getServiceBySlug } from "@/lib/content/services";
import { getServicePremiumContent } from "@/lib/content/services-premium";

export type ServiceFaqItem = { q: string; a: string };

export type ServiceContent = {
  slug: ServiceSlug;
  category: string;
  title: string;
  tagline: string;
  taglineHighlightAfter?: string;
  intro: string;
  features: { title: string; description: string }[];
  faq: ServiceFaqItem[];
};

export function getServiceContent(slug: ServiceSlug): ServiceContent | null {
  const premium = getServicePremiumContent(slug);
  const catalog = getServiceBySlug(slug);
  if (!premium || !catalog) return null;

  return {
    slug,
    category: catalog.title,
    title: premium.hero.h1,
    tagline: premium.hero.subtitle,
    taglineHighlightAfter: premium.hero.taglineHighlightAfter,
    intro: premium.hero.intro,
    features: premium.solutions.items.map((item) => ({
      title: item.title,
      description: item.description,
    })),
    faq: premium.faq,
  };
}

export function getOtherServices(slug: ServiceSlug, limit = 4) {
  return SERVICE_CATALOG.filter((s) => s.slug !== slug)
    .slice(0, limit)
    .map((s) => ({
      slug: s.slug,
      name: s.title,
      href: `/services/${s.slug}`,
    }));
}
