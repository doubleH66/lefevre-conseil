"use client";

import * as React from "react";
import {
  ChoiceCard,
  fieldClass,
  MutuelleConfirmation,
  ProgressBar,
  SimulatorShell,
  StepNav,
} from "@/components/mutuelle/simulator-ui";
import {
  COVERAGE_LEVEL_LABELS,
  DESIRED_CHANGE_DATE_LABELS,
  HEALTH_PRIORITY_LABELS,
  MADELIN_LABELS,
  MONTHLY_BUDGET_LABELS,
  PROFESSIONAL_STATUS_LABELS,
  PROFILE_TYPE_LABELS,
  TNS_ACTIVITY_LABELS,
} from "@/lib/mutuelle/labels";
import {
  COVERAGE_LEVELS,
  DESIRED_CHANGE_DATES,
  HEALTH_PRIORITIES,
  MADELIN_INTERESTS,
  MONTHLY_BUDGET_RANGES,
  PROFESSIONAL_STATUSES,
  PROFILE_TYPES,
  TNS_ACTIVITY_TYPES,
} from "@/lib/mutuelle/schema";
import { INITIAL_MUTUELLE_FORM, type MutuelleFormState } from "@/lib/mutuelle/types";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 6;

type Props = {
  sourcePage?: string;
};

export function MutuelleSimulator({ sourcePage = "/simulateur-mutuelle" }: Props) {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState<MutuelleFormState>(INITIAL_MUTUELLE_FORM);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const patch = React.useCallback((partial: Partial<MutuelleFormState>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  }, []);

  const togglePriority = (key: (typeof HEALTH_PRIORITIES)[number]) => {
    setForm((prev) => {
      const has = prev.healthPriorities.includes(key);
      return {
        ...prev,
        healthPriorities: has
          ? prev.healthPriorities.filter((p) => p !== key)
          : [...prev.healthPriorities, key],
      };
    });
  };

  async function saveDraft(): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mutuelle/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: form.leadId,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          postalCode: form.postalCode,
          birthDate: form.birthDate,
          profileType: form.profileType,
          sourcePage,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; id?: string; error?: string };
      if (data.id) patch({ leadId: data.id });
      setLoading(false);
      if (!res.ok && !data.ok) {
        setError(data.error ?? "Enregistrement impossible.");
        return false;
      }
      return true;
    } catch {
      setLoading(false);
      setError("Connexion impossible. Vérifiez votre réseau.");
      return false;
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mutuelle/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sourcePage,
          rgpdConsent: form.rgpdConsent,
        }),
      });
      setLoading(false);
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok && data.error) {
        setError(data.error);
        return;
      }
      setDone(true);
    } catch {
      setLoading(false);
      setDone(true);
    }
  }

  function validateStep1(): boolean {
    if (!form.profileType) {
      setError("Choisissez un profil.");
      return false;
    }
    setError(null);
    return true;
  }

  function validateStep2(): boolean {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError("Prénom, nom et e-mail sont requis.");
      return false;
    }
    if (!form.phone.trim() || !/^\d{5}$/.test(form.postalCode.trim()) || !form.birthDate) {
      setError("Téléphone, code postal et date de naissance sont requis.");
      return false;
    }
    setError(null);
    return true;
  }

  function validateStep3(): boolean {
    if (
      form.hasCurrentMutuelle === undefined ||
      !form.desiredChangeDate ||
      !form.professionalStatus
    ) {
      setError("Répondez à toutes les questions.");
      return false;
    }
    setError(null);
    return true;
  }

  function validateStep4(): boolean {
    if (!form.coverageLevel || form.healthPriorities.length === 0 || !form.monthlyBudgetRange) {
      setError("Complétez vos besoins santé et votre budget.");
      return false;
    }
    setError(null);
    return true;
  }

  function validateStep5(): boolean {
    const p = form.profileType;
    if (p === "couple" || (p === "family" && form.spouseHasCoverage !== false)) {
      if (!form.spouseBirthDate) {
        setError("Indiquez la date de naissance du conjoint.");
        return false;
      }
    }
    if (p === "family") {
      const count = form.childrenCount ?? 0;
      if (form.childrenBirthDates.length !== count) {
        setError("Indiquez la date de naissance de chaque enfant.");
        return false;
      }
    }
    if (p === "tns") {
      if (!form.tnsActivityType || !form.madelinInterest) {
        setError("Complétez les informations TNS.");
        return false;
      }
    }
    if (p === "senior" && form.seniorIsRetired === undefined) {
      setError("Indiquez si vous êtes retraité.");
      return false;
    }
    setError(null);
    return true;
  }

  async function goNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2) {
      if (!validateStep2()) return;
      const ok = await saveDraft();
      if (!ok) return;
    }
    if (step === 3 && !validateStep3()) return;
    if (step === 4 && !validateStep4()) return;
    if (step === 5 && !validateStep5()) return;
    if (step === 6) {
      if (!form.rgpdConsent) {
        setError("Veuillez accepter le consentement pour transmettre votre demande.");
        return;
      }
      await handleSubmit();
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  if (done) {
    return (
      <SimulatorShell>
        <MutuelleConfirmation />
      </SimulatorShell>
    );
  }

  return (
    <SimulatorShell>
      <ProgressBar step={step} total={TOTAL_STEPS} />

      <div className="mt-8 space-y-6">
        {step === 1 ? <StepProfile form={form} patch={patch} /> : null}
        {step === 2 ? <StepContact form={form} patch={patch} /> : null}
        {step === 3 ? <StepSituation form={form} patch={patch} /> : null}
        {step === 4 ? <StepHealth form={form} patch={patch} togglePriority={togglePriority} /> : null}
        {step === 5 ? <StepFamily form={form} patch={patch} /> : null}
        {step === 6 ? <StepSummary form={form} patch={patch} /> : null}

        {/* Honeypot anti-spam */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          aria-hidden
          onChange={() => {}}
        />

        {error ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <StepNav
          onBack={step > 1 ? () => setStep((s) => s - 1) : undefined}
          onNext={() => void goNext()}
          nextLabel={step === 6 ? "Recevoir ma proposition" : "Continuer"}
          loading={loading}
        />

        {step === 6 ? (
          <p className="text-center text-xs text-neutral-500">
            Les informations transmises servent uniquement à l&apos;étude de votre demande. Aucun contrat
            n&apos;est souscrit automatiquement.
          </p>
        ) : null}
      </div>
    </SimulatorShell>
  );
}

function StepProfile({
  form,
  patch,
}: {
  form: MutuelleFormState;
  patch: (p: Partial<MutuelleFormState>) => void;
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-neutral-900">Pour qui souhaitez-vous une mutuelle ?</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {PROFILE_TYPES.map((type) => (
          <ChoiceCard
            key={type}
            selected={form.profileType === type}
            onClick={() => patch({ profileType: type })}
            title={PROFILE_TYPE_LABELS[type]}
          />
        ))}
      </div>
    </section>
  );
}

function StepContact({
  form,
  patch,
}: {
  form: MutuelleFormState;
  patch: (p: Partial<MutuelleFormState>) => void;
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-neutral-900">Vos informations</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-neutral-800">
          Prénom *
          <input
            value={form.firstName}
            onChange={(e) => patch({ firstName: e.target.value })}
            required
            className={cn(fieldClass, "mt-1.5")}
          />
        </label>
        <label className="block text-sm font-medium text-neutral-800">
          Nom *
          <input
            value={form.lastName}
            onChange={(e) => patch({ lastName: e.target.value })}
            required
            className={cn(fieldClass, "mt-1.5")}
          />
        </label>
        <label className="block text-sm font-medium text-neutral-800 sm:col-span-2">
          E-mail *
          <input
            type="email"
            value={form.email}
            onChange={(e) => patch({ email: e.target.value })}
            required
            className={cn(fieldClass, "mt-1.5")}
          />
        </label>
        <label className="block text-sm font-medium text-neutral-800">
          Téléphone *
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => patch({ phone: e.target.value })}
            required
            className={cn(fieldClass, "mt-1.5")}
          />
        </label>
        <label className="block text-sm font-medium text-neutral-800">
          Code postal *
          <input
            inputMode="numeric"
            maxLength={5}
            value={form.postalCode}
            onChange={(e) => patch({ postalCode: e.target.value.replace(/\D/g, "").slice(0, 5) })}
            required
            className={cn(fieldClass, "mt-1.5")}
          />
        </label>
        <label className="block text-sm font-medium text-neutral-800 sm:col-span-2">
          Date de naissance *
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => patch({ birthDate: e.target.value })}
            required
            className={cn(fieldClass, "mt-1.5")}
          />
        </label>
      </div>
    </section>
  );
}

function StepSituation({
  form,
  patch,
}: {
  form: MutuelleFormState;
  patch: (p: Partial<MutuelleFormState>) => void;
}) {
  return (
    <section className="space-y-6">
      <h3 className="text-sm font-semibold text-neutral-900">Votre situation</h3>

      <fieldset>
        <legend className="text-sm font-medium text-neutral-800">Avez-vous déjà une mutuelle ?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { value: true, label: "Oui" },
            { value: false, label: "Non" },
          ].map((opt) => (
            <ChoiceChip
              key={String(opt.value)}
              selected={form.hasCurrentMutuelle === opt.value}
              onClick={() => patch({ hasCurrentMutuelle: opt.value })}
              label={opt.label}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-neutral-800">
          Quand souhaitez-vous changer ou mettre en place votre mutuelle ?
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {DESIRED_CHANGE_DATES.map((d) => (
            <ChoiceChip
              key={d}
              selected={form.desiredChangeDate === d}
              onClick={() => patch({ desiredChangeDate: d })}
              label={DESIRED_CHANGE_DATE_LABELS[d]}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-neutral-800">Votre statut</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PROFESSIONAL_STATUSES.map((s) => (
            <ChoiceChip
              key={s}
              selected={form.professionalStatus === s}
              onClick={() => patch({ professionalStatus: s })}
              label={PROFESSIONAL_STATUS_LABELS[s]}
            />
          ))}
        </div>
      </fieldset>
    </section>
  );
}

function StepHealth({
  form,
  patch,
  togglePriority,
}: {
  form: MutuelleFormState;
  patch: (p: Partial<MutuelleFormState>) => void;
  togglePriority: (k: (typeof HEALTH_PRIORITIES)[number]) => void;
}) {
  return (
    <section className="space-y-6">
      <h3 className="text-sm font-semibold text-neutral-900">Vos besoins santé</h3>

      <fieldset>
        <legend className="text-sm font-medium text-neutral-800">
          Quel niveau de couverture recherchez-vous ?
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {COVERAGE_LEVELS.map((level) => (
            <ChoiceCard
              key={level}
              selected={form.coverageLevel === level}
              onClick={() => patch({ coverageLevel: level })}
              title={COVERAGE_LEVEL_LABELS[level]}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-neutral-800">
          Quelles garanties sont importantes pour vous ?
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {HEALTH_PRIORITIES.map((p) => (
            <ChoiceChip
              key={p}
              selected={form.healthPriorities.includes(p)}
              onClick={() => togglePriority(p)}
              label={HEALTH_PRIORITY_LABELS[p]}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-neutral-800">Budget mensuel souhaité</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {MONTHLY_BUDGET_RANGES.map((b) => (
            <ChoiceChip
              key={b}
              selected={form.monthlyBudgetRange === b}
              onClick={() => patch({ monthlyBudgetRange: b })}
              label={MONTHLY_BUDGET_LABELS[b]}
            />
          ))}
        </div>
      </fieldset>
    </section>
  );
}

function StepFamily({
  form,
  patch,
}: {
  form: MutuelleFormState;
  patch: (p: Partial<MutuelleFormState>) => void;
}) {
  const profile = form.profileType;

  if (!profile) return null;

  if (profile === "solo") {
    return (
      <section>
        <h3 className="text-sm font-semibold text-neutral-900">Personne à assurer</h3>
        <p className="mt-2 text-sm text-neutral-600">
          Vous : {form.firstName} {form.lastName}, né(e) le {formatDateFr(form.birthDate)}.
        </p>
      </section>
    );
  }

  if (profile === "couple") {
    return (
      <section>
        <h3 className="text-sm font-semibold text-neutral-900">Conjoint</h3>
        <label className="mt-4 block text-sm font-medium text-neutral-800">
          Date de naissance du conjoint *
          <input
            type="date"
            value={form.spouseBirthDate ?? ""}
            onChange={(e) => patch({ spouseBirthDate: e.target.value })}
            className={cn(fieldClass, "mt-1.5")}
          />
        </label>
      </section>
    );
  }

  if (profile === "family") {
    const count = form.childrenCount ?? 0;
    return (
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-neutral-900">Famille</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.spouseHasCoverage !== false}
            onChange={(e) => patch({ spouseHasCoverage: e.target.checked })}
            className="accent-[#1f2a7c]"
          />
          Conjoint à assurer
        </label>
        {form.spouseHasCoverage !== false ? (
          <label className="block text-sm font-medium text-neutral-800">
            Date de naissance du conjoint *
            <input
              type="date"
              value={form.spouseBirthDate ?? ""}
              onChange={(e) => patch({ spouseBirthDate: e.target.value })}
              className={cn(fieldClass, "mt-1.5")}
            />
          </label>
        ) : null}
        <label className="block text-sm font-medium text-neutral-800">
          Nombre d&apos;enfants à assurer (max. 8)
          <select
            value={count}
            onChange={(e) => {
              const n = Number(e.target.value);
              patch({
                childrenCount: n,
                childrenBirthDates: Array.from({ length: n }, (_, i) => form.childrenBirthDates[i] ?? ""),
              });
            }}
            className={cn(fieldClass, "mt-1.5")}
          >
            {Array.from({ length: 9 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
        {Array.from({ length: count }, (_, i) => (
          <label key={i} className="block text-sm font-medium text-neutral-800">
            Date de naissance enfant {i + 1} *
            <input
              type="date"
              value={form.childrenBirthDates[i] ?? ""}
              onChange={(e) => {
                const next = [...form.childrenBirthDates];
                next[i] = e.target.value;
                patch({ childrenBirthDates: next });
              }}
              className={cn(fieldClass, "mt-1.5")}
            />
          </label>
        ))}
      </section>
    );
  }

  if (profile === "tns") {
    return (
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-neutral-900">Travailleur indépendant</h3>
        <fieldset>
          <legend className="text-sm font-medium text-neutral-800">Type d&apos;activité</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {TNS_ACTIVITY_TYPES.map((t) => (
              <ChoiceChip
                key={t}
                selected={form.tnsActivityType === t}
                onClick={() => patch({ tnsActivityType: t })}
                label={TNS_ACTIVITY_LABELS[t]}
              />
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium text-neutral-800">
            Souhaitez-vous bénéficier de la Loi Madelin ?
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {MADELIN_INTERESTS.map((m) => (
              <ChoiceChip
                key={m}
                selected={form.madelinInterest === m}
                onClick={() => patch({ madelinInterest: m })}
                label={MADELIN_LABELS[m]}
              />
            ))}
          </div>
        </fieldset>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold text-neutral-900">Profil senior</h3>
      <fieldset>
        <legend className="text-sm font-medium text-neutral-800">Êtes-vous retraité ?</legend>
        <div className="mt-2 flex gap-2">
          <ChoiceChip
            selected={form.seniorIsRetired === true}
            onClick={() => patch({ seniorIsRetired: true })}
            label="Oui"
          />
          <ChoiceChip
            selected={form.seniorIsRetired === false}
            onClick={() => patch({ seniorIsRetired: false })}
            label="Non"
          />
        </div>
      </fieldset>
      <label className="block text-sm font-medium text-neutral-800">
        Besoins prioritaires (facultatif)
        <textarea
          rows={3}
          value={form.seniorPriorityNotes ?? ""}
          onChange={(e) => patch({ seniorPriorityNotes: e.target.value })}
          className={cn(fieldClass, "mt-1.5 resize-y")}
          placeholder="Ex. hospitalisation, optique…"
        />
      </label>
    </section>
  );
}

function StepSummary({
  form,
  patch,
}: {
  form: MutuelleFormState;
  patch: (p: Partial<MutuelleFormState>) => void;
}) {
  const profile = form.profileType ? PROFILE_TYPE_LABELS[form.profileType] : "-";

  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold text-neutral-900">Résumé et validation</h3>
      <dl className="divide-y divide-neutral-100 rounded-xl border border-neutral-100 bg-neutral-50/50 text-sm">
        <SummaryRow label="Profil" value={profile} />
        <SummaryRow
          label="Coordonnées"
          value={`${form.firstName} ${form.lastName} · ${form.email} · ${form.phone}`}
        />
        <SummaryRow label="Code postal" value={form.postalCode} />
        <SummaryRow label="Naissance" value={formatDateFr(form.birthDate)} />
        {form.professionalStatus ? (
          <SummaryRow label="Statut" value={PROFESSIONAL_STATUS_LABELS[form.professionalStatus]} />
        ) : null}
        {form.coverageLevel ? (
          <SummaryRow label="Couverture" value={COVERAGE_LEVEL_LABELS[form.coverageLevel]} />
        ) : null}
        {form.healthPriorities.length > 0 ? (
          <SummaryRow
            label="Priorités"
            value={form.healthPriorities.map((p) => HEALTH_PRIORITY_LABELS[p]).join(", ")}
          />
        ) : null}
        {form.monthlyBudgetRange ? (
          <SummaryRow label="Budget" value={MONTHLY_BUDGET_LABELS[form.monthlyBudgetRange]} />
        ) : null}
      </dl>

      <label className="flex items-start gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={form.rgpdConsent}
          onChange={(e) => patch({ rgpdConsent: e.target.checked })}
          className="mt-1 accent-[#1f2a7c]"
        />
        <span>
          J&apos;accepte que mes informations soient utilisées par Lefèvre Conseil afin d&apos;être recontacté
          dans le cadre de ma demande de proposition mutuelle. Je comprends que cette demande ne constitue pas
          une souscription.
        </span>
      </label>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_1fr]">
      <dt className="font-medium text-neutral-600">{label}</dt>
      <dd className="text-neutral-900">{value}</dd>
    </div>
  );
}

function ChoiceChip({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        selected
          ? "border-[#1f2a7c] bg-[#1f2a7c]/10 text-[#1f2a7c]"
          : "border-neutral-200 bg-white text-neutral-800 hover:border-[#1f2a7c]/30",
      )}
    >
      {label}
    </button>
  );
}

function formatDateFr(iso: string): string {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}
