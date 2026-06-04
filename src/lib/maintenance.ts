/**
 * Écran de maintenance global.
 *
 * Activé par défaut. Pour le désactiver (mise en ligne), définir
 * `NEXT_PUBLIC_MAINTENANCE=0`. Le code d'accès permet de contourner l'écran
 * (persisté dans le navigateur).
 */
export const MAINTENANCE_ENABLED = process.env.NEXT_PUBLIC_MAINTENANCE !== "0";

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
