"use client";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import * as React from "react";

type AppRoleChoice = "client" | "admin";

export function AuthPanel({
  nextPath,
  initialMode = "login",
  embedded = false,
  idSuffix = "",
  onSuccess,
}: {
  nextPath: string;
  initialMode?: "login" | "register";
  /** Bandeau / modale : pas de marge page, carte plus légère. */
  embedded?: boolean;
  /** Suffixed field ids (évite doublons si page `/login` + tiroir). */
  idSuffix?: string;
  /** Appelé après connexion réussie (ex. fermer le tiroir avant redirection). */
  onSuccess?: () => void;
}) {
  const [mode, setMode] = React.useState<"login" | "register">(initialMode);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<AppRoleChoice>("client");
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  React.useEffect(() => {
    setMsg(null);
    setErr(null);
  }, [mode]);

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) setErr(error.message);
      else window.location.assign(nextPath);
    } catch {
      setErr("Impossible de contacter Supabase (variables d’environnement ou réseau).");
    } finally {
      setLoading(false);
    }
  }

  async function submitRegister(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (password.length < 8) {
      setErr("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    const nextAfter = role === "admin" ? "/espace-admin" : "/espace-client";
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextAfter)}`,
          data: {
            requested_role: role,
          },
        },
      });
      if (error) setErr(error.message);
      else if (data.session) {
        onSuccess?.();
        window.location.assign(nextAfter);
      }
      else
        setMsg(
          "Compte créé. Vérifiez votre boîte mail pour confirmer votre adresse avant la première connexion.",
        );
    } catch {
      setErr("Impossible de contacter Supabase (variables d’environnement ou réseau).");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-[#1f2a7c]/20 placeholder:text-neutral-400 focus:border-[#1f2a7c]/30 focus:ring-2";

  const rootClass = embedded ? "mx-auto w-full max-w-none" : "mx-auto mt-8 max-w-md";
  const cardClass = embedded
    ? "rounded-xl border border-neutral-200/80 bg-neutral-50/40 shadow-none"
    : "rounded-2xl border border-neutral-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]";

  return (
    <div className={rootClass}>
      <div className={cardClass}>
        <div className="border-b border-neutral-100 p-1.5 sm:p-2">
          <div
            className="flex gap-1 rounded-xl bg-neutral-100/90 p-1"
            role="tablist"
            aria-label="Connexion ou inscription"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={cn(
                "flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/35",
                mode === "login"
                  ? "bg-white text-[#1f2a7c] shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900",
              )}
              onClick={() => setMode("login")}
            >
              Connexion
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              className={cn(
                "flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/35",
                mode === "register"
                  ? "bg-white text-[#1f2a7c] shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900",
              )}
              onClick={() => setMode("register")}
            >
              Inscription
            </button>
          </div>
        </div>

        <div className="px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
          {mode === "login" ? (
            <form onSubmit={submitLogin} className="space-y-4">
              <p className="text-sm leading-relaxed text-neutral-600">
                Connectez-vous avec votre e-mail et votre mot de passe.
              </p>
              <div>
                <label htmlFor={`auth-email-login${idSuffix}`} className="block text-sm font-medium text-neutral-800">
                  E-mail
                </label>
                <input
                  id={`auth-email-login${idSuffix}`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="vous@exemple.com"
                />
              </div>
              <div>
                <label htmlFor={`auth-password-login${idSuffix}`} className="block text-sm font-medium text-neutral-800">
                  Mot de passe
                </label>
                <input
                  id={`auth-password-login${idSuffix}`}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Votre mot de passe"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#1f2a7c] px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              >
                {loading ? "Connexion…" : "Se connecter"}
              </button>
            </form>
          ) : (
            <form onSubmit={submitRegister} className="space-y-5">
              <div>
                <label htmlFor={`auth-email-register${idSuffix}`} className="block text-sm font-medium text-neutral-800">
                  E-mail
                </label>
                <input
                  id={`auth-email-register${idSuffix}`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="vous@exemple.com"
                />
              </div>
              <div>
                <label htmlFor={`auth-password-register${idSuffix}`} className="block text-sm font-medium text-neutral-800">
                  Mot de passe
                </label>
                <input
                  id={`auth-password-register${idSuffix}`}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Minimum 8 caractères"
                />
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-neutral-800">Type de compte</legend>
                <p className="mt-0.5 text-xs text-neutral-500">Sélectionnez le profil correspondant à votre usage.</p>
                <div
                  className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                  role="radiogroup"
                  aria-label="Rôle du compte"
                >
                  <RoleCard
                    id={`role-client${idSuffix}`}
                    title="Client"
                    description="Espace personnel et documents."
                    selected={role === "client"}
                    onSelect={() => setRole("client")}
                  />
                  <RoleCard
                    id={`role-admin${idSuffix}`}
                    title="Administrateur"
                    description="Gestion et accès étendus."
                    selected={role === "admin"}
                    onSelect={() => setRole("admin")}
                  />
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#1f2a7c] px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              >
                {loading ? "Création…" : "Créer mon compte"}
              </button>
            </form>
          )}

          {msg ? <p className="mt-4 text-sm leading-relaxed text-emerald-800">{msg}</p> : null}
          {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  id,
  title,
  description,
  selected,
  onSelect,
}: {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer flex-col rounded-xl border px-3.5 py-3 transition-colors duration-200",
        selected
          ? "border-[#1f2a7c] bg-[#1f2a7c]/[0.06] ring-1 ring-[#1f2a7c]/25"
          : "border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 hover:bg-neutral-50",
      )}
    >
      <input id={id} type="radio" name="account_role" className="sr-only" checked={selected} onChange={onSelect} />
      <span className="text-sm font-semibold text-neutral-900">{title}</span>
      <span className="mt-0.5 text-xs leading-snug text-neutral-600">{description}</span>
    </label>
  );
}
