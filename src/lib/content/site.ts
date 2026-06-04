export const SITE_URL = "https://lefevre-conseil.fr";
export const SITE_NAME = "Lefèvre Conseil";

export const SITE_LOGO_URL =
  "https://cdn.helloklik.com/uploads/1777451639858-Capture_d_e_cran_2026-04-29_a__10.33.44-removebg-preview.png";

export const AURENIS_LOGO_URL =
  "https://www.dasbatiment.fr/assets/logo-aurenis-Dj4kg5Th.webp";

export const CABINET_PORTRAIT_IMAGE_URL =
  "https://qhiyxnbcegbxtvydcjhf.supabase.co/storage/v1/object/public/public-media/1a8c4232-58af-4b1b-9330-6055134a8829/1778837024290-c4ta4h-Philippe-le-fevre-qui-sommes-nous.webp";

export const CABINET_PORTRAIT_OBJECT_POSITION = "50% 20%";

export const ADVISOR_ROUND_AVATAR_IMAGE_URL =
  "https://qhiyxnbcegbxtvydcjhf.supabase.co/storage/v1/object/public/public-media/1a8c4232-58af-4b1b-9330-6055134a8829/1778842323653-oaodev-Philippe-le-fevre-photo-d-eprofil.webp";

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
