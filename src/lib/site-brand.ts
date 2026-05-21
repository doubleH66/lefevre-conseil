/** Logo cabinet - même URL que la barre de navigation (favicon, manifest, etc.). */
export const SITE_LOGO_URL =
  "https://cdn.helloklik.com/uploads/1777451639858-Capture_d_e_cran_2026-04-29_a__10.33.44-removebg-preview.png";

/** Logo Aurenis (pied de page, affiché en blanc via filtre CSS). */
export const AURENIS_LOGO_URL =
  "https://www.dasbatiment.fr/assets/logo-aurenis-Dj4kg5Th.webp";

/** Portrait cabinet : intro accueil + section présentation « Qui sommes-nous » (même URL, même cadrage). */
export const CABINET_PORTRAIT_IMAGE_URL =
  "https://qhiyxnbcegbxtvydcjhf.supabase.co/storage/v1/object/public/public-media/1a8c4232-58af-4b1b-9330-6055134a8829/1778837024290-c4ta4h-Philippe-le-fevre-qui-sommes-nous.webp";

/** Point focal pour `object-cover` (évite que le portrait bouge selon la largeur d’écran). */
export const CABINET_PORTRAIT_OBJECT_POSITION = "50% 20%";

/** Photo de profil ronde (avatar) : bouton flottant contact, page Contact, carte « Qui sommes-nous ». */
export const ADVISOR_ROUND_AVATAR_IMAGE_URL =
  "https://qhiyxnbcegbxtvydcjhf.supabase.co/storage/v1/object/public/public-media/1a8c4232-58af-4b1b-9330-6055134a8829/1778842323653-oaodev-Philippe-le-fevre-photo-d-eprofil.webp";

/** Cadrage du portrait rond (visage centré). */
export const ADVISOR_ROUND_AVATAR_OBJECT_POSITION = "50% 45%";

/**
 * Data URL du logo pour `/icon` et `/apple-icon` (runtime Node : `Buffer` fiable sur PNG binaire).
 */
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
