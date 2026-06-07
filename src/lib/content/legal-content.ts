import type { LegalSection } from "@/components/pages/legal-page";

export const LEGAL_UPDATED_AT = "22 mai 2026";

const MEDIATION_URL = "https://www.cnpm-mediation-consommation.eu/";
const ACPR_URL = "https://www.acpr.banque-france.fr/";
const ORIAS_URL = "https://www.orias.fr";

export const RECLAMATIONS_SECTIONS: LegalSection[] = [
  {
    title: "Notre engagement",
    body: [
      "Nous attachons une attention toute particulière à la satisfaction de nos clients. Si vous rencontrez la moindre difficulté concernant la souscription ou l'application de votre contrat ou service, vous pouvez directement contacter votre interlocuteur habituel qui vous assistera afin de résoudre cette dernière.",
      "En hypothèse, vous pouvez formuler tout mécontentement par une réclamation selon la procédure ci-dessous.",
    ],
  },
  {
    title: "Procédure de réclamation",
    subsections: [
      {
        title: "Niveau 1",
        body: [
          "Auprès de votre interlocuteur habituel aux coordonnées que vous utilisez dans le cadre de vos échanges.",
        ],
      },
      {
        title: "Niveau 2",
        body: [
          "Auprès de notre service dédié aux coordonnées suivantes :",
          "Par courrier : LEFÈVRE CONSEIL - service réclamation, 27 Avenue Général de Gaulle, 66000 PERPIGNAN.",
          "Par e-mail : contact@lefevre-conseil.fr (objet : Réclamation).",
        ],
      },
      {
        title: "Niveau 3 - Médiation",
        body: [
          "Si la réponse apportée par notre service réclamation ne vous satisfait pas, vous pouvez librement et gratuitement saisir le médiateur :",
          "CNP MÉDIATION CONSOMMATION, 27 Avenue de la Libération, 42400 SAINT-CHAMOND.",
          MEDIATION_URL,
          "La demande d'une médiation n'est possible que si vous avez formellement réalisé une réclamation auprès de votre interlocuteur habituel ou de notre service réclamation et que vous n'avez pas eu de réponse dans les deux mois ou que la réponse ne vous satisfait pas.",
          "Par ailleurs, aucune action judiciaire ne doit avoir été engagée pour que le médiateur puisse agir. Néanmoins, vous pouvez arrêter la procédure de médiation à tout moment.",
          "Le Médiateur dispose de trois mois pour rendre son avis, à compter de la réception des documents sur lesquels est fondée votre demande. L'avis du Médiateur n'est pas obligatoire : vous restez libre de le suivre ou non. Toutefois, le recours au médiateur présente l'avantage de vous exposer l'avis d'un tiers expert du domaine sur vos prétentions et de limiter les contentieux.",
        ],
      },
    ],
  },
];

export const MENTIONS_LEGALES_SECTIONS: LegalSection[] = [
  {
    title: "Éditeur du site",
    body: [
      "LEFÈVRE CONSEIL - Société par Actions Simplifiée Unipersonnelle de courtage en assurance à capital social de 1 000 euros (€).",
      `Immatriculée à l'ORIAS dans la catégorie courtier d'assurances sous le numéro 25 001 948 (${ORIAS_URL}).`,
      "RCS Perpignan : 937 753 150.",
      "Siège social : 27 Avenue Général de Gaulle, 66000 PERPIGNAN.",
      "Tél. 04 68 86 36 22 - www.lefevre-conseil.fr - contact@lefevre-conseil.fr",
      `Responsabilité Civile Professionnelle et Garantie Financière conformes aux articles L 512-6 et L 512-7 du Code des assurances - sous le contrôle de l'ACPR, 4 place de Budapest CS 92459, 75436 Paris Cedex 09 (${ACPR_URL}).`,
      "Votre courtier exerce son activité en application des dispositions de l'article L 520-1 II b du Code des assurances.",
      `Réclamation : LEFÈVRE CONSEIL - Service Réclamation, 27 Avenue Général de Gaulle, 66000 PERPIGNAN. Médiation (seulement en cas d'échec de la réclamation) : CNP Médiation, 27 Avenue de la Libération, 42400 SAINT-CHAMOND (${MEDIATION_URL}).`,
      "La société ne détient aucun droit de vote ni participation, direct ou indirect, au capital d'une entreprise d'assurance. De même, aucune entreprise d'assurance ne détient de droit de vote ou participation, direct ou indirect, au capital de LEFÈVRE CONSEIL.",
      "LEFÈVRE CONSEIL tient à disposition, sur simple demande, les noms et coordonnées de toutes les entreprises d'assurance et autres partenaires avec lesquels il travaille.",
    ],
  },
  {
    title: "Réalisation",
    body: [
      "Site édité par Lefèvre Conseil.",
      "Conception, développement et maintenance : Hey Aurenis.",
    ],
  },
  {
    title: "Hébergement et infrastructure",
    body: [
      "Application web hébergée par Vercel Inc. (vercel.com).",
      "Nom de domaine : OVH SAS, 2 rue Kellermann, 59100 Roubaix.",
      "Données de l'espace client et fichiers associés : hébergés sur Supabase (supabase.com), dans l'Union européenne selon la configuration du projet.",
      "Le prestataire historique de stockage du site peut également être mentionné à titre informatif : OVH SAS, 2 rue Kellermann, 59100 Roubaix.",
    ],
  },
  {
    title: "Propriété intellectuelle",
    body: [
      "L'ensemble des contenus du présent site est la propriété exclusive de LEFÈVRE CONSEIL ou de ses prestataires désignés.",
      "L'ensemble de ce site (contenu et présentation) constitue une œuvre protégée par la législation française et internationale en vigueur sur le droit d'auteur et, d'une manière générale, sur la propriété intellectuelle et industrielle.",
    ],
  },
  {
    title: "Liens hypertextes",
    body: [
      "LEFÈVRE CONSEIL ne saurait être tenue pour responsable de la mise à disposition d'un lien hypertexte à partir d'autres sites internet, et ne peut supporter aucune responsabilité sur le contenu, les produits, les services, etc. disponibles sur ces sites ou à partir de ces sites.",
    ],
  },
  {
    title: "Loi applicable",
    body: [
      "Les présentes conditions d'utilisation du site et de ses services proposés sont soumises au droit français.",
      "Tout litige sera soumis, à défaut d'accord amiable entre les Parties, au Tribunal de Commerce de Perpignan.",
    ],
  },
];

export const COOKIES_POLICY_SECTIONS: LegalSection[] = [
  {
    title: "Information générale",
    body: [
      "L'internaute est informé, lors de sa première visite sur le site, qu'il peut accepter ou refuser l'installation de cookies sur son logiciel de navigation.",
      "Le refus d'installation des cookies peut entraîner l'indisponibilité de certains services auxquels ils sont associés.",
      "L'utilisateur peut à tout moment retirer son consentement à la récolte et l'utilisation de cookies.",
    ],
  },
  {
    title: "Types de cookies utilisés",
    items: [
      "Cookies pour sauvegarder vos choix en matière d'acceptation d'utilisation des cookies.",
      "Cookies techniques nécessaires au fonctionnement du site (session, sécurité, espace client).",
      "Cookies ou traceurs de mesure d'audience (Vercel Analytics), uniquement avec votre accord via le bandeau cookies.",
    ],
  },
  {
    title: "Durée de conservation",
    body: ["Les cookies sont conservés pour une durée n'excédant pas 13 mois."],
  },
  {
    title: "Données personnelles",
    body: [
      "Conformément au Règlement (UE) 2016/679 (RGPD), le recueil des données par LEFÈVRE CONSEIL est conditionné à la nécessité de leur utilisation.",
      "Les données recueillies sont nécessaires pour répondre à la demande de l'utilisateur et sont destinées au responsable de traitement à des fins de gestion commerciale et statistique des services utilisés.",
      "LEFÈVRE CONSEIL s'engage à ce que les données recueillies ne soient pas utilisées à des fins excédant les prérogatives accordées par le consentement de l'utilisateur.",
      "Pour le détail des traitements, consultez la politique de confidentialité.",
    ],
  },
];

export const CONDITIONS_UTILISATION_SECTIONS: LegalSection[] = [
  {
    title: "Objet",
    body: [
      "Les présentes conditions régissent l'accès et l'utilisation du site www.lefevre-conseil.fr et de ses services en ligne (informations, formulaires, espace client).",
      "L'utilisation du site implique l'acceptation des présentes conditions.",
    ],
  },
  {
    title: "Accès au site",
    body: [
      "Le site est destiné à un usage personnel et informatif. L'accès peut être suspendu pour maintenance ou mise à jour.",
      "Les informations publiées sont fournies à titre informatif et ne constituent pas un conseil personnalisé ni une offre contractuelle.",
    ],
  },
  {
    title: "Compte client",
    body: [
      "L'utilisateur est responsable de la confidentialité de ses identifiants et des informations transmises via son espace.",
      "Toute stratégie patrimoniale ou décision d'assurance doit faire l'objet d'une analyse individualisée avec un conseiller du cabinet.",
    ],
  },
  {
    title: "Responsabilité",
    body: [
      "Lefèvre Conseil ne saurait être tenu responsable des dommages indirects liés à l'utilisation du site, dans les limites légales.",
      "Toute stratégie patrimoniale doit faire l'objet d'une analyse individualisée.",
    ],
  },
  {
    title: "Loi applicable",
    body: [
      "Les présentes conditions sont soumises au droit français.",
      "Tout litige sera soumis, à défaut d'accord amiable, au Tribunal de Commerce de Perpignan.",
    ],
  },
];

export const CONFIDENTIALITE_SECTIONS: LegalSection[] = [
  {
    title: "Introduction sur le RGPD",
    body: [
      "Le Règlement Général sur la Protection des Données (RGPD) est le cadre juridique du traitement de données à caractère personnel en Europe, à compter du 25 mai 2018.",
      "Contrairement à la directive 95/46/CE, le RGPD est d'application directe dans l'Union et ne nécessite pas de transpositions nationales. Il favorise l'harmonisation des régimes juridiques en matière de protection des données en Europe.",
      "Le RGPD dispose d'un principe d'extraterritorialité qui permet, dans certaines circonstances, d'étendre son périmètre d'application en dehors des frontières européennes.",
      "En tant que société traitant des données à caractère personnel, Lefèvre Conseil est assujetti aux dispositions du RGPD, avec des obligations distinctes selon qu'il agit en qualité de responsable de traitement ou de sous-traitant.",
    ],
  },
  {
    title: "Nécessité de collecte et responsables de traitement",
    body: [
      "Dans la rédaction d'un devis, la conclusion d'un contrat d'assurance, le cadre d'une résiliation, d'une réclamation, et de l'ensemble de la durée de vie du contrat, ou encore dans le cadre d'une campagne publicitaire depuis les réseaux sociaux, nous devons collecter, stocker et traiter des données à caractère personnel.",
      "Au sens du Règlement (UE) 2016/679 et de la loi n° 78-17 du 6 janvier 1978 « Informatique et Libertés » (mise en conformité par la loi n° 2018-493 du 20 juin 2018), LEFÈVRE CONSEIL agit en qualité de « responsable du traitement ».",
      "En tant que courtier en assurance travaillant avec un réseau de partenaires, LEFÈVRE CONSEIL peut également être considéré comme « sous-traitant » et s'engage à respecter les obligations légales afférentes.",
    ],
  },
  {
    title: "Les données collectées",
    items: [
      "Données générales : nom, prénom, adresse, coordonnées, date de naissance, sexe, informations relatives au co-titulaire de la carte grise.",
      "Éléments d'identification : carte grise, permis de conduire, relevés d'informations, usage du véhicule (contrat automobile privé ou professionnel).",
      "Données relatives au contrat professionnel : KBIS, documents INSEE, numéro RCS, informations nécessaires à la tarification.",
      "Situation professionnelle : catégorie socio-professionnelle.",
      "Gestion du contrat : réclamations, sinistres, avis d'experts, constats, avis d'échéance, résiliations, déclarations kilométriques, devis.",
      "Formulaires de contact et adresses e-mail pour la newsletter.",
      "Données économiques et financières : patrimoine, RIB, mandats SEPA, cotisations, informations financières des sociétés (KBIS, RCS), chèques.",
      "Données de connexion : cookies, appels téléphoniques.",
    ],
  },
  {
    title: "Données sensibles",
    items: [
      "Données relatives à des infractions, condamnations pénales, procédures de recouvrement, réquisitions des forces de l'ordre, créances.",
      "Données concernant la santé : numéro de sécurité sociale, affiliation, certificats médicaux (sinistres corporels), comptes rendus de blessures, attestations d'alcoolémie et d'usage de stupéfiants.",
    ],
  },
  {
    title: "Origine des données",
    items: [
      "Consentement exprès de la personne concernée.",
      "Partenaires du cabinet.",
      "Tiers prestataires (experts, médecins, etc.).",
      "Ressources publiques (jugements, procès-verbaux, Banque de France).",
      "Compagnies d'assurance avec lesquelles la personne a des contrats.",
      "Banques en cas d'opposition liée à des prêts.",
      "Sites internet du cabinet.",
    ],
  },
  {
    title: "Finalités du traitement",
    items: [
      "Conclusion d'un contrat d'assurance (devis, acceptation, pièces justificatives).",
      "Gestion du contrat pendant toute sa durée (échéances, sinistres, etc.).",
      "Résiliation ou fin de contrat.",
      "Lutte contre la fraude et le blanchiment.",
      "Réponse aux demandes et suivi de la relation client.",
      "Obligations légales et réglementaires du cabinet.",
    ],
  },
  {
    title: "Durée de conservation",
    body: [
      "LEFÈVRE CONSEIL s'engage à ce qu'aucune donnée ne soit conservée au-delà du temps nécessaire à l'accomplissement de la finalité poursuivie, dans le cadre de la législation en vigueur.",
      "Les données sont conservées durant l'exécution du contrat et, le cas échéant, au-delà conformément aux obligations légales (notamment en cas de procédure judiciaire).",
      "La personne concernée peut demander à tout moment la durée de conservation de ses données auprès du cabinet.",
    ],
  },
  {
    title: "Vos droits",
    body: [
      "Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité.",
      "Pour toute question, renseignement ou pour faire valoir vos droits, adressez votre demande au service dédié :",
      "LEFÈVRE CONSEIL - Service RGPD, 27 Avenue Général de Gaulle, 66000 PERPIGNAN.",
      "Par e-mail : contact@lefevre-conseil.fr.",
      "Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).",
    ],
  },
];
