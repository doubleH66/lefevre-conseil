"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

export function ChangePasswordForm({ email }: { email: string }) {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ type: "err", text: "Le nouveau mot de passe doit contenir au moins 8 caractères." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "err", text: "Les deux mots de passe ne correspondent pas." });
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (verifyError) {
        setMessage({ type: "err", text: "Mot de passe actuel incorrect." });
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage({ type: "ok", text: "Mot de passe mis à jour." });
    } catch {
      setMessage({ type: "err", text: "Impossible de modifier le mot de passe. Réessayez plus tard." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="mt-4 grid gap-3 text-sm">
      <label className="block text-neutral-700">
        Mot de passe actuel
        <input
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
        />
      </label>
      <label className="block text-neutral-700">
        Nouveau mot de passe
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
        />
      </label>
      <label className="block text-neutral-700">
        Confirmer le nouveau mot de passe
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="mt-1 w-fit rounded-xl bg-[#1f2a7c] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Mise à jour…" : "Changer le mot de passe"}
      </button>
      {message ? (
        <p className={message.type === "ok" ? "text-emerald-700" : "text-rose-700"}>{message.text}</p>
      ) : null}
    </form>
  );
}
