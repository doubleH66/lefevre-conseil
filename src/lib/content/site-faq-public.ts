/** FAQ publique — page /faq (catégories + mise en avant). */

export const FAQ_CATEGORIES = [
  "Rendez-vous",
  "Cabinet",
  "Outils",
  "Espace client",
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
    q: "Quel délai pour une réponse ?",
    a: "Nous nous chargeons de vous rappeler dans les **24 heures**. Pour une échéance fiscale urgente, indiquez la date limite dans votre message.",
    category: "Cabinet",
    featured: true,
  },
  {
    q: "Comment se déroule un premier rendez-vous ?",
    a: "Après analyse de votre message, un conseiller vous propose un créneau au cabinet à Perpignan ou en visioconférence selon votre situation et votre localisation.",
    category: "Rendez-vous",
  },
  {
    q: "Intervenez-vous en dehors de Perpignan ?",
    a: "Oui. Le cabinet accompagne ses clients à travers toute la France, en visioconférence et en présentiel pour les dossiers les plus structurants.",
    category: "Cabinet",
  },
  {
    q: "Le premier échange est-il facturé ?",
    a: "Non. Le premier rendez-vous est offert et sans engagement. Les modalités d'honoraires sont présentées ensuite, en fonction du dossier.",
    category: "Rendez-vous",
  },
  {
    q: "Puis-je faire une simulation avant un rendez-vous ?",
    a: "Oui. Le simulateur patrimonial en ligne vous permet d'obtenir une première piste chiffrée ; un conseiller peut ensuite affiner avec vous les hypothèses et les leviers.",
    category: "Outils",
  },
  {
    q: "Comment accéder à mon espace client ?",
    a: "Connectez-vous depuis l'icône « Compte » dans la barre de navigation. Après validation de votre e-mail, vous accédez à votre espace personnel.",
    category: "Espace client",
  },
  {
    q: "Comment sont rémunérés les conseillers ?",
    a: "Lefèvre Conseil est rémunéré par des honoraires de conseil et, le cas échéant, par des commissions sur les produits souscrits — toujours expliquées *avant* toute décision.",
    category: "Cabinet",
  },
  {
    q: "Faut-il avoir beaucoup d'argent pour consulter un CGP ?",
    a: "Non. Un bilan patrimonial sert à structurer votre situation, quel que soit le montant de votre épargne — l'objectif est de clarifier vos priorités, pas de vendre un produit.",
    category: "Rendez-vous",
  },
  {
    q: "Quelle différence avec un conseiller bancaire ?",
    a: "Un CGP indépendant n'est pas lié à une banque : il compare l'ensemble du marché et vous conseille dans *votre* intérêt, sans obligation de souscription.",
    category: "Cabinet",
  },
];
