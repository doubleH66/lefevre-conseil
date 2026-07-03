"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";

const HELLOKLIK_APP_URL = "https://app.helloklik.com";

export function AdminDashboardAiPanel() {
  return (
    <section className="rounded-xl border border-[#1f2a7c]/20 bg-[#1f2a7c]/[0.03] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1f2a7c] text-white">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-neutral-900">Utiliser l’IA</h2>
          <p className="mt-1 text-sm leading-relaxed text-neutral-600">
            Blog, posts LinkedIn et contenus du cabinet sont gérés directement depuis HelloKlik.
            Connexion à votre espace : <span className="font-medium text-[#1f2a7c]">app.helloklik.com</span>
          </p>
          <a
            href={HELLOKLIK_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#1f2a7c] px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#182266]"
          >
            Se connecter à HelloKlik
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
