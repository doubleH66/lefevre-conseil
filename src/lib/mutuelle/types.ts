export type ProfileType = "solo" | "couple" | "family" | "tns" | "senior";
export type ProfessionalStatus = "salarie" | "independant" | "retraite" | "sans_activite" | "autre";
export type DesiredChangeDate = "asap" | "within_month" | "within_3_months" | "later" | "unknown";
export type CoverageLevel = "economic" | "balanced" | "comfort" | "reinforced";
export type HealthPriority =
  | "hospitalisation"
  | "soins_courants"
  | "optique"
  | "dentaire"
  | "medecines_douces"
  | "auditif";
export type MonthlyBudgetRange =
  | "under_50"
  | "50_80"
  | "80_120"
  | "120_180"
  | "over_180"
  | "unknown";
export type TnsActivityType =
  | "artisan"
  | "commercant"
  | "profession_liberale"
  | "dirigeant"
  | "autre";
export type MadelinInterest = "yes" | "no" | "unknown";

export type MutuelleFormState = {
  leadId?: string;
  profileType?: ProfileType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postalCode: string;
  birthDate: string;
  hasCurrentMutuelle?: boolean;
  desiredChangeDate?: DesiredChangeDate;
  professionalStatus?: ProfessionalStatus;
  coverageLevel?: CoverageLevel;
  healthPriorities: HealthPriority[];
  monthlyBudgetRange?: MonthlyBudgetRange;
  spouseBirthDate?: string;
  spouseHasCoverage?: boolean;
  childrenCount?: number;
  childrenBirthDates: string[];
  tnsActivityType?: TnsActivityType;
  madelinInterest?: MadelinInterest;
  seniorIsRetired?: boolean;
  seniorPriorityNotes?: string;
  rgpdConsent: boolean;
};

export const INITIAL_MUTUELLE_FORM: MutuelleFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  postalCode: "",
  birthDate: "",
  healthPriorities: [],
  childrenBirthDates: [],
  rgpdConsent: false,
};
