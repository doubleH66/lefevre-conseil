import type {
  CoverageLevel,
  DesiredChangeDate,
  HealthPriority,
  MadelinInterest,
  MonthlyBudgetRange,
  ProfessionalStatus,
  ProfileType,
  TnsActivityType,
} from "@/lib/mutuelle/types";

export const PROFILE_TYPE_LABELS: Record<ProfileType, string> = {
  solo: "Moi seul",
  couple: "Moi + mon conjoint",
  family: "Ma famille",
  tns: "Travailleur indépendant / TNS",
  senior: "Senior / retraité",
};

export const PROFESSIONAL_STATUS_LABELS: Record<ProfessionalStatus, string> = {
  salarie: "Salarié",
  independant: "Indépendant / TNS",
  retraite: "Retraité",
  sans_activite: "Sans activité",
  autre: "Autre",
};

export const DESIRED_CHANGE_DATE_LABELS: Record<DesiredChangeDate, string> = {
  asap: "Dès que possible",
  within_month: "Dans le mois",
  within_3_months: "Dans les 3 mois",
  later: "Plus tard",
  unknown: "Je ne sais pas",
};

export const COVERAGE_LEVEL_LABELS: Record<CoverageLevel, string> = {
  economic: "Économique",
  balanced: "Équilibré",
  comfort: "Confort",
  reinforced: "Renforcé",
};

export const HEALTH_PRIORITY_LABELS: Record<HealthPriority, string> = {
  hospitalisation: "Hospitalisation",
  soins_courants: "Soins courants",
  optique: "Optique",
  dentaire: "Dentaire",
  medecines_douces: "Médecines douces",
  auditif: "Auditif",
};

export const MONTHLY_BUDGET_LABELS: Record<MonthlyBudgetRange, string> = {
  under_50: "Moins de 50 €",
  "50_80": "50 à 80 €",
  "80_120": "80 à 120 €",
  "120_180": "120 à 180 €",
  over_180: "Plus de 180 €",
  unknown: "Je ne sais pas",
};

export const TNS_ACTIVITY_LABELS: Record<TnsActivityType, string> = {
  artisan: "Artisan",
  commercant: "Commerçant",
  profession_liberale: "Profession libérale",
  dirigeant: "Dirigeant",
  autre: "Autre",
};

export const MADELIN_LABELS: Record<MadelinInterest, string> = {
  yes: "Oui",
  no: "Non",
  unknown: "Je ne sais pas",
};
