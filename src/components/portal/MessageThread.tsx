"use client";

import * as React from "react";
import { StatusBadge } from "@/components/portal/StatusBadge";
import type { PortalMessage } from "@/components/portal/types";

export function MessageThread({
  messages,
  onSend,
}: {
  messages: PortalMessage[];
  onSend: (text: string) => void;
}) {
  const [draft, setDraft] = React.useState("");

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-xl p-3 ${
              message.from === "client" ? "ml-6 bg-blue-50 text-blue-900" : "mr-6 bg-neutral-100 text-neutral-800"
            }`}
          >
            <p className="text-sm">{message.text}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs opacity-70">{message.at}</p>
              <StatusBadge status={message.status} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-neutral-200 pt-4">
        <label htmlFor="message-draft" className="text-sm font-medium text-neutral-800">
          Votre message
        </label>
        <textarea
          id="message-draft"
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#1f2a7c]/40"
          placeholder="Écrivez votre question ou votre réponse..."
        />
        <button
          type="button"
          onClick={() => {
            onSend(draft);
            setDraft("");
          }}
          className="mt-3 rounded-xl bg-[#1f2a7c] px-4 py-2 text-sm font-semibold text-white"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}

