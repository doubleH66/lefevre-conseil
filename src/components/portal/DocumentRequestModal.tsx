"use client";

import * as React from "react";
import type { Priority } from "@/components/portal/types";
import { zLayerClass } from "@/lib/z-layers";
import { cn } from "@/lib/utils";

export function DocumentRequestModal({
  open,
  onClose,
  onSubmit,
  clients,
  projects,
  defaultClientId,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    clientId: string;
    projectId: string;
    name: string;
    description: string;
    dueDate: string;
    priority: Priority;
    message: string;
  }) => void | Promise<void>;
  clients: { id: string; companyName: string }[];
  projects: { id: string; name: string; clientId: string }[];
  defaultClientId?: string;
}) {
  const [clientId, setClientId] = React.useState(defaultClientId ?? clients[0]?.id ?? "");
  const [projectId, setProjectId] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [priority, setPriority] = React.useState<Priority>("Normal");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const cid = defaultClientId ?? clients[0]?.id ?? "";
    setClientId(cid);
    setError(null);
  }, [open, defaultClientId, clients]);

  React.useEffect(() => {
    const first = projects.find((p) => p.clientId === clientId);
    setProjectId(first?.id ?? "");
  }, [clientId, projects]);

  if (!open) return null;

  const filteredProjects = projects.filter((p) => p.clientId === clientId);

  const handleSubmit = () => {
    if (!clientId) {
      setError("Sélectionnez un client.");
      return;
    }
    if (!name.trim()) {
      setError("Indiquez le nom de la pièce demandée.");
      return;
    }
    setError(null);
    void Promise.resolve(
      onSubmit({
        clientId,
        projectId,
        name: name.trim(),
        description: description.trim(),
        dueDate,
        priority,
        message: message.trim(),
      }),
    )
      .then(() => {
        setName("");
        setDescription("");
        setDueDate("");
        setMessage("");
        onClose();
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Impossible d'enregistrer la demande.");
      });
  };

  return (
    <div className={cn("fixed inset-0 grid place-items-center bg-black/40 px-4", zLayerClass.modal)}>
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
        role="dialog"
        aria-labelledby="doc-request-title"
      >
        <h3 id="doc-request-title" className="text-lg font-semibold text-neutral-900">
          Demander une pièce justificative
        </h3>
        <p className="mt-1 text-sm text-neutral-600">
          Le client la verra dans son espace et pourra la déposer en ligne.
        </p>

        {error ? (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-neutral-700">
            Client *
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
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
            Dossier (optionnel)
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            >
              <option value="">- Aucun dossier -</option>
              {filteredProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-3 block text-sm text-neutral-700">
          Nom de la pièce *
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex. Avis d’imposition 2024, RIB, Kbis…"
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
          />
        </label>
        <label className="mt-3 block text-sm text-neutral-700">
          Instructions pour le client
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            placeholder="Précisions sur le format ou le contenu attendu…"
          />
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-neutral-700">
            Date limite
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            />
          </label>
          <label className="text-sm text-neutral-700">
            Priorité
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
            >
              <option>Normal</option>
              <option>Important</option>
              <option>Urgent</option>
            </select>
          </label>
        </div>
        <label className="mt-3 block text-sm text-neutral-700">
          Message (visible par le client)
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
          />
        </label>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-[#1f2a7c] px-4 py-2 text-sm font-semibold text-white"
          >
            Envoyer la demande
          </button>
        </div>
      </div>
    </div>
  );
}
