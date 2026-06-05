/** Lissage scroll partagé — fluide sans à-coups. */
export const SCROLL_SPRING = {
  stiffness: 110,
  damping: 28,
  mass: 0.5,
  restDelta: 0.001,
} as const;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function mix(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

export function smoothstep(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

export const SCROLL_RANGES = {
  promo: 52,
  navDock: 88,
} as const;

export function scrollProgress(y: number, range: number) {
  return smoothstep(clamp(y / range, 0, 1));
}
