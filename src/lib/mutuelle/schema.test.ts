import { describe, expect, it } from "vitest";
import { mutuelleDraftSchema, mutuelleSubmitSchema } from "@/lib/mutuelle/schema";

const validBase = {
  firstName: "Jean",
  lastName: "Dupont",
  email: "jean@example.com",
  phone: "04 68 00 00 00",
  postalCode: "66000",
  birthDate: "1985-06-15",
  profileType: "solo" as const,
  professionalStatus: "salarie" as const,
  hasCurrentMutuelle: false,
  desiredChangeDate: "asap" as const,
  coverageLevel: "balanced" as const,
  healthPriorities: ["hospitalisation" as const],
  monthlyBudgetRange: "50_80" as const,
  rgpdConsent: true,
};

describe("mutuelleDraftSchema", () => {
  it("accepte un brouillon minimal", () => {
    const r = mutuelleDraftSchema.safeParse({
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      phone: "0612345678",
      postalCode: "66000",
      birthDate: "1990-01-01",
    });
    expect(r.success).toBe(true);
  });

  it("refuse un code postal invalide", () => {
    const r = mutuelleDraftSchema.safeParse({
      ...validBase,
      postalCode: "660",
    });
    expect(r.success).toBe(false);
  });
});

describe("mutuelleSubmitSchema", () => {
  it("accepte une soumission solo complète", () => {
    const r = mutuelleSubmitSchema.safeParse(validBase);
    expect(r.success).toBe(true);
  });

  it("exige le conjoint pour un profil couple", () => {
    const r = mutuelleSubmitSchema.safeParse({
      ...validBase,
      profileType: "couple",
    });
    expect(r.success).toBe(false);
  });

  it("limite les enfants à 8", () => {
    const r = mutuelleSubmitSchema.safeParse({
      ...validBase,
      profileType: "family",
      spouseBirthDate: "1988-03-01",
      childrenCount: 9,
      childrenBirthDates: Array.from({ length: 9 }, () => "2015-01-01"),
    });
    expect(r.success).toBe(false);
  });
});
