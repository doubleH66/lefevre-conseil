import { z } from "zod";

export const PROFILE_TYPES = ["solo", "couple", "family", "tns", "senior"] as const;
export const PROFESSIONAL_STATUSES = [
  "salarie",
  "independant",
  "retraite",
  "sans_activite",
  "autre",
] as const;
export const DESIRED_CHANGE_DATES = [
  "asap",
  "within_month",
  "within_3_months",
  "later",
  "unknown",
] as const;
export const COVERAGE_LEVELS = ["economic", "balanced", "comfort", "reinforced"] as const;
export const HEALTH_PRIORITIES = [
  "hospitalisation",
  "soins_courants",
  "optique",
  "dentaire",
  "medecines_douces",
  "auditif",
] as const;
export const MONTHLY_BUDGET_RANGES = [
  "under_50",
  "50_80",
  "80_120",
  "120_180",
  "over_180",
  "unknown",
] as const;
export const TNS_ACTIVITY_TYPES = [
  "artisan",
  "commercant",
  "profession_liberale",
  "dirigeant",
  "autre",
] as const;
export const MADELIN_INTERESTS = ["yes", "no", "unknown"] as const;

const emailSchema = z
  .string()
  .trim()
  .min(1, "E-mail requis")
  .email("Adresse e-mail invalide");

const frenchPhoneSchema = z
  .string()
  .trim()
  .min(1, "Téléphone requis")
  .refine((v) => /^[\d\s+().-]{8,20}$/.test(v), "Numéro de téléphone invalide");

const postalCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{5}$/, "Code postal invalide (5 chiffres)");

const birthDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date de naissance invalide")
  .refine((v) => {
    const d = new Date(v);
    return !Number.isNaN(d.getTime()) && d < new Date();
  }, "Date de naissance invalide");

export const mutuelleDraftSchema = z.object({
  leadId: z.string().uuid().optional(),
  firstName: z.string().trim().min(1, "Prénom requis").max(80),
  lastName: z.string().trim().min(1, "Nom requis").max(80),
  email: emailSchema,
  phone: frenchPhoneSchema,
  postalCode: postalCodeSchema,
  birthDate: birthDateSchema,
  profileType: z.enum(PROFILE_TYPES).optional(),
  sourcePage: z.string().trim().max(200).optional(),
  website: z.string().optional(),
});

export const mutuelleSubmitSchema = z
  .object({
    leadId: z.string().uuid().optional(),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: emailSchema,
    phone: frenchPhoneSchema,
    postalCode: postalCodeSchema,
    birthDate: birthDateSchema,
    profileType: z.enum(PROFILE_TYPES),
    professionalStatus: z.enum(PROFESSIONAL_STATUSES),
    hasCurrentMutuelle: z.boolean(),
    desiredChangeDate: z.enum(DESIRED_CHANGE_DATES),
    coverageLevel: z.enum(COVERAGE_LEVELS),
    healthPriorities: z.array(z.enum(HEALTH_PRIORITIES)).min(1, "Sélectionnez au moins une garantie"),
    monthlyBudgetRange: z.enum(MONTHLY_BUDGET_RANGES),
    spouseBirthDate: birthDateSchema.optional(),
    spouseHasCoverage: z.boolean().optional(),
    childrenCount: z.number().int().min(0).max(8).optional(),
    childrenBirthDates: z.array(birthDateSchema).optional(),
    tnsActivityType: z.enum(TNS_ACTIVITY_TYPES).optional(),
    madelinInterest: z.enum(MADELIN_INTERESTS).optional(),
    seniorIsRetired: z.boolean().optional(),
    seniorPriorityNotes: z.string().trim().max(500).optional(),
    rgpdConsent: z.boolean().refine((v) => v === true, { message: "Consentement requis" }),
    sourcePage: z.string().trim().max(200).optional(),
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.profileType === "couple") {
      if (!data.spouseBirthDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date de naissance du conjoint requise",
          path: ["spouseBirthDate"],
        });
      }
    }
    if (data.profileType === "family" && data.spouseHasCoverage !== false) {
      if (!data.spouseBirthDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date de naissance du conjoint requise",
          path: ["spouseBirthDate"],
        });
      }
    }
    if (data.profileType === "family") {
      const count = data.childrenCount ?? 0;
      const dates = data.childrenBirthDates ?? [];
      if (dates.length !== count) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indiquez la date de naissance de chaque enfant",
          path: ["childrenBirthDates"],
        });
      }
    }
    if (data.profileType === "tns") {
      if (!data.tnsActivityType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Type d'activité requis",
          path: ["tnsActivityType"],
        });
      }
      if (!data.madelinInterest) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Réponse Loi Madelin requise",
          path: ["madelinInterest"],
        });
      }
    }
    if (data.profileType === "senior" && data.seniorIsRetired === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Indiquez si vous êtes retraité",
        path: ["seniorIsRetired"],
      });
    }
  });

export type MutuelleDraftInput = z.infer<typeof mutuelleDraftSchema>;
export type MutuelleSubmitInput = z.infer<typeof mutuelleSubmitSchema>;
