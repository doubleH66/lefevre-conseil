"use client";

import * as React from "react";

export function RequestBox({
  onSubmit,
}: {
  onSubmit: (content: string) => void;
}) {
  const [text, setText] = React.useState("");

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <h3 className="text-base font-semibold text-neutral-900">Exprimez votre besoin</h3>
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mt-3 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#1f2a7c]/40"
        placeholder="Exemple : je veux générer 5 articles de blog sur mon site cette semaine..."
      />
      <button
        type="button"
        onClick={() => {
          onSubmit(text);
          setText("");
        }}
        className="mt-3 rounded-xl bg-[#1f2a7c] px-4 py-2 text-sm font-semibold text-white"
      >
        Envoyer la demande
      </button>
    </div>
  );
}

