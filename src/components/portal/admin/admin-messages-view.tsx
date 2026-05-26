"use client";

import * as React from "react";
import {
  AdminBtn,
  AdminDataTable,
  AdminModal,
  AdminPageHeader,
  AdminPanel,
  AdminSearchInput,
  AdminToolbar,
  adminFieldClass,
} from "@/components/portal/admin/admin-ui";
import { usePortal } from "@/components/portal/portal-provider";
import type { PortalClient } from "@/components/portal/types";

export function AdminMessagesView() {
  const { clients, messages, sendMessage, setSelectedClientId } = usePortal();
  const [search, setSearch] = React.useState("");
  const [activeClient, setActiveClient] = React.useState<PortalClient | null>(null);
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [clients, search]);

  const thread = activeClient
    ? messages.filter((m) => m.clientId === activeClient.id).sort((a, b) => a.at.localeCompare(b.at))
    : [];

  const lastByClient = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const m of messages) {
      map.set(m.clientId, m.text);
    }
    return map;
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !activeClient) return;
    setSending(true);
    try {
      await sendMessage(draft.trim());
      setDraft("");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <AdminPageHeader title="Messages" description="Cliquez sur un client pour ouvrir la conversation" />

      <AdminToolbar>
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Filtrer les clients…" />
      </AdminToolbar>

      <AdminPanel>
        <AdminDataTable
          data={filtered}
          getRowKey={(c) => c.id}
          onRowClick={(c) => {
            setSelectedClientId(c.id);
            setActiveClient(c);
          }}
          emptyMessage="Aucun client."
          columns={[
            { key: "company", header: "Client", cell: (c) => <span className="font-medium">{c.companyName}</span> },
            { key: "contact", header: "Contact", cell: (c) => c.contactName },
            {
              key: "last",
              header: "Dernier message",
              cell: (c) => (
                <span className="line-clamp-1 max-w-[280px] text-xs text-neutral-500">
                  {lastByClient.get(c.id) ?? "—"}
                </span>
              ),
            },
            {
              key: "count",
              header: "Msgs",
              className: "text-right",
              cell: (c) => messages.filter((m) => m.clientId === c.id).length,
            },
          ]}
        />
      </AdminPanel>

      <AdminModal
        open={!!activeClient}
        onClose={() => setActiveClient(null)}
        title={activeClient?.companyName ?? "Messages"}
        subtitle={activeClient?.email}
        size="lg"
        footer={
          <form onSubmit={(e) => void handleSend(e)} className="flex w-full gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Votre message…"
              className={adminFieldClass}
            />
            <AdminBtn type="submit" variant="primary" disabled={sending || !draft.trim()}>
              {sending ? "…" : "Envoyer"}
            </AdminBtn>
          </form>
        }
      >
        <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
          {thread.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">Aucun message.</p>
          ) : (
            thread.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[88%] rounded-xl px-3 py-2 text-sm ${
                  msg.from === "team" ? "ml-auto bg-[#1f2a7c] text-white" : "bg-neutral-100 text-neutral-900"
                }`}
              >
                <p>{msg.text}</p>
                <p className={`mt-0.5 text-[10px] ${msg.from === "team" ? "text-white/70" : "text-neutral-500"}`}>
                  {msg.at}
                </p>
              </div>
            ))
          )}
        </div>
      </AdminModal>
    </>
  );
}
