import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lefèvre Conseil - Gestion de patrimoine",
    short_name: "Lefèvre Conseil",
    description:
      "Cabinet indépendant de conseil en gestion de patrimoine à Perpignan. Placements, retraite, transmission, fiscalité patrimoniale et prévoyance.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#1f2a7c",
    categories: ["finance", "business"],
    lang: "fr",
    dir: "ltr",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/pwa-icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/pwa-icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Prendre rendez-vous",
        short_name: "RDV",
        description: "Prendre rendez-vous avec Lefèvre Conseil",
        url: "/contact",
        icons: [{ src: "/pwa-icon-192", sizes: "192x192" }],
      },
      {
        name: "Nos expertises",
        short_name: "Expertises",
        description: "Découvrir les domaines d’accompagnement",
        url: "/expertises",
        icons: [{ src: "/pwa-icon-192", sizes: "192x192" }],
      },
      {
        name: "Nos conseils",
        short_name: "Conseils",
        description: "Lire les derniers articles",
        url: "/conseils",
        icons: [{ src: "/pwa-icon-192", sizes: "192x192" }],
      },
    ],
    screenshots: [
      {
        src: "/opengraph-image",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: "Lefèvre Conseil - Accueil",
      },
    ],
  };
}
