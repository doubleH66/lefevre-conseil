import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content/site";
import { SERVICE_CATALOG } from "@/lib/content/services";
import { ARTICLES_PUBLISHED, getAllArticleSlugs } from "@/lib/content/articles";
import { ROUTES } from "@/lib/content/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}${ROUTES.expertises}`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    // `/conseils` n'entre dans le sitemap qu'une fois des articles publiés et indexables.
    ...(ARTICLES_PUBLISHED
      ? [
          {
            url: `${SITE_URL}${ROUTES.conseils}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.9,
          },
        ]
      : []),
    { url: `${SITE_URL}${ROUTES.contact}`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}${ROUTES.notreCabinet}`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE_URL}${ROUTES.avis}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}${ROUTES.faq}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}${ROUTES.simulateur}`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}${ROUTES.simulateurMutuelle}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}${ROUTES.comparateur}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}${ROUTES.mentionsLegales}`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}${ROUTES.confidentialite}`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}${ROUTES.conditionsUtilisation}`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}${ROUTES.cookies}`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}${ROUTES.reclamations}`, lastModified: now, changeFrequency: "yearly", priority: 0.25 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = SERVICE_CATALOG.map((s) => ({
    url: `${SITE_URL}/expertises/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const articleRoutes: MetadataRoute.Sitemap = ARTICLES_PUBLISHED
    ? getAllArticleSlugs().map((slug) => ({
        url: `${SITE_URL}/conseils/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    : [];

  return [...staticRoutes, ...serviceRoutes, ...articleRoutes];
}
