"use client";

import * as React from "react";
import type { WeeklyAction } from "@/components/portal/types";

type Props = {
  mode: "admin" | "client";
  weeklyActions: WeeklyAction[];
  stats: Record<string, number>;
};

export function AdminTodayAi({ mode, weeklyActions, stats }: Props) {
  const [text, setText] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<"openai" | "fallback" | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/portal-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, weeklyActions, stats }),
        });
        const data = (await res.json()) as { reply?: string; source?: "openai" | "fallback" };
        if (cancelled) return;
        setText(typeof data.reply === "string" ? data.reply : null);
        setSource(data.source ?? null);
      } catch {
        if (!cancelled) setError("Impossible de joindre l’assistant pour le moment.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, weeklyActions, stats]);

  return (
    <article className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-amber-950">Qu&apos;est-ce qu&apos;on fait aujourd&apos;hui ?</h3>
          <p className="mt-0.5 text-xs text-amber-900/75">
            Synthèse assistée à partir des priorités de la semaine et des indicateurs du tableau de bord.
          </p>
        </div>
        {source ? (
          <span className="shrink-0 rounded-full border border-amber-200/90 bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900/80">
            {source === "openai" ? "IA" : "Hors ligne"}
          </span>
        ) : null}
      </div>
      <div className="mt-3 rounded-xl border border-amber-100/90 bg-white/80 px-3 py-2.5 text-sm leading-relaxed text-neutral-800">
        {loading ? (
          <p className="text-neutral-500">Préparation de la synthèse…</p>
        ) : error ? (
          <p className="text-rose-700">{error}</p>
        ) : (
          <div className="whitespace-pre-wrap text-[13px] text-neutral-800">{text}</div>
        )}
      </div>
      <p className="mt-2 text-[11px] text-amber-900/65">
        Pour activer l’IA OpenAI, définissez <code className="rounded bg-white/80 px-1">OPENAI_API_KEY</code> sur le
        serveur (optionnel : <code className="rounded bg-white/80 px-1">OPENAI_MODEL</code>).
      </p>
    </article>
  );
}
