"use client";

import * as React from "react";

export type ProfileDebugEntry = {
  id: string;
  at: string;
  phase: string;
  data?: unknown;
};

const MAX_ENTRIES = 120;

let entries: ProfileDebugEntry[] = [];
const listeners = new Set<() => void>();

/** Actif en dev ou si NEXT_PUBLIC_DEBUG_PORTAL_PROFILE=true (rebuild Vercel requis). */
export function isProfileDebugEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_DEBUG_PORTAL_PROFILE === "true"
  );
}

function notify() {
  listeners.forEach((l) => l());
}

export function profileDebugLog(phase: string, data?: unknown): void {
  if (!isProfileDebugEnabled()) return;
  const entry: ProfileDebugEntry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    at: new Date().toISOString(),
    phase,
    data,
  };
  entries = [...entries, entry].slice(-MAX_ENTRIES);
  // eslint-disable-next-line no-console
  console.log("[profil]", phase, data ?? "");
  notify();
}

export function clearProfileDebugLog(): void {
  if (!isProfileDebugEnabled()) return;
  entries = [];
  notify();
}

export function getProfileDebugEntries(): ProfileDebugEntry[] {
  return entries;
}

export function useProfileDebugEntries(): ProfileDebugEntry[] {
  const [, tick] = React.useState(0);
  React.useEffect(() => {
    const bump = () => tick((n) => n + 1);
    listeners.add(bump);
    return () => {
      listeners.delete(bump);
    };
  }, []);
  return entries;
}

export function profileClientSnapshot(c: {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  updatedAtIso?: string;
}) {
  return {
    id: c.id,
    companyName: c.companyName,
    contactName: c.contactName,
    email: c.email,
    phone: c.phone,
    address: c.address,
    website: c.website,
    updatedAtIso: c.updatedAtIso,
  };
}

function formatData(data: unknown): string {
  if (data === undefined) return "";
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

export function ProfileDebugPanel() {
  const logEntries = useProfileDebugEntries();
  const [open, setOpen] = React.useState(true);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [logEntries.length]);

  if (!isProfileDebugEnabled()) return null;

  return (
    <section
      className="mt-6 rounded-xl border border-amber-300 bg-amber-50/90 text-xs text-neutral-900 shadow-sm"
      aria-label="Debug profil espace client"
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 px-3 py-2">
        <div>
          <p className="font-semibold text-amber-950">Debug profil (écran)</p>
          <p className="text-[11px] text-amber-900/80">
            {process.env.NODE_ENV === "development" ? "mode dev" : "NEXT_PUBLIC_DEBUG_PORTAL_PROFILE"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg border border-amber-300 bg-white px-2 py-1 font-medium hover:bg-amber-100"
          >
            {open ? "Masquer" : "Afficher"}
          </button>
          <button
            type="button"
            onClick={clearProfileDebugLog}
            className="rounded-lg border border-amber-300 bg-white px-2 py-1 font-medium hover:bg-amber-100"
          >
            Effacer
          </button>
        </div>
      </header>
      {open ? (
        <div className="max-h-80 overflow-auto px-3 py-2 font-mono leading-relaxed">
          {logEntries.length === 0 ? (
            <p className="text-neutral-600">Aucun log pour l’instant. Chargez ou enregistrez le profil.</p>
          ) : (
            <ol className="space-y-3">
              {logEntries.map((entry) => (
                <li key={entry.id} className="border-b border-amber-100 pb-2 last:border-0">
                  <p className="text-[10px] text-neutral-500">{entry.at}</p>
                  <p className="font-semibold text-[#1f2a7c]">{entry.phase}</p>
                  {entry.data !== undefined ? (
                    <pre className="mt-1 whitespace-pre-wrap break-all text-[11px] text-neutral-800">
                      {formatData(entry.data)}
                    </pre>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
          <div ref={bottomRef} />
        </div>
      ) : null}
    </section>
  );
}
