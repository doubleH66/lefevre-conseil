import { SERVICE_CATALOG, serviceDetailHref } from "@/lib/content/services";
import { SITE_URL, CABINET_CONTACT, SITE_NAME } from "@/lib/content/site";
import { CLIENT_REVIEWS, GOOGLE_RATING } from "@/lib/content/reviews";

/**
 * Schéma principal du cabinet (`FinancialService` — sous-type de `LocalBusiness`).
 *
 * NOTE : aucun `aggregateRating` ni `review` n'est déclaré ici tant que les avis
 * Google réels (note exacte + nombre exact) ne sont pas confirmés. La preuve
 * sociale reste visible sur le site (/avis, témoignages) ; on n'inscrit pas de
 * données d'avis non vérifiées dans le schéma.
 */
export function financialServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${SITE_URL}/#cabinet`,
    name: CABINET_CONTACT.name,
    legalName: "Lefèvre Conseil",
    description:
      "Cabinet indépendant de conseil en gestion de patrimoine à Perpignan : épargne, retraite, défiscalisation, prévoyance, transmission. Accompagnement des particuliers et chefs d'entreprise dans toute la France.",
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    logo: `${SITE_URL}/icon`,
    telephone: CABINET_CONTACT.phoneTel,
    email: CABINET_CONTACT.email,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: CABINET_CONTACT.address.street,
      postalCode: CABINET_CONTACT.address.postalCode,
      addressLocality: CABINET_CONTACT.address.city,
      addressRegion: "Occitanie",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CABINET_CONTACT.geo.lat,
      longitude: CABINET_CONTACT.geo.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    founder: {
      "@type": "Person",
      "@id": `${SITE_URL}/#philippe-lefevre`,
      name: "Philippe Lefèvre",
      jobTitle: "Conseiller en gestion de patrimoine (CGP) indépendant",
      worksFor: { "@id": `${SITE_URL}/#cabinet` },
    },
    sameAs: [
      CABINET_CONTACT.social.facebook,
      CABINET_CONTACT.social.linkedin,
      CABINET_CONTACT.social.instagram,
    ],
    areaServed: [
      { "@type": "Country", name: "France" },
      { "@type": "City", name: "Perpignan" },
      { "@type": "AdministrativeArea", name: "Pyrénées-Orientales" },
      { "@type": "AdministrativeArea", name: "Occitanie" },
    ],
    knowsAbout: [
      "Gestion de patrimoine",
      "Conseil en investissements financiers",
      "Assurance-vie",
      "Préparation à la retraite",
      "Défiscalisation",
      "Prévoyance",
      "Transmission de patrimoine",
      "Assurance de prêt",
      "Investissement dans l'art",
      "Rémunération du dirigeant",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Nos expertises",
      itemListElement: SERVICE_CATALOG.map((s) => ({
        "@type": "Offer",
        url: `${SITE_URL}${serviceDetailHref(s.slug)}`,
        itemOffered: { "@type": "Service", name: s.title },
      })),
    },
  };
}

/**
 * Avis + note agrégée — à inclure UNIQUEMENT sur /avis, où les avis sont
 * réellement visibles. Données réelles issues de la fiche Google (5,0 / 13 avis).
 * Rattaché au cabinet via `@id` (pas de note auto-déclarée sur les autres pages).
 */
export function reviewsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${SITE_URL}/#cabinet`,
    name: CABINET_CONTACT.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: GOOGLE_RATING.value,
      bestRating: 5,
      worstRating: 1,
      reviewCount: GOOGLE_RATING.count,
    },
    review: CLIENT_REVIEWS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5, worstRating: 1 },
      reviewBody: r.quote,
      publisher: { "@type": "Organization", name: "Google" },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "fr-FR",
    publisher: { "@id": `${SITE_URL}/#cabinet` },
  };
}
