/** Masque navbar / promo / bouton flottant pendant le scroll dans #method-sticky. */

export const METHOD_STICKY_ID = "method-sticky";
export const METHOD_STICKY_ATTR = "data-method-sticky-active";

export function getMethodStickyChromeProgress(section: HTMLElement): number {
  const rect = section.getBoundingClientRect();
  const viewport = window.innerHeight;
  const visibleHeight = Math.min(rect.bottom, viewport) - Math.max(rect.top, 0);
  const coverage = Math.max(0, Math.min(1, visibleHeight / viewport));

  const start = 0.58;
  const end = 0.9;

  if (coverage <= start) return 0;
  if (coverage >= end) return 1;

  const linear = (coverage - start) / (end - start);
  return linear * linear * (3 - 2 * linear);
}

export function setMethodStickyChromeProgress(progress: number) {
  const clamped = Math.max(0, Math.min(1, progress));

  document.documentElement.style.setProperty("--method-chrome-hide", clamped.toFixed(4));
  document.documentElement.toggleAttribute(METHOD_STICKY_ATTR, clamped > 0.04);
}

export function resetMethodStickyChrome() {
  setMethodStickyChromeProgress(0);
}
