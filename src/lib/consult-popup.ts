export const CONSULT_POPUP_OPEN_EVENT = "lefevre:consult-open";

/** Ouvre le tiroir / pop-up « Prendre rendez-vous » (FAB flottant). */
export function openConsultPopup() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CONSULT_POPUP_OPEN_EVENT));
}
