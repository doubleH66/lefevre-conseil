import type { MutuelleSubmitInput } from "@/lib/mutuelle/schema";
import type { CoverageLevel } from "@/lib/mutuelle/types";

/** Niveau global Santé Select (1–5) selon le choix prospect. */
export function mapCoverageToNiveau(level: CoverageLevel): number {
  const map: Record<CoverageLevel, number> = {
    economic: 2,
    balanced: 3,
    comfort: 4,
    reinforced: 5,
  };
  return map[level];
}

export function mapProfessionalStatusToCsp(status: MutuelleSubmitInput["professionalStatus"]): string {
  const map: Record<MutuelleSubmitInput["professionalStatus"], string> = {
    salarie: "SALARIES",
    independant: "PROFESSIONS_LIBERALES_ET_ASSIMILES",
    retraite: "RETRAITES",
    sans_activite: "PERSONNES_SANS_ACTIVITE_PROFESSIONNELLE",
    autre: "AUTRES",
  };
  return map[status];
}

export function mapTnsActivityToCsp(
  activity: NonNullable<MutuelleSubmitInput["tnsActivityType"]>,
): string {
  const map: Record<NonNullable<MutuelleSubmitInput["tnsActivityType"]>, string> = {
    artisan: "ARTISANS",
    commercant: "COMMERCANTS_ET_ASSIMILES",
    profession_liberale: "PROFESSIONS_LIBERALES_ET_ASSIMILES",
    dirigeant: "CHEFS_D_ENTREPRISE",
    autre: "AUTRES",
  };
  return map[activity];
}

function effectDateIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function ayantsDroitFromProfile(data: MutuelleSubmitInput) {
  const hasSpouse = data.profileType === "couple" || data.profileType === "family";
  const children =
    data.profileType === "family" ? Math.min(data.childrenCount ?? 0, 8) : 0;

  return {
    adherent: {
      date_naissance: data.birthDate,
      code_regime_obligatoire: "SECURITE_SOCIALE",
      code_csp:
        data.profileType === "tns" && data.tnsActivityType
          ? mapTnsActivityToCsp(data.tnsActivityType)
          : mapProfessionalStatusToCsp(data.professionalStatus),
      code_departement: data.postalCode.slice(0, 2),
    },
    conjoint: hasSpouse
      ? {
          date_naissance: data.spouseBirthDate,
          code_regime_obligatoire: "SECURITE_SOCIALE",
        }
      : undefined,
    enfants:
      children > 0
        ? Array.from({ length: children }, (_, i) => ({
            date_naissance: data.childrenBirthDates?.[i] ?? data.birthDate,
            code_regime_obligatoire: "SECURITE_SOCIALE",
          }))
        : [],
  };
}

export function buildSanteSelectTarificationPayload(data: MutuelleSubmitInput, codeDistributeur: string) {
  const niveau = mapCoverageToNiveau(data.coverageLevel);
  return {
    code_distributeur: codeDistributeur,
    date_effet: effectDateIso(),
    ayants_droit: ayantsDroitFromProfile(data),
    combinaisons: [
      {
        numero: 1,
        taux_commissionnement: 0,
        type_commissionnement: "LINEAIRE",
        code_formule: "COMPLETE",
        sur_complementaire: false,
        niveau,
      },
    ],
  };
}

export function summarizeTarificationResponse(
  payload: unknown,
): string[] | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const record = payload as Record<string, unknown>;
  const combinaisons = record.combinaisons ?? record.resultats;
  if (!Array.isArray(combinaisons) || combinaisons.length === 0) return undefined;

  return combinaisons.slice(0, 3).map((c, i) => {
    if (!c || typeof c !== "object") return `Combinaison ${i + 1} : résultat reçu`;
    const row = c as Record<string, unknown>;
    const montant = row.montant ?? row.cotisation ?? row.prix;
    const niveau = row.niveau;
    if (montant != null) {
      return `Combinaison ${i + 1}${niveau != null ? ` (niveau ${niveau})` : ""} : ${montant} €/mois (indicatif)`;
    }
    return `Combinaison ${i + 1} : tarification reçue`;
  });
}
