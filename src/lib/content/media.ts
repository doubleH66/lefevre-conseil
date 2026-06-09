/** CDN principal des visuels marketing (portraits hero). */
export const SITE_MEDIA_CDN = "https://cdn.helloklik.com/uploads";

export const HERO_DESKTOP_IMAGE_URL = `${SITE_MEDIA_CDN}/1778596576110-philippe_le_fevre_desktop.webp`;
export const HERO_MOBILE_IMAGE_URL = `${SITE_MEDIA_CDN}/1778596576981-philippe_le_fevre.webp`;
export const SUBPAGE_HEADER_IMAGE_URL = `${SITE_MEDIA_CDN}/1778742468697-Capture_d_e_cran_2026-05-14_a__09.06.37.png`;

/** Préfixe bucket public Supabase (Réglages → Médias publics du site). */
const SUPABASE_PUBLIC_MEDIA =
  "https://gyisrwfapphqqdbpujtb.supabase.co/storage/v1/object/public/public-media/d4660a7b-c5d8-424e-bae8-333215d81e70";

/** Visuels expertises (carrousel accueil, hub /expertises, héros pages service). */
export const EXPERTISE_MEDIA = {
  gestionPatrimoine: `${SUPABASE_PUBLIC_MEDIA}/1780929754709-wmh2vz-gestion-patrimoine-lefevre-conseil-bureau-premium.webp`,
  placementsEpargne: `${SUPABASE_PUBLIC_MEDIA}/1780929757898-qzp4ek-placements-epargne-lefevre-conseil-bureau-financier.webp`,
  retraiteTransmission: `${SUPABASE_PUBLIC_MEDIA}/1780929759016-6xybn7-retraite-transmission-lefevre-conseil-bureau-premium.webp`,
  fiscaliteInvestissement: `${SUPABASE_PUBLIC_MEDIA}/1780929753732-mip2ex-fiscalite-investissement-lefevre-conseil-bureau-premium.webp`,
  prevoyanceSante: `${SUPABASE_PUBLIC_MEDIA}/1780929758517-lmpph9-prevoyance-sante-assurance-pret-lefevre-conseil.webp`,
  investissementArt: `${SUPABASE_PUBLIC_MEDIA}/1780929755187-pzbg9n-investissement-art-lefevre-conseil.webp`,
} as const;

/** Illustrations section « Notre méthode » (accueil). */
export const METHOD_STEP_IMAGES = {
  situation: `${SUPABASE_PUBLIC_MEDIA}/1780929755697-q16rpw-lefevre-conseil-comprendre-votre-situation.webp`,
  objectifs: `${SUPABASE_PUBLIC_MEDIA}/1780929756815-x78rtc-lefevre-conseil-definir-vos-objectifs.webp`,
  strategie: `${SUPABASE_PUBLIC_MEDIA}/1780929756235-v2ra5b-lefevre-conseil-construire-strategie-adaptee.webp`,
  suivi: `${SUPABASE_PUBLIC_MEDIA}/1780929757369-3f9xta-lefevre-conseil-suivre-ajuster-temps.webp`,
} as const;

export type MethodStepImageId = keyof typeof METHOD_STEP_IMAGES;

export const EXPERTISE_CAROUSEL_IMAGES = {
  "gestion-de-patrimoine": EXPERTISE_MEDIA.gestionPatrimoine,
  "placements-epargne": EXPERTISE_MEDIA.placementsEpargne,
  "retraite-transmission": EXPERTISE_MEDIA.retraiteTransmission,
  "fiscalite-investissement": EXPERTISE_MEDIA.fiscaliteInvestissement,
  "prevoyance-sante-assurance-pret": EXPERTISE_MEDIA.prevoyanceSante,
  "investissement-art": EXPERTISE_MEDIA.investissementArt,
} as const;

export const ARTICLE_STOCK_IMAGES = {
  fiscalite: EXPERTISE_MEDIA.fiscaliteInvestissement,
  epargne: EXPERTISE_MEDIA.placementsEpargne,
  prevoyance: EXPERTISE_MEDIA.prevoyanceSante,
  patrimoine: EXPERTISE_MEDIA.gestionPatrimoine,
} as const;
