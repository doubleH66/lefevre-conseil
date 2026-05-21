"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-white px-6 text-center">
      <div className="max-w-sm space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#1f2a7c]/8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="size-8 text-[#1f2a7c]/50"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.83m-5.656-5.657A6 6 0 0118 12a6 6 0 01-.879 3.12M6.758 6.758A6 6 0 006 12a6 6 0 006 6 6 6 0 013.121-.879M12 20h.01"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#1f2a7c]">Pas de connexion</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#1f2a7c]/65">
            Impossible de charger cette page. Vérifiez votre connexion Internet et réessayez.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-[#1f2a7c] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="rounded-full border border-[#1f2a7c]/15 px-6 py-2.5 text-sm font-medium text-[#1f2a7c] transition-colors hover:bg-[#1f2a7c]/5"
          >
            Accueil
          </Link>
        </div>

        <p className="text-xs text-[#1f2a7c]/40">
          04 68 86 36 22 · contact@lefevre-conseil.fr
        </p>
      </div>
    </main>
  );
}
