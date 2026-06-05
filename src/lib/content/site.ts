/**
 * URL canonique du site. Pilotée par `NEXT_PUBLIC_SITE_URL` ; par défaut le
 * domaine final de production. Sur une preview Vercel, définir
 * `NEXT_PUBLIC_SITE_URL=https://<preview>.vercel.app` pour bloquer l'indexation.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lefevre-conseil.fr").replace(/\/+$/, "");

export const SITE_NAME = "Lefèvre Conseil";

/** `true` uniquement en production sur le domaine final — sinon `noindex`. */
export const IS_INDEXABLE =
  !SITE_URL.includes("vercel.app") &&
  process.env.VERCEL_ENV !== "preview" &&
  process.env.NEXT_PUBLIC_NOINDEX !== "1";

import {
  HERO_DESKTOP_IMAGE_URL,
  HERO_MOBILE_IMAGE_URL,
} from "@/lib/content/media";

export const SITE_LOGO_URL =
  "https://cdn.helloklik.com/uploads/1777451639858-Capture_d_e_cran_2026-04-29_a__10.33.44-removebg-preview.png";

export const AURENIS_LOGO_URL = "https://cdn.heyaurenis.com/logo-hey-aurenis.png";

/**
 * Lien direct vers la fiche Google Business Profile du cabinet.
 * TODO: ajouter l'URL officielle Google Business Profile Lefèvre Conseil
 * (format https://g.page/... ou https://maps.app.goo.gl/...). Tant qu'elle est
 * vide, le site retombe sur la recherche d'avis Google existante.
 */
export const GOOGLE_BUSINESS_PROFILE_URL = "";

/**
 * Immatriculation ORIAS — courtier d'assurances (source : mentions légales).
 * Seule donnée réglementaire confirmée ; ne pas ajouter CIF / AMF / ANACOFI sans validation.
 */
export const ORIAS_NUMBER = "25 001 948";

export const CABINET_PORTRAIT_IMAGE_URL = HERO_DESKTOP_IMAGE_URL;

export const CABINET_PORTRAIT_OBJECT_POSITION = "50% 20%";

export const ADVISOR_ROUND_AVATAR_IMAGE_URL = HERO_MOBILE_IMAGE_URL;

export const ADVISOR_ROUND_AVATAR_OBJECT_POSITION = "50% 45%";

export const CABINET_CONTACT = {
  name: SITE_NAME,
  phone: "04 68 86 36 22",
  phoneTel: "+33468863622",
  email: "contact@lefevre-conseil.fr",
  address: {
    street: "27 Avenue Général de Gaulle",
    postalCode: "66000",
    city: "Perpignan",
    country: "France",
  },
  geo: { lat: 42.6973703, lng: 2.8837171 },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61555558500990",
    linkedin: "https://www.linkedin.com/company/lefevre-conseil/",
    instagram: "https://www.instagram.com/lefevre_conseil/",
  },
  openingHours: {
    spec: "Mo-Fr 09:00-18:00",
    label: "Lun. - Ven. · 9h - 18h",
  },
  ratings: {
    google: { value: 5, count: 13, source: "Google" },
    infobel: { value: 5, count: 10, source: "Infobel" },
  },
} as const;

export const CONTACT_SUBJECTS = [
  "Assurance",
  "Audit Patrimonial",
  "Réduction Impôts",
  "Arts",
  "Immobilier",
  "Réclamation",
  "Candidature spontanée",
  "Autres",
] as const;

export function formatAddressLine(): string {
  const { street, postalCode, city } = CABINET_CONTACT.address;
  return `${street}, ${postalCode} ${city}`;
}

export function aggregatedRating() {
  const { google, infobel } = CABINET_CONTACT.ratings;
  const total = google.count + infobel.count;
  const value = (google.value * google.count + infobel.value * infobel.count) / total;
  return { value: Math.round(value * 10) / 10, count: total };
}

/** Data URL du logo pour `/icon` et `/apple-icon`. */
export async function fetchSiteLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(SITE_LOGO_URL, { next: { revalidate: 86_400 } });
    if (!res.ok) return null;
    const rawType = res.headers.get("content-type")?.split(";")[0]?.trim();
    const mime = rawType?.startsWith("image/") ? rawType : "image/png";
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
