"use client";

import * as React from "react";
import { usePortal } from "@/components/portal/portal-provider";

export function AdminMessagesView() {
  const { clients, messages, selectedClientId, setSelectedClientId, sendMessage } = usePortal();
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const selectedClient = clients.find((c) => c.id === selectedClientId) ?? clients[0] ?? null;
  const thread = selectedClient
    ? messages.filter((m) => m.clientId === selectedClient.id).sort((a, b) => a.at.localeCompare(b.at))
    : [];

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !selectedClient) return;
    setSending(true);
    try {
      await sendMessage(draft.trim());
      setDraft("");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-neutral-900">Messages portail</h1>
        <p className="mt-1 text-sm text-neutral-600">Échanges avec les clients connectés à leur espace.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Clients</p>
          <ul className="space-y-1">
            {clients.map((client) => {
              const count = messages.filter((m) => m.clientId === client.id && m.from === "client").length;
              return (
                <li key={client.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedClientId(client.id)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
                      selectedClient?.id === client.id
                        ? "bg-[#1f2a7c] font-semibold text-white"
                        : "text-neutral-800 hover:bg-white"
                    }`}
                  >
                    {client.companyName}
                    {count > 0 ? <span className="ml-1 text-xs opacity-70">({count})</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <article className="flex min-h-[420px] flex-col rounded-2xl border border-neutral-200 bg-white">
          {selectedClient ? (
            <>
              <div className="border-b border-neutral-100 px-4 py-3">
                <p className="font-semibold text-neutral-900">{selectedClient.companyName}</p>
                <p className="text-xs text-neutral-500">{selectedClient.email}</p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {thread.length === 0 ? (
                  <p className="text-sm text-neutral-500">Aucun message pour ce client.</p>
                ) : (
                  thread.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                        msg.from === "team"
                          ? "ml-auto bg-[#1f2a7c] text-white"
                          : "bg-neutral-100 text-neutral-900"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`mt-1 text-[10px] ${msg.from === "team" ? "text-white/70" : "text-neutral-500"}`}>
                        {msg.at}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={(e) => void handleSend(e)} className="flex gap-2 border-t border-neutral-100 p-4">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Votre message au client…"
                  className="h-11 flex-1 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-[#1f2a7c]/40"
                />
                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  className="rounded-xl bg-[#1f2a7c] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Envoyer
                </button>
              </form>
            </>
          ) : (
            <p className="p-6 text-sm text-neutral-500">Créez ou sélectionnez un client pour envoyer un message.</p>
          )}
        </article>
      </div>
    </section>
  );
}
