export function isAlptisApiEnabled(): boolean {
  return process.env.ALPTIS_API_ENABLED === "true";
}

export function getAlptisConfig():
  | {
      baseUrl: string;
      apiKey: string;
      codeDistributeur: string;
      env: string;
    }
  | null {
  if (!isAlptisApiEnabled()) return null;

  const apiKey = process.env.ALPTIS_API_KEY?.trim();
  const codeDistributeur = process.env.ALPTIS_CODE_DISTRIBUTEUR?.trim();
  const baseUrl =
    process.env.ALPTIS_API_BASE_URL?.trim() || "https://api.recette.alptis.org";

  if (!apiKey || !codeDistributeur) return null;

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    apiKey,
    codeDistributeur,
    env: process.env.ALPTIS_ENV?.trim() || "recette",
  };
}
