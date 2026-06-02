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
import type { MutuelleSubmitInput } from "@/lib/mutuelle/schema";

export function profileTypeLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return PROFILE_TYPE_LABELS[value as keyof typeof PROFILE_TYPE_LABELS] ?? value;
}

export function formatMutuelleLeadSummary(data: {
  profileType?: string | null;
  professionalStatus?: string | null;
  coverageLevel?: string | null;
  monthlyBudgetRange?: string | null;
  desiredChangeDate?: string | null;
  hasCurrentMutuelle?: boolean | null;
  healthPriorities?: string[] | null;
  childrenCount?: number | null;
  tnsActivityType?: string | null;
  madelinInterest?: string | null;
}): string {
  const lines = [
    data.profileType ? `Profil : ${profileTypeLabel(data.profileType)}` : null,
    data.professionalStatus
      ? `Statut : ${PROFESSIONAL_STATUS_LABELS[data.professionalStatus as MutuelleSubmitInput["professionalStatus"]] ?? data.professionalStatus}`
      : null,
    data.coverageLevel
      ? `Couverture : ${COVERAGE_LEVEL_LABELS[data.coverageLevel as MutuelleSubmitInput["coverageLevel"]] ?? data.coverageLevel}`
      : null,
    data.monthlyBudgetRange
      ? `Budget : ${MONTHLY_BUDGET_LABELS[data.monthlyBudgetRange as MutuelleSubmitInput["monthlyBudgetRange"]] ?? data.monthlyBudgetRange}`
      : null,
    data.desiredChangeDate
      ? `Échéance : ${DESIRED_CHANGE_DATE_LABELS[data.desiredChangeDate as MutuelleSubmitInput["desiredChangeDate"]] ?? data.desiredChangeDate}`
      : null,
    data.hasCurrentMutuelle != null
      ? `Mutuelle actuelle : ${data.hasCurrentMutuelle ? "Oui" : "Non"}`
      : null,
    data.healthPriorities?.length
      ? `Priorités : ${data.healthPriorities.map((p) => HEALTH_PRIORITY_LABELS[p as keyof typeof HEALTH_PRIORITY_LABELS] ?? p).join(", ")}`
      : null,
    data.childrenCount != null && data.childrenCount > 0 ? `Enfants : ${data.childrenCount}` : null,
    data.tnsActivityType
      ? `Activité TNS : ${TNS_ACTIVITY_LABELS[data.tnsActivityType as keyof typeof TNS_ACTIVITY_LABELS] ?? data.tnsActivityType}`
      : null,
    data.madelinInterest
      ? `Madelin : ${MADELIN_LABELS[data.madelinInterest as keyof typeof MADELIN_LABELS] ?? data.madelinInterest}`
      : null,
  ].filter(Boolean);
  return lines.join(" · ") || "—";
}
