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

export type ApiReport = {
  enabled: boolean;
  called: boolean;
  status: "success" | "error" | "disabled";
  errorMessage?: string;
  summaryLines?: string[];
};

function formatDateFr(iso: string | undefined): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function formatPersonnes(data: MutuelleSubmitInput): string[] {
  const lines: string[] = [];
  lines.push(
    `Adhérent : ${data.firstName} ${data.lastName}, né(e) le ${formatDateFr(data.birthDate)}`,
  );

  if (data.profileType === "couple" || data.profileType === "family") {
    lines.push(`Conjoint : né(e) le ${formatDateFr(data.spouseBirthDate)}`);
  } else {
    lines.push("Conjoint : —");
  }

  if (data.profileType === "family") {
    const count = data.childrenCount ?? 0;
    lines.push(`Enfants : ${count}`);
    const dates = data.childrenBirthDates ?? [];
    dates.forEach((d, i) => {
      lines.push(`  - Enfant ${i + 1} : né(e) le ${formatDateFr(d)}`);
    });
  } else {
    lines.push("Enfants : —");
  }

  return lines;
}

export function buildMutuelleLeadEmailText(
  data: MutuelleSubmitInput,
  api: ApiReport,
): string {
  const priorities = data.healthPriorities
    .map((p) => `  - ${HEALTH_PRIORITY_LABELS[p]}`)
    .join("\n");

  const tnsBlock =
    data.profileType === "tns"
      ? [
          "",
          "## TNS / indépendant",
          `- Type d'activité : ${data.tnsActivityType ? TNS_ACTIVITY_LABELS[data.tnsActivityType] : "—"}`,
          `- Intérêt Loi Madelin : ${data.madelinInterest ? MADELIN_LABELS[data.madelinInterest] : "—"}`,
        ]
      : [];

  const seniorBlock =
    data.profileType === "senior"
      ? [
          "",
          "## Profil senior",
          `- Retraité : ${data.seniorIsRetired ? "Oui" : "Non"}`,
          data.seniorPriorityNotes
            ? `- Besoins prioritaires : ${data.seniorPriorityNotes}`
            : null,
        ].filter(Boolean)
      : [];

  const apiStatusLabel =
    api.status === "success"
      ? "succès"
      : api.status === "error"
        ? "erreur"
        : "non activée";

  return [
    "Nouvelle demande mutuelle reçue depuis le site.",
    "",
    "## Coordonnées",
    `- Prénom : ${data.firstName}`,
    `- Nom : ${data.lastName}`,
    `- Email : ${data.email}`,
    `- Téléphone : ${data.phone}`,
    `- Code postal : ${data.postalCode}`,
    `- Date de naissance : ${formatDateFr(data.birthDate)}`,
    "",
    "## Profil",
    `- Type de demande : ${PROFILE_TYPE_LABELS[data.profileType]}`,
    `- Statut professionnel : ${PROFESSIONAL_STATUS_LABELS[data.professionalStatus]}`,
    `- A déjà une mutuelle : ${data.hasCurrentMutuelle ? "Oui" : "Non"}`,
    `- Date souhaitée de changement : ${DESIRED_CHANGE_DATE_LABELS[data.desiredChangeDate]}`,
    `- Budget mensuel souhaité : ${MONTHLY_BUDGET_LABELS[data.monthlyBudgetRange]}`,
    "",
    "## Besoins santé",
    `- Niveau recherché : ${COVERAGE_LEVEL_LABELS[data.coverageLevel]}`,
    "- Priorités :",
    priorities,
    "",
    "## Personnes à assurer",
    ...formatPersonnes(data),
    ...tnsBlock,
    ...seniorBlock,
    "",
    "## Consentement",
    "- Consentement RGPD : oui",
    `- Date du consentement : ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`,
    "",
    "## Statut technique",
    "- Lead enregistré : oui",
    `- API Alptis appelée : ${api.called ? "oui" : "non"}`,
    `- Résultat API : ${apiStatusLabel}`,
    api.errorMessage ? `- Message erreur API : ${api.errorMessage}` : null,
    api.summaryLines?.length
      ? ["", "### Estimation API (indicative)", ...api.summaryLines.map((l) => `- ${l}`)]
      : null,
  ]
    .flat()
    .filter((line): line is string => line != null)
    .join("\n");
}
