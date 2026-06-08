"use client";

import { createClient } from "@/lib/supabase/client";
import {
  fieldClass,
  marketingCardClass,
  marketingProseClass,
} from "@/components/marketing/marketing-styles";
import { HeroCtaPrimaryButton } from "@/components/ui/hero-cta";
import { applySignupRequestedRole } from "@/lib/auth/apply-signup-requested-role";
import { resolvePostAuthRedirect } from "@/lib/portal/resolve-post-auth-redirect";
import { cn } from "@/lib/utils";
import * as React from "react";

type AppRoleChoice = "client" | "admin";

const labelClass = "mb-1.5 block text-sm font-medium text-[#1f2a7c]/80";

export function AuthPanel({
  nextPath,
  initialMode = "login",
  embedded = false,
  idSuffix = "",
  onSuccess,
  hideHeader = false,
}: {
  nextPath: string;
  initialMode?: "login" | "register";
  embedded?: boolean;
  idSuffix?: string;
  onSuccess?: () => void;
  /** Tiroir nav : le titre est déjà affiché au-dessus du formulaire. */
  hideHeader?: boolean;
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
      else {
        onSuccess?.();
        const destination = await resolvePostAuthRedirect(supabase, nextPath);
        window.location.assign(destination);
      }
    } catch {
      setErr("Impossible de contacter Supabase (variables d'environnement ou réseau).");
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
    const nextAfter = role === "admin" ? "/espace-admin" : nextPath;
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextAfter)}`,
          data: {
            full_name: email.trim().split("@")[0],
            requested_role: role,
          },
        },
      });
      if (error) setErr(error.message);
      else if (data.session) {
        await applySignupRequestedRole(supabase);
        onSuccess?.();
        const destination = await resolvePostAuthRedirect(supabase, nextAfter);
        window.location.assign(destination);
      } else
        setMsg(
          "Compte créé. Vérifiez votre boîte mail pour confirmer votre adresse avant la première connexion.",
        );
    } catch {
      setErr("Impossible de contacter Supabase (variables d'environnement ou réseau).");
    } finally {
      setLoading(false);
    }
  }

  const isSheet = embedded && hideHeader;
  const rootClass = embedded ? "mx-auto w-full max-w-none" : "mx-auto w-full max-w-md";
  const shellClass = isSheet
    ? "w-full"
    : cn(marketingCardClass, "overflow-hidden", embedded && "border-neutral-200/80 shadow-none");

  const tabsBlock = (
    <div className={cn(!isSheet && "border-b border-neutral-100 px-5 py-4 sm:px-6")}>
          <div
            className="flex flex-col gap-2 rounded-2xl border border-[#1f2a7c]/10 bg-[#1f2a7c]/[0.03] p-1.5 sm:flex-row"
            role="tablist"
            aria-label="Connexion ou inscription"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => setMode("login")}
              className={cn(
                "flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors",
                mode === "login"
                  ? "bg-[#1f2a7c] text-white shadow-sm"
                  : "text-[#1f2a7c]/65 hover:bg-white hover:text-[#1f2a7c]",
              )}
            >
              Connexion
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              onClick={() => setMode("register")}
              className={cn(
                "flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors",
                mode === "register"
                  ? "bg-[#1f2a7c] text-white shadow-sm"
                  : "text-[#1f2a7c]/65 hover:bg-white hover:text-[#1f2a7c]",
              )}
            >
              Inscription
            </button>
          </div>
    </div>
  );

  const formBlock = (
    <div className={cn(isSheet ? "mt-4" : "px-6 py-6 sm:px-8 sm:py-7")}>
          {mode === "login" ? (
            <form onSubmit={submitLogin} className="space-y-4">
              <div>
                <label htmlFor={`auth-email-login${idSuffix}`} className={labelClass}>
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
                  className={fieldClass}
                  placeholder="vous@exemple.com"
                />
              </div>
              <div>
                <label htmlFor={`auth-password-login${idSuffix}`} className={labelClass}>
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
                  className={fieldClass}
                  placeholder="Votre mot de passe"
                />
              </div>
              <HeroCtaPrimaryButton
                type="submit"
                disabled={loading}
                layout="page"
                className="!w-full disabled:opacity-60"
              >
                {loading ? "Connexion…" : "Se connecter"}
              </HeroCtaPrimaryButton>
            </form>
          ) : (
            <form onSubmit={submitRegister} className="space-y-5">
              <div>
                <label htmlFor={`auth-email-register${idSuffix}`} className={labelClass}>
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
                  className={fieldClass}
                  placeholder="vous@exemple.com"
                />
              </div>
              <div>
                <label htmlFor={`auth-password-register${idSuffix}`} className={labelClass}>
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
                  className={fieldClass}
                  placeholder="Minimum 8 caractères"
                />
              </div>

              <fieldset>
                <legend className={labelClass}>Type de compte</legend>
                <p className="mb-3 text-xs leading-relaxed text-[#1f2a7c]/55">
                  Choisissez le profil correspondant à votre usage.
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="Rôle du compte">
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
                    description="Gestion du cabinet et accès étendus."
                    selected={role === "admin"}
                    onSelect={() => setRole("admin")}
                  />
                </div>
              </fieldset>

              <HeroCtaPrimaryButton
                type="submit"
                disabled={loading}
                layout="page"
                className="!w-full disabled:opacity-60"
              >
                {loading ? "Création…" : "Créer mon compte"}
              </HeroCtaPrimaryButton>
            </form>
          )}

          {msg ? (
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm leading-relaxed text-emerald-900">
              {msg}
            </p>
          ) : null}
          {err ? (
            <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
              {err}
            </p>
          ) : null}
    </div>
  );

  return (
    <div className={rootClass}>
      {isSheet ? (
        <>
          {tabsBlock}
          {formBlock}
        </>
      ) : (
        <section className={shellClass}>
          {!hideHeader ? (
            <div className="border-b border-neutral-100 px-6 py-5 sm:px-8 sm:py-6">
              <h2 className="text-balance text-[clamp(1.2rem,2.8vw,1.65rem)] font-normal tracking-[-0.03em] text-[#1f2a7c]">
                Connexion ou inscription
              </h2>
              <p className={cn("mt-2 text-sm leading-relaxed", marketingProseClass)}>
                Accédez à votre espace client ou créez un compte en quelques instants.
              </p>
            </div>
          ) : null}
          {tabsBlock}
          {formBlock}
        </section>
      )}
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
        "relative flex cursor-pointer flex-col rounded-2xl border px-3.5 py-3 transition-colors duration-200",
        selected
          ? "border-[#1f2a7c] bg-[#1f2a7c]/[0.06] ring-1 ring-[#1f2a7c]/20"
          : "border-[#1f2a7c]/10 bg-[#1f2a7c]/[0.02] hover:border-[#1f2a7c]/20 hover:bg-white",
      )}
    >
      <input id={id} type="radio" name="account_role" className="sr-only" checked={selected} onChange={onSelect} />
      <span className="text-sm font-semibold text-[#1f2a7c]">{title}</span>
      <span className="mt-0.5 text-xs leading-snug text-[#1f2a7c]/60">{description}</span>
    </label>
  );
}
