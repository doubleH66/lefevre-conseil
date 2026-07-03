"use client";

import * as React from "react";
import { Copy, Loader2, Sparkles, Wand2 } from "lucide-react";
import { AdminBtn } from "@/components/portal/admin/admin-ui";
import { cn } from "@/lib/utils";

type AiTab = "brief" | "blog";

type AdminDashboardAiPanelProps = {
  stats: Record<string, number | string>;
  weeklyActions: { id: string; label: string; category: string }[];
};

export function AdminDashboardAiPanel({ stats, weeklyActions }: AdminDashboardAiPanelProps) {
  const [tab, setTab] = React.useState<AiTab>("brief");
  const [blogTopic, setBlogTopic] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [reply, setReply] = React.useState("");
  const [source, setSource] = React.useState<"openai" | "fallback" | null>(null);

  const runAssistant = async (task: AiTab, topic?: string) => {
    setLoading(true);
    setReply("");
    setSource(null);
    try {
      const res = await fetch("/api/portal-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "admin",
          task,
          blogTopic: topic,
          stats,
          weeklyActions,
        }),
      });
      const data = (await res.json()) as { reply?: string; source?: "openai" | "fallback" };
      setReply(data.reply ?? "Aucune réponse.");
      setSource(data.source ?? "fallback");
    } catch {
      setReply("Impossible de joindre l’assistant pour le moment.");
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  };

  const copyReply = async () => {
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(reply);
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[#1f2a7c]/20 bg-gradient-to-br from-[#1f2a7c]/[0.06] via-white to-[#eef1fb] shadow-[0_12px_40px_rgba(31,42,124,0.08)]">
      <header className="border-b border-[#1f2a7c]/10 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#1f2a7c] text-white shadow-lg shadow-[#1f2a7c]/25">
              <Sparkles className="size-4" aria-hidden />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Utiliser l’IA</h2>
              <p className="mt-0.5 text-xs text-neutral-600">
                Brief du jour ou brouillon pour la rubrique Conseils
              </p>
            </div>
          </div>
          <div className="flex rounded-xl border border-neutral-200 bg-white p-0.5">
            {(
              [
                { id: "brief" as const, label: "Brief du jour" },
                { id: "blog" as const, label: "Créer un billet" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  tab === item.id
                    ? "bg-[#1f2a7c] text-white"
                    : "text-neutral-600 hover:bg-neutral-50",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        {tab === "brief" ? (
          <div className="rounded-xl border border-white/80 bg-white/90 p-4">
            <p className="text-sm text-neutral-700">
              Synthèse des priorités à partir de vos indicateurs et des actions en cours (documents, demandes,
              relances).
            </p>
            <AdminBtn
              variant="primary"
              className="mt-3"
              disabled={loading}
              onClick={() => void runAssistant("brief")}
            >
              {loading ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Wand2 className="size-3.5" aria-hidden />}
              Générer le brief
            </AdminBtn>
          </div>
        ) : (
          <div className="rounded-xl border border-white/80 bg-white/90 p-4">
            <label htmlFor="blog-topic" className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Sujet du billet Conseils
            </label>
            <input
              id="blog-topic"
              value={blogTopic}
              onChange={(e) => setBlogTopic(e.target.value)}
              placeholder="Ex. : comment anticiper sa retraite en tant que dirigeant"
              className="mt-2 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-[#1f2a7c]/40 focus:ring-2 focus:ring-[#1f2a7c]/12"
            />
            <AdminBtn
              variant="primary"
              className="mt-3"
              disabled={loading || !blogTopic.trim()}
              onClick={() => void runAssistant("blog", blogTopic.trim())}
            >
              {loading ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Sparkles className="size-3.5" aria-hidden />}
              Créer un brouillon
            </AdminBtn>
          </div>
        )}

        {reply ? (
          <div className="rounded-xl border border-[#1f2a7c]/15 bg-white p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                {source === "openai" ? "Réponse IA" : "Mode hors ligne"}
              </span>
              <button
                type="button"
                onClick={() => void copyReply()}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#1f2a7c] hover:bg-[#1f2a7c]/5"
              >
                <Copy className="size-3" aria-hidden />
                Copier
              </button>
            </div>
            <div className="max-h-56 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
              {reply}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
