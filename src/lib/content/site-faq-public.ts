/** FAQ publique - page /faq (catégories + mise en avant). */

export const FAQ_CATEGORIES = [
  "Gestion de patrimoine",
  "Premier rendez-vous",
  "Fiscalité patrimoniale",
  "Retraite et transmission",
  "Placements et épargne",
  "Prévoyance",
  "Perpignan et accompagnement à distance",
  "Cabinet et cadre professionnel",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export type FaqPublicItem = {
  q: string;
  a: string;
  category: FaqCategory;
  featured?: boolean;
};

export const FAQ_PUBLIC_ITEMS: FaqPublicItem[] = [
  {
    q: "Qu’est-ce qu’un conseiller en gestion de patrimoine ?",
    a: "Un conseiller en gestion de patrimoine accompagne ses clients dans l’organisation, le développement, la protection et la transmission de leur patrimoine. Il analyse la situation personnelle, professionnelle, familiale et fiscale afin de proposer une stratégie adaptée aux objectifs du client.",
    category: "Gestion de patrimoine",
    featured: true,
  },
  {
    q: "Pourquoi consulter un conseiller en gestion de patrimoine à Perpignan ?",
    a: "Consulter un conseiller patrimonial à Perpignan permet de bénéficier d’un accompagnement de proximité, avec une connaissance du tissu local et régional. Lefèvre Conseil reçoit ses clients à Perpignan et accompagne également à distance les clients situés en Occitanie ou ailleurs en France.",
    category: "Perpignan et accompagnement à distance",
    featured: true,
  },
  {
    q: "Comment se déroule un premier rendez-vous patrimonial ?",
    a: "Le premier rendez-vous permet de comprendre votre situation, vos objectifs et vos priorités. Il peut porter sur vos placements, votre retraite, votre fiscalité, votre transmission, votre prévoyance ou vos projets personnels et professionnels.",
    category: "Premier rendez-vous",
    featured: true,
  },
  {
    q: "Le premier échange est-il gratuit ?",
    a: "Le premier échange permet de faire le point sur votre demande et d’identifier les sujets à approfondir. Il est offert et sans engagement.",
    category: "Premier rendez-vous",
    featured: true,
  },
  {
    q: "Quels sujets peut-on aborder avec Lefèvre Conseil ?",
    a: "Le cabinet accompagne ses clients sur la gestion de patrimoine, les placements, l’épargne, la retraite, la transmission, la fiscalité patrimoniale, la prévoyance, l’assurance emprunteur et certaines solutions d’investissement adaptées au profil du client.",
    category: "Gestion de patrimoine",
  },
  {
    q: "Quelle est la différence entre optimisation fiscale et défiscalisation ?",
    a: "L’optimisation fiscale consiste à organiser son patrimoine de manière cohérente dans le respect du cadre légal. La défiscalisation désigne souvent un dispositif précis. Lefèvre Conseil privilégie une approche globale, prudente et adaptée à la situation du client.",
    category: "Fiscalité patrimoniale",
  },
  {
    q: "Assurance-vie ou PER : quelle solution choisir ?",
    a: "L’assurance-vie et le PER répondent à des objectifs différents. L’assurance-vie peut servir à épargner, transmettre ou diversifier un patrimoine. Le PER est principalement orienté vers la préparation de la retraite. Le choix dépend de votre situation, de votre fiscalité, de votre horizon et de vos objectifs.",
    category: "Placements et épargne",
  },
  {
    q: "Comment préparer sa retraite avec un conseiller patrimonial ?",
    a: "Préparer sa retraite consiste à estimer ses revenus futurs, identifier les écarts éventuels, organiser son épargne et étudier les solutions adaptées. L’objectif est d’anticiper suffisamment tôt pour prendre des décisions cohérentes.",
    category: "Retraite et transmission",
  },
  {
    q: "Comment organiser la transmission de son patrimoine ?",
    a: "Organiser la transmission permet d’anticiper la protection des proches, la répartition du patrimoine et les impacts fiscaux. Selon la situation, plusieurs leviers peuvent être étudiés : donation, assurance-vie, clause bénéficiaire, démembrement ou organisation familiale.",
    category: "Retraite et transmission",
  },
  {
    q: "Lefèvre Conseil accompagne-t-il les dirigeants d’entreprise ?",
    a: "Oui. Le cabinet accompagne les dirigeants, indépendants et professions libérales sur leurs problématiques patrimoniales personnelles et professionnelles : retraite, prévoyance, protection familiale, transmission, placements et fiscalité patrimoniale.",
    category: "Cabinet et cadre professionnel",
  },
  {
    q: "Peut-on être accompagné à distance ?",
    a: "Oui. Les rendez-vous peuvent se faire au cabinet à Perpignan, par téléphone ou en visioconférence. Cela permet d’accompagner les clients dans les Pyrénées-Orientales, en Occitanie et partout en France.",
    category: "Perpignan et accompagnement à distance",
  },
  {
    q: "La gestion de patrimoine concerne-t-elle seulement les gros patrimoines ?",
    a: "Non. La gestion de patrimoine permet aussi d’anticiper, de mieux épargner, de préparer sa retraite, de protéger sa famille et d’éviter certaines décisions prises trop tard. Elle peut être utile dès lors que vous souhaitez structurer vos projets.",
    category: "Gestion de patrimoine",
  },
  {
    q: "Quels documents préparer avant un rendez-vous patrimonial ?",
    a: "Il peut être utile de préparer les informations liées à vos revenus, votre fiscalité, vos placements existants, vos crédits, votre situation familiale, vos objectifs et vos projets. Le cabinet vous indiquera les éléments nécessaires selon votre demande.",
    category: "Premier rendez-vous",
  },
  {
    q: "Lefèvre Conseil propose-t-il un suivi dans le temps ?",
    a: "Oui. Une stratégie patrimoniale doit être ajustée lorsque votre situation évolue : revenus, famille, fiscalité, projets, retraite ou transmission. Le suivi permet de garder une vision claire dans la durée.",
    category: "Cabinet et cadre professionnel",
  },
  {
    q: "Pourquoi intégrer la prévoyance à une stratégie patrimoniale ?",
    a: "La prévoyance permet de protéger vos revenus, votre famille et vos projets en cas d’aléa de la vie. Elle complète une stratégie patrimoniale équilibrée, aux côtés de l’épargne, de la retraite et de la transmission.",
    category: "Prévoyance",
  },
  {
    q: "Comment prendre rendez-vous avec Lefèvre Conseil ?",
    a: "Vous pouvez prendre rendez-vous via la page Contact du site, par téléphone ou par e-mail. Le cabinet vous recontacte ensuite pour organiser un premier échange adapté à votre situation.",
    category: "Premier rendez-vous",
  },
];
