import { CABINET_CONTACT, SITE_URL } from "@/lib/content/site";

type BreadcrumbItem = {
  name: string;
  path: string;
};

/** Retire le markdown inline (**, *, __, ^^) pour un texte JSON-LD propre. */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\^\^(.+?)\^\^/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/\*(.+?)\*/g, "$1");
}

export function WebPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  const url = `${SITE_URL}${path}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#cabinet` },
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PersonJsonLd({
  name,
  jobTitle,
  path,
}: {
  name: string;
  jobTitle: string;
  path: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#philippe-lefevre`,
    name,
    jobTitle,
    worksFor: { "@id": `${SITE_URL}/#cabinet` },
    address: {
      "@type": "PostalAddress",
      addressLocality: CABINET_CONTACT.address.city,
      addressCountry: "FR",
    },
    url: `${SITE_URL}${path}`,
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const lastPath = items[items.length - 1]?.path ?? "/";
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${lastPath}#breadcrumb`,
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
  const url = `${SITE_URL}${path}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    serviceType: category,
    url,
    provider: { "@id": `${SITE_URL}/#cabinet` },
    areaServed: [
      { "@type": "City", name: "Perpignan" },
      { "@type": "AdministrativeArea", name: "Pyrénées-Orientales" },
      { "@type": "AdministrativeArea", name: "Occitanie" },
      { "@type": "Country", name: "France" },
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Particuliers, dirigeants et professions libérales",
    },
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ContactPageJsonLd({
  path,
  name = "Prendre rendez-vous avec Lefèvre Conseil à Perpignan",
}: {
  path: string;
  name?: string;
}) {
  const url = `${SITE_URL}${path}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${url}#webpage`,
    url,
    name,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#cabinet` },
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

export function FAQPageJsonLd({
  items,
  path,
}: {
  items: readonly { q: string; a: string }[];
  /** Permet d'attacher un `@id` unique à la FAQ de la page (ex. "/faq"). */
  path?: string;
}) {
  if (items.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(path ? { "@id": `${SITE_URL}${path}#faq` } : {}),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: stripInlineMarkdown(item.q),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripInlineMarkdown(item.a),
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
