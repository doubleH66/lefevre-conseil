import { CONTACT_HREF } from "@/lib/content/routes";

export const LUXEMBOURG_CONTRACT_SECTION = {
  title: "Contrat luxembourgeois : une solution patrimoniale haut de gamme",
  intro:
    "Le contrat luxembourgeois est une enveloppe patrimoniale reconnue pour sa solidité, sa flexibilité et son architecture sécurisée. Il peut être pertinent pour certains profils souhaitant diversifier leur patrimoine, préparer une transmission ou bénéficier d’une vision financière plus internationale.",
  advantages: [
    {
      title: "Sécurité renforcée",
      text: "Grâce au mécanisme du triangle de sécurité luxembourgeois, les actifs sont conservés auprès d’une banque dépositaire distincte.",
    },
    {
      title: "Univers d’investissement élargi",
      text: "Selon le profil et le montant investi, le contrat peut donner accès à une architecture financière plus ouverte et diversifiée.",
    },
    {
      title: "Mobilité internationale",
      text: "Une solution qui peut convenir aux personnes ayant des intérêts patrimoniaux, familiaux ou professionnels dans plusieurs pays.",
    },
  ],
  audience: {
    label: "Pour qui ?",
    items: [
      "Dirigeants d’entreprise",
      "Professions libérales",
      "Patrimoines importants",
      "Familles souhaitant préparer une transmission",
      "Personnes avec une dimension internationale",
    ],
  },
  advisory:
    "Chaque recommandation doit être précédée d’une analyse patrimoniale complète : situation personnelle, objectifs, fiscalité, horizon d’investissement, niveau de risque et besoins de transmission.",
  cta: {
    label: "Demander une étude patrimoniale personnalisée",
    href: CONTACT_HREF,
  },
} as const;
