"use client";

import * as React from "react";
import { zLayerClass } from "@/lib/z-layers";
import { cn } from "@/lib/utils";

export function ProjectFormModal({
  open,
  onClose,
  clients,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  clients: { id: string; companyName: string }[];
  onSubmit: (payload: {
    clientId: string;
    name: string;
    description: string;
    owner: string;
    startDate: string;
    targetDate: string;
    nextStep: string;
    requiredDocs: string;
    internalNotes: string;
  }) => void;
}) {
  const [form, setForm] = React.useState({
    clientId: clients[0]?.id ?? "",
    name: "",
    description: "",
    owner: "",
    startDate: "",
    targetDate: "",
    nextStep: "",
    requiredDocs: "",
    internalNotes: "",
  });

  if (!open) return null;

  return (
    <div className={cn("fixed inset-0 grid place-items-center bg-black/40 px-4", zLayerClass.modal)}>
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
        <h3 className="text-lg font-semibold text-neutral-900">Créer / modifier un projet</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-neutral-700">
            Client
            <select
              value={form.clientId}
              onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-neutral-700">
            Nom du projet
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            />
          </label>
          <label className="sm:col-span-2 text-sm text-neutral-700">
            Description
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            />
          </label>
          <label className="text-sm text-neutral-700">
            Responsable
            <input
              value={form.owner}
              onChange={(e) => setForm((prev) => ({ ...prev, owner: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            />
          </label>
          <label className="text-sm text-neutral-700">
            Prochaine étape
            <input
              value={form.nextStep}
              onChange={(e) => setForm((prev) => ({ ...prev, nextStep: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            />
          </label>
          <label className="text-sm text-neutral-700">
            Date de début
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            />
          </label>
          <label className="text-sm text-neutral-700">
            Date cible
            <input
              type="date"
              value={form.targetDate}
              onChange={(e) => setForm((prev) => ({ ...prev, targetDate: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            />
          </label>
          <label className="sm:col-span-2 text-sm text-neutral-700">
            Documents nécessaires
            <input
              value={form.requiredDocs}
              onChange={(e) => setForm((prev) => ({ ...prev, requiredDocs: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
              placeholder="Logo, brief, accès analytics..."
            />
          </label>
          <label className="sm:col-span-2 text-sm text-neutral-700">
            Notes internes
            <textarea
              rows={2}
              value={form.internalNotes}
              onChange={(e) => setForm((prev) => ({ ...prev, internalNotes: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            />
          </label>
        </div>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700">
            Annuler
          </button>
          <button
            type="button"
            onClick={() => {
              onSubmit(form);
              onClose();
            }}
            className="rounded-xl bg-[#1f2a7c] px-4 py-2 text-sm font-semibold text-white"
          >
            Enregistrer le projet
          </button>
        </div>
      </div>
    </div>
  );
}

