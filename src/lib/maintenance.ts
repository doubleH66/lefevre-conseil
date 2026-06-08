/**
 * Écran de maintenance global — actif en production uniquement (pas en local ni preview Vercel).
 *
 * Pour désactiver en prod : `NEXT_PUBLIC_MAINTENANCE=0`.
 * Code d'accès réservé : voir `MAINTENANCE_BYPASS_CODE`.
 */
const isProductionDeploy =
  process.env.VERCEL_ENV === "production" ||
  (process.env.NODE_ENV === "production" && !process.env.VERCEL);

export const MAINTENANCE_ENABLED =
  process.env.NEXT_PUBLIC_MAINTENANCE !== "0" && isProductionDeploy;

/** Code de déverrouillage (insensible à la casse et aux espaces superflus). */
export const MAINTENANCE_BYPASS_CODE = "100 ok";

/** Clé localStorage + attribut HTML utilisés pour mémoriser l'accès. */
export const MAINTENANCE_BYPASS_KEY = "lc-maintenance-bypass";

/** Script inline (head/début body) : masque l'écran avant peinture si déjà débloqué. */
export const MAINTENANCE_PREPAINT_SCRIPT = `try{if(localStorage.getItem('${MAINTENANCE_BYPASS_KEY}')==='1'){document.documentElement.setAttribute('data-mbypass','1')}}catch(e){}`;

/** Normalise une saisie pour la comparer au code. */
export function normalizeMaintenanceCode(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
