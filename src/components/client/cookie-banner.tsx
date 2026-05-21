"use client";

import Link from "next/link";
import * as React from "react";
import { zLayerClass } from "@/lib/z-layers";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "lefevre-cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setVisible(window.localStorage.getItem(STORAGE_KEY) === null);
  }, []);

  function saveConsent(value: "accepted" | "refused") {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Gestion des cookies"
      className={cn(
        "fixed bottom-4 right-4 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-neutral-200/90 bg-white/95 p-4 text-neutral-900 shadow-card backdrop-blur",
        zLayerClass.cookie,
      )}
    >
      <p className="text-sm font-semibold">Cookies</p>
      <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
        Nous utilisons les cookies nécessaires au fonctionnement du site. Les autres cookies ne sont
        activés qu’avec votre accord.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => saveConsent("accepted")}
          className="rounded-full bg-[#1f2a7c] px-3.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          Accepter
        </button>
        <button
          type="button"
          onClick={() => saveConsent("refused")}
          className="rounded-full border border-neutral-200 px-3.5 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          Refuser
        </button>
        <Link href="/cookies" className="ml-auto text-xs font-medium text-[#1f2a7c] underline underline-offset-2">
          En savoir plus
        </Link>
      </div>
    </aside>
  );
}
