import type { MetadataRoute } from "next";
import { IS_INDEXABLE, SITE_URL } from "@/lib/content/site";

export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE) {
    // Preview / domaine non final : aucune indexation.
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/login",
          "/auth/",
          "/espace-client/",
          "/espace-admin/",
          "/offline",
          "/installation",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
