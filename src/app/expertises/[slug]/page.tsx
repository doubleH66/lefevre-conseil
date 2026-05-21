import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DefiscalisationServicePage } from "@/components/pages/defiscalisation-service-page";
import { ServiceMarketingPage } from "@/components/services/service-marketing-page";
import {
  BreadcrumbJsonLd,
  FAQPageJsonLd,
  ServiceJsonLd,
} from "@/components/seo/page-jsonld";
import { EXPERTISES_BASE_HREF } from "@/lib/content/routes";
import { SERVICE_CATALOG, getServiceBySlug, isServiceSlug } from "@/lib/content/services";
import { getServicePremiumContent } from "@/lib/content/services-premium";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return SERVICE_CATALOG.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getServicePremiumContent(slug);
  if (!content) return { title: "Service introuvable" };

  const path = `${EXPERTISES_BASE_HREF}/${slug}`;
  const { title, description } = content.meta;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  if (!isServiceSlug(slug)) {
    notFound();
  }

  const content = getServicePremiumContent(slug);
  if (!content) {
    notFound();
  }

  const catalog = getServiceBySlug(slug);
  const path = `${EXPERTISES_BASE_HREF}/${slug}`;

  const jsonLd = (
    <>
      <ServiceJsonLd
        name={content.hero.h1}
        description={content.meta.description}
        path={path}
        category={catalog?.title ?? "Gestion de patrimoine"}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Nos expertises", path: EXPERTISES_BASE_HREF },
          { name: catalog?.title ?? content.hero.h1, path },
        ]}
      />
      <FAQPageJsonLd items={content.faq} />
    </>
  );

  if (slug === "fiscalite-investissement") {
    return (
      <>
        {jsonLd}
        <DefiscalisationServicePage />
      </>
    );
  }

  return (
    <>
      {jsonLd}
      <ServiceMarketingPage content={content} />
    </>
  );
}
