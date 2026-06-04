"use client";

import * as React from "react";
import { Lock, Phone, Mail } from "lucide-react";
import {
  MAINTENANCE_BYPASS_CODE,
  MAINTENANCE_BYPASS_KEY,
  normalizeMaintenanceCode,
} from "@/lib/maintenance";
import { CABINET_CONTACT, SITE_LOGO_URL } from "@/lib/content/site";

const STORE_NOOP = () => () => {};

function readStoredBypass(): boolean {
  try {
    return localStorage.getItem(MAINTENANCE_BYPASS_KEY) === "1";
  } catch {
    return false;
  }
}

export function MaintenanceGate() {
  const [unlockedNow, setUnlockedNow] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState(false);

  // Lecture du localStorage via l'API dédiée (pas de setState dans un effet).
  const storedBypass = React.useSyncExternalStore(STORE_NOOP, readStoredBypass, () => false);
  const bypassed = storedBypass || unlockedNow;

  React.useEffect(() => {
    document.documentElement.setAttribute("data-maintenance-active", bypassed ? "0" : "1");
    return () => {
      document.documentElement.removeAttribute("data-maintenance-active");
    };
  }, [bypassed]);

  const unlock = React.useCallback((event: React.FormEvent) => {
    event.preventDefault();
    if (normalizeMaintenanceCode(code) === MAINTENANCE_BYPASS_CODE) {
      try {
        localStorage.setItem(MAINTENANCE_BYPASS_KEY, "1");
      } catch {
        /* stockage indisponible : on débloque pour la session courante */
      }
      document.documentElement.setAttribute("data-mbypass", "1");
      setUnlockedNow(true);
      setError(false);
    } else {
      setError(true);
    }
  }, [code]);

  if (bypassed) return null;

  const { phone, phoneTel, email } = CABINET_CONTACT;

  return (
    <div
      data-maintenance-overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby="maintenance-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-[#0b1031] px-5 py-10 text-white"
      style={{ touchAction: "none" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1f2a7c]/90 via-[#151d52]/95 to-black"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]"
      />

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SITE_LOGO_URL}
          alt="Lefèvre Conseil"
          className="mx-auto h-11 w-auto object-contain brightness-0 invert sm:h-12"
        />

        <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-white/70">
          <Lock className="size-3.5" aria-hidden />
          Maintenance
        </span>

        <h1
          id="maintenance-title"
          className="mt-6 text-balance text-[clamp(1.75rem,5vw,2.75rem)] font-normal leading-[1.08] tracking-[-0.03em]"
        >
          Site en cours de mise à jour
        </h1>
        <p className="mx-auto mt-4 max-w-md text-balance text-[15px] leading-relaxed text-white/70 sm:text-base">
          Notre site fait peau neuve. Le cabinet Lefèvre Conseil reste joignable et
          disponible pour vous accompagner.
        </p>

        <div className="mx-auto mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={`tel:${phoneTel}`}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#1f2a7c] transition-colors hover:bg-white/90 sm:w-auto"
          >
            <Phone className="size-4" aria-hidden />
            {phone}
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            <Mail className="size-4" aria-hidden />
            Nous écrire
          </a>
        </div>

        <form onSubmit={unlock} className="mx-auto mt-10 flex max-w-xs flex-col items-center gap-2">
          <label htmlFor="maintenance-code" className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
            Accès réservé
          </label>
          <div className="flex w-full gap-2">
            <input
              id="maintenance-code"
              type="text"
              inputMode="text"
              autoComplete="off"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Code d’accès"
              aria-invalid={error}
              aria-describedby={error ? "maintenance-code-error" : undefined}
              className="h-11 min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/35 focus:ring-2 focus:ring-white/10"
            />
            <button
              type="submit"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-[#1f2a7c] transition-colors hover:bg-white/90"
            >
              Entrer
            </button>
          </div>
          {error ? (
            <p id="maintenance-code-error" className="text-xs text-rose-300" role="alert">
              Code incorrect.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
