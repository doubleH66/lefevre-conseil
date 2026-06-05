"use client";

import { useEffect } from "react";

/**
 * Enregistre le service worker et expose l'event `beforeinstallprompt`
 * globalement pour que la page d'installation puisse l'intercepter.
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Avoid stale Turbopack chunks in dev (cache-first SW + HMR = broken dynamic imports).
    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => void registration.unregister());
      });
      return;
    }

    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});

    const handler = (e: Event) => {
      e.preventDefault();
      (window as Window & { __pwaInstallPrompt?: Event }).__pwaInstallPrompt = e;
      window.dispatchEvent(new CustomEvent("pwa-installable"));
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return null;
}
