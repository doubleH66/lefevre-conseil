"use client";

import { useSyncExternalStore } from "react";

const LG_MEDIA_QUERY = "(min-width: 1024px)";

function subscribeLg(onChange: () => void) {
  const mq = window.matchMedia(LG_MEDIA_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getLgSnapshot() {
  return window.matchMedia(LG_MEDIA_QUERY).matches;
}

/** `true` à partir du breakpoint `lg` (1024px). SSR : `false`. */
export function useIsLgUp() {
  return useSyncExternalStore(subscribeLg, getLgSnapshot, () => false);
}
