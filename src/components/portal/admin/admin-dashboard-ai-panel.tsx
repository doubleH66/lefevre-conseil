"use client";

import * as React from "react";
import { ArrowUpRight, FileText, Linkedin, LogIn, Sparkles, Wand2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const HELLOKLIK_APP_URL = "https://app.helloklik.com";
const HELLOKLIK_SITE_URL = "https://helloklik.com";

const AI_CAPABILITIES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: FileText,
    title: "Articles de blog",
    text: "Rédaction et publication des billets « Conseils » assistées par IA.",
  },
  {
    icon: Linkedin,
    title: "Posts LinkedIn",
    text: "Création et programmation des publications LinkedIn du cabinet.",
  },
  {
    icon: Wand2,
    title: "Contenus & visuels",
    text: "Génération de contenus, visuels et campagnes, centralisée au même endroit.",
  },
];

export function AdminDashboardAiPanel() {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#1f2a7c]/20 bg-gradient-to-br from-[#1f2a7c]/[0.07] via-white to-[#eef1fb] shadow-[0_12px_40px_rgba(31,42,124,0.08)]">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[#1f2a7c]/10 px-4 py-3.5 sm:px-5">
        <div className="flex items-start gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#1f2a7c] text-white shadow-lg shadow-[#1f2a7c]/25">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Utiliser l’IA</h2>
            <p className="mt-0.5 text-xs text-neutral-600">
              Contenus, blog et réseaux sociaux du cabinet
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1f2a7c]/15 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1f2a7c]">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
          Propulsé par HelloKlik
        </span>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        <p className="text-sm leading-relaxed text-neutral-700">
          Toute la partie intelligence artificielle du cabinet est gérée directement depuis{" "}
          <a
            href={HELLOKLIK_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#1f2a7c] underline decoration-[#1f2a7c]/30 underline-offset-2 hover:decoration-[#1f2a7c]"
          >
            helloklik.com
          </a>
          . Articles de blog, posts LinkedIn et contenus sont créés, planifiés et publiés depuis votre espace
          HelloKlik — sans quitter un seul outil.
        </p>

        <ul className="grid gap-2.5 sm:grid-cols-3">
          {AI_CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <li
                key={cap.title}
                className="rounded-xl border border-white/80 bg-white/90 p-3.5 shadow-sm"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#1f2a7c]/[0.08] text-[#1f2a7c]">
                  <Icon className="size-4" aria-hidden strokeWidth={1.85} />
                </span>
                <p className="mt-2.5 text-[13px] font-semibold text-neutral-900">{cap.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-neutral-600">{cap.text}</p>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-3 rounded-xl border border-[#1f2a7c]/15 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-900">Accès à la plateforme</p>
            <p className="mt-0.5 text-xs text-neutral-600">
              Connexion à votre espace :{" "}
              <span className="font-medium text-[#1f2a7c]">app.helloklik.com</span>
            </p>
          </div>
          <a
            href={HELLOKLIK_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#1f2a7c] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#182266]"
          >
            <LogIn className="size-4" aria-hidden />
            Se connecter à HelloKlik
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
