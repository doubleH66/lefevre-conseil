/** CDN principal des visuels marketing (fiable en prod). */
export const SITE_MEDIA_CDN = "https://cdn.helloklik.com/uploads";

export const HERO_DESKTOP_IMAGE_URL = `${SITE_MEDIA_CDN}/1778596576110-philippe_le_fevre_desktop.webp`;
export const HERO_MOBILE_IMAGE_URL = `${SITE_MEDIA_CDN}/1778596576981-philippe_le_fevre.webp`;
export const SUBPAGE_HEADER_IMAGE_URL = `${SITE_MEDIA_CDN}/1778742468697-Capture_d_e_cran_2026-05-14_a__09.06.37.png`;

/** Visuels carrousel expertises / bandeaux CTA --- hébergés sur le CDN, pas Supabase Storage. */
export const EXPERTISE_CAROUSEL_IMAGES = {
  "gestion-de-patrimoine": HERO_DESKTOP_IMAGE_URL,
  "placements-epargne": HERO_MOBILE_IMAGE_URL,
  "retraite-transmission": SUBPAGE_HEADER_IMAGE_URL,
  "fiscalite-investissement": HERO_DESKTOP_IMAGE_URL,
  "prevoyance-sante-assurance-pret": SUBPAGE_HEADER_IMAGE_URL,
  "investissement-art": "/images/investissement-art/accompagnement.webp",
} as const;

export const ARTICLE_STOCK_IMAGES = {
  fiscalite: HERO_DESKTOP_IMAGE_URL,
  epargne: HERO_MOBILE_IMAGE_URL,
  prevoyance: SUBPAGE_HEADER_IMAGE_URL,
  patrimoine: "/images/investissement-art/accompagnement.webp",
} as const;
