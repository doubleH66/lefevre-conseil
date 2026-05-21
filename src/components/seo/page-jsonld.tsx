import { CABINET_CONTACT, SITE_URL } from "@/lib/content/site";

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type ServiceJsonLdProps = {
  name: string;
  description: string;
  path: string;
  category: string;
};

export function ServiceJsonLd({ name, description, path, category }: ServiceJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: category,
    url: `${SITE_URL}${path}`,
    provider: { "@id": `${SITE_URL}/#cabinet` },
    areaServed: [
      { "@type": "Country", name: "France" },
      { "@type": "City", name: CABINET_CONTACT.address.city },
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Particuliers et chefs d'entreprise",
    },
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ContactPageJsonLd({ path }: { path: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${SITE_URL}${path}`,
    mainEntity: { "@id": `${SITE_URL}/#cabinet` },
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  path,
  datePublished,
  imageUrl,
  category,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  imageUrl?: string;
  category: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    datePublished,
    author: { "@id": `${SITE_URL}/#cabinet` },
    publisher: { "@id": `${SITE_URL}/#cabinet` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    ...(imageUrl && { image: imageUrl }),
    articleSection: category,
    inLanguage: "fr-FR",
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQPageJsonLd({ items }: { items: readonly { q: string; a: string }[] }) {
  if (items.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
