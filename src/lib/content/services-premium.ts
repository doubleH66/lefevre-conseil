import type { ServiceSlug } from "@/lib/content/services";
import type { ServicePremiumContent } from "@/lib/content/service-premium-types";

export const SERVICE_PREMIUM_CONTENTS: Record<ServiceSlug, ServicePremiumContent> = {

  // ─────────────────────────────────────────────────────────────────────────
  // 1. Gestion de patrimoine
  // ─────────────────────────────────────────────────────────────────────────
  "gestion-de-patrimoine": {
    slug: "gestion-de-patrimoine",
    meta: {
      title: "Gestion de patrimoine à Perpignan | Lefèvre Conseil",
      description:
        "Cabinet indépendant à Perpignan : bilan patrimonial, stratégie d'épargne, retraite, transmission et fiscalité. Un seul conseiller, une vision d'ensemble.",
    },
    hero: {
      h1: "Conseil en gestion de patrimoine à Perpignan",
      subtitle: "Un bilan complet, une stratégie cohérente — sans produit imposé ni conflit d'intérêt.",
      taglineHighlightAfter: ", une stratégie cohérente",
      intro:
        "La gestion de patrimoine, c'est d'abord une question de **cohérence** : vos placements, votre retraite, votre fiscalité et votre famille doivent former un tout logique. Lefèvre Conseil vous accompagne depuis Perpignan, en cabinet ou à distance, avec une approche **indépendante**.",
    },
    whyImportant: {
      title: "Pourquoi une vision d'ensemble change tout",
      paragraphs: [
        "Beaucoup de personnes accumulent des contrats — un **PER** ici, une **assurance-vie** là, un crédit immobilier ailleurs — sans jamais vérifier si l'ensemble est cohérent. Résultat : trop de risque, pas assez de liquidité, une fiscalité non optimisée, une transmission non préparée.",
        "Le rôle d'un **conseiller en gestion de patrimoine indépendant**, c'est justement de faire cette synthèse. Il part de votre situation réelle (revenus, dépenses, famille, horizon, projets) pour identifier vos *priorités* — et seulement ensuite, propose des solutions.",
        "Cette démarche n'est pas réservée aux grandes fortunes. Elle est utile dès que vous avez des objectifs clairs : constituer une épargne, préparer votre retraite, protéger votre famille ou réduire votre impôt.",
      ],
    },
    accompaniment: { title: "", steps: [] },
    solutions: {
      title: "Ce que nous pouvons étudier ensemble",
      intro: "Selon votre situation et vos objectifs, le **bilan patrimonial** peut déboucher sur tout ou partie des sujets suivants.",
      items: [
        { title: "Épargne & placements", description: "**Assurance-vie**, PER, PEA, contrat de capitalisation — choix des enveloppes adaptées à votre profil et votre horizon." },
        { title: "Retraite", description: "Estimation des revenus futurs, leviers complémentaires et mise en place progressive d'une **épargne retraite**." },
        { title: "Fiscalité", description: "Réduction d'impôt via des dispositifs cohérents avec votre situation — *sans défiscalisation miracle*." },
        { title: "Immobilier patrimonial", description: "Investissement locatif, résidence principale, **démembrement** : intégration dans la stratégie globale." },
        { title: "Transmission", description: "**Clause bénéficiaire**, donation, organisation successorale pour protéger vos proches." },
        { title: "Prévoyance & protection", description: "Sécuriser vos revenus et votre famille en cas d'aléa de vie (arrêt, décès, invalidité)." },
      ],
    },
    forWho: {
      title: "Pour qui ?",
      profiles: ["Particuliers", "Familles", "Dirigeants", "Indépendants", "Professions libérales", "Propriétaires", "Futurs retraités"],
    },
    whyUs: { title: "", points: [] },
    summary: { title: "", bullets: [] },
    faq: [
      {
        q: "À quoi sert concrètement un bilan patrimonial ?",
        a: "À faire le point sur ce que vous possédez, ce que vous devez, vos projets et vos revenus futurs. À partir de là, on identifie les priorités : **épargne**, **retraite**, **protection**, **fiscalité** ou **transmission**.",
      },
      {
        q: "Faut-il avoir beaucoup d'argent pour consulter un CGP ?",
        a: "Non. L'important, c'est d'avoir des objectifs et l'envie d'y voir clair. Nous étudions chaque situation *sans seuil minimum*.",
      },
      {
        q: "Quelle différence avec un conseiller bancaire ?",
        a: "Un conseiller bancaire propose les produits *de sa banque*. Un **CGP indépendant** accède à un large panel de partenaires et n'a pas d'objectif de vente imposé par un établissement.",
      },
      {
        q: "Combien de temps dure un accompagnement ?",
        a: "Le bilan prend généralement **1 à 2 rendez-vous**. La relation peut ensuite durer des années : votre situation évolue, le suivi s'adapte.",
      },
      {
        q: "Le cabinet peut-il accompagner à distance ?",
        a: "Oui. Nous recevons en cabinet à **Perpignan** et accompagnons nos clients partout en France par visioconférence.",
      },
      {
        q: "Comment sont rémunérés les conseillers ?",
        a: "La rémunération est **transparente dès le premier échange**. Elle peut être sous forme d'honoraires, de commissions sur les produits souscrits, ou les deux — selon la mission.",
      },
    ],
    internalLinks: [
      { slug: "placements-epargne", label: "Placements & épargne" },
      { slug: "retraite-transmission", label: "Retraite & transmission" },
      { slug: "fiscalite-investissement", label: "Fiscalité & investissement" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Placements & épargne
  // ─────────────────────────────────────────────────────────────────────────
  "placements-epargne": {
    slug: "placements-epargne",
    meta: {
      title: "Placements & épargne à Perpignan | Lefèvre Conseil",
      description:
        "Assurance-vie, PER, PEA, SCPI : comparez et choisissez les placements adaptés à votre profil de risque et vos objectifs avec un cabinet indépendant.",
    },
    hero: {
      h1: "Placements et solutions d'épargne",
      subtitle: "Faire fructifier son argent, c'est choisir la bonne enveloppe — pas juste le meilleur taux affiché.",
      taglineHighlightAfter: ", c'est choisir la bonne enveloppe",
      intro:
        "Il existe des dizaines de façons d'épargner. **Assurance-vie**, **PER**, **PEA**, compte-titres, SCPI… Chaque support a ses règles fiscales, ses contraintes de liquidité et son niveau de risque. Nous vous aidons à comprendre les différences et à choisir selon *votre situation* — pas selon la mode.",
    },
    whyImportant: {
      title: "Le bon placement dépend de vous, pas d'un classement",
      paragraphs: [
        "Un placement « populaire » peut être mauvais pour vous. Ce qui compte : votre **horizon** *(dans combien de temps aurez-vous besoin de cet argent ?)*, votre **fiscalité** *(quel est votre taux marginal d'imposition ?)* et votre **tolérance au risque** *(dormez-vous bien si votre capital peut temporairement baisser ?).*",
        "L'autre piège : mettre tous ses œufs dans le même panier. Un livret A seul *ne protège pas de l'inflation* sur 20 ans. Une seule assurance-vie en fonds euros ne fait pas une stratégie patrimoniale. La **diversification** réduit le risque sans forcément réduire le rendement attendu.",
        "Notre rôle : vous expliquer chaque enveloppe en langage clair, comparer les contrats de notre réseau de partenaires, et proposer une allocation cohérente avec ce que vous souhaitez accomplir.",
      ],
    },
    accompaniment: { title: "", steps: [] },
    solutions: {
      title: "Les principales enveloppes d'épargne",
      intro: "Toutes ces solutions ne sont *pas forcément adaptées* à votre situation. Comparatif ci-dessous pour y voir clair.",
      items: [
        { title: "Assurance-vie", description: "L'enveloppe la plus **polyvalente** : épargne disponible, diversification (fonds euros + unités de compte), transmission hors succession. *Les UC ne garantissent pas le capital.*" },
        { title: "PER (Plan d'épargne retraite)", description: "Épargne **bloquée jusqu'à la retraite** (sauf exceptions). Intérêt fiscal potentiel à l'entrée selon votre **taux marginal d'imposition (TMI)**." },
        { title: "PEA (Plan d'épargne en actions)", description: "Investissement en actions européennes avec **fiscalité allégée après 5 ans**. Plafond : **150 000 €**. Convient aux profils avec appétit pour le risque et horizon long." },
        { title: "Contrat de capitalisation", description: "Proche de l'assurance-vie, utile dans certains **montages patrimoniaux** ou pour les personnes morales." },
        { title: "SCPI (pierre-papier)", description: "Investir dans l'immobilier *sans gérer un bien en direct*. Revenus réguliers potentiels, mais **risque de perte en capital** et illiquidité partielle." },
        { title: "Compte-titres", description: "Accès à un large univers de placements (actions, obligations, ETF). *Pas de plafond*, mais fiscalité standard sur les gains." },
      ],
    },
    comparison: {
      title: "Comparatif des principales enveloppes",
      columns: ["Assurance-vie", "PER", "PEA"],
      rows: [
        { label: "Disponibilité", cells: ["**Oui** à tout moment", "__Bloqué__ jusqu'à la retraite*", "Libre après **5 ans**"] },
        { label: "Avantage fiscal", cells: ["À la *sortie* (gains exonérés après 8 ans)", "À l'*entrée* (déduction selon TMI)", "À la *sortie* (exonération après 5 ans)"] },
        { label: "Transmission", cells: ["**Hors succession** sous conditions", "Succession classique", "Succession classique"] },
        { label: "Plafond", cells: ["*Aucun*", "Plafond annuel fixé", "**150 000 €**"] },
        { label: "Capital garanti ?", cells: ["*Fonds euros uniquement*", "*Fonds euros uniquement*", "**Non**"] },
      ],
    },
    forWho: {
      title: "Pour qui ?",
      profiles: ["Épargnants réguliers", "Investisseurs débutants", "Profils patrimoniaux établis", "Dirigeants", "Proches de la retraite"],
    },
    whyUs: { title: "", points: [] },
    summary: { title: "", bullets: [] },
    faq: [
      {
        q: "Quelle différence entre assurance-vie et PER ?",
        a: "L'**assurance-vie** est disponible à tout moment. Le **PER** est bloqué jusqu'à la retraite (sauf cas particuliers) mais peut offrir une *déduction fiscale à l'entrée* selon votre TMI. Les deux peuvent coexister.",
      },
      {
        q: "Les fonds euros sont-ils sans risque ?",
        a: "Ils garantissent le **capital investi** (sous conditions du contrat) mais les rendements ont baissé. Ils restent utiles comme *poche de sécurité*, pas comme seule stratégie.",
      },
      {
        q: "Qu'est-ce qu'une unité de compte ?",
        a: "C'est un support d'investissement dans une assurance-vie ou un PER qui investit dans des actions, de l'immobilier ou des obligations. La valeur **fluctue à la hausse comme à la baisse** — *le capital n'est pas garanti*.",
      },
      {
        q: "Peut-on investir sans risque et quand même mieux qu'un livret A ?",
        a: "Il n'existe pas de rendement *sans risque*. Les fonds euros offrent une **garantie en capital** mais avec des rendements faibles. Pour viser plus, il faut accepter une part de variabilité sur un horizon adapté.",
      },
      {
        q: "Comment choisir entre SCPI et immobilier direct ?",
        a: "La **SCPI** ne demande pas de gestion locative et offre une diversification géographique. L'**immobilier direct** offre plus de contrôle et d'effet de levier avec un crédit. Les deux ont des risques *différents* à évaluer.",
      },
      {
        q: "Peut-on ouvrir plusieurs enveloppes en même temps ?",
        a: "Oui. Combiner **assurance-vie**, **PER** et **PEA** est courant. L'enjeu est de définir le *rôle de chaque enveloppe* dans votre stratégie globale.",
      },
    ],
    internalLinks: [
      { slug: "gestion-de-patrimoine", label: "Gestion de patrimoine" },
      { slug: "retraite-transmission", label: "Retraite & transmission" },
      { slug: "fiscalite-investissement", label: "Fiscalité & investissement" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Retraite & transmission
  // ─────────────────────────────────────────────────────────────────────────
  "retraite-transmission": {
    slug: "retraite-transmission",
    meta: {
      title: "Préparer sa retraite et transmettre son patrimoine | Lefèvre Conseil",
      description:
        "PER, revenus complémentaires, donations, assurance-vie, démembrement : Lefèvre Conseil vous aide à préparer votre retraite et organiser la transmission de votre patrimoine à Perpignan.",
    },
    hero: {
      h1: "Préparer sa retraite et organiser la transmission",
      subtitle: "Plus on anticipe, plus on a de choix. Moins on attend, moins on en a.",
      taglineHighlightAfter: ", plus on a de choix",
      intro:
        "La retraite et la transmission sont les deux sujets qu'on reporte toujours à plus tard — jusqu'au jour où on n'a plus le temps de faire les *bons choix*. Lefèvre Conseil vous aide à **anticiper**, avec des projections concrètes et des solutions adaptées à votre situation.",
    },
    whyImportant: {
      title: "Anticiper, c'est garder le choix",
      paragraphs: [
        "À la retraite, la baisse des revenus est souvent *plus forte qu'anticipé* : régimes obligatoires en baisse tendancielle, dernières années de carrière pas toujours au maximum. Plus vous commencez tôt à constituer une **épargne retraite**, plus les versements peuvent être modestes et l'effort supportable.",
        "La transmission pose des questions délicates : protéger son conjoint, équilibrer les parts entre enfants, limiter la facture fiscale. *Plus on attend, moins on a d'options.* Une donation faite **15 ans avant** un décès n'a pas le même coût fiscal qu'une succession improvisée.",
        "Notre approche est **pédagogique et structurante** : on commence par vous expliquer comment ça fonctionne, on fait des projections, puis on étudie les solutions adaptées à votre famille et à vos objectifs.",
      ],
    },
    accompaniment: { title: "", steps: [] },
    solutions: {
      title: "Les solutions pour préparer et transmettre",
      intro: "Aucune solution n'est *universelle*. Nous étudions ce qui est pertinent pour vous après analyse complète de votre situation.",
      items: [
        { title: "PER (Plan d'épargne retraite)", description: "Constituer une épargne dédiée à la retraite. Sortie en capital ou en rente. **Potentiel avantage fiscal à l'entrée** pour les contribuables imposés à 30 % ou plus." },
        { title: "Assurance-vie", description: "Double rôle : **épargne disponible** pendant la vie active et **transmission hors succession** sous certaines conditions. L'outil central de la stratégie patrimoniale à long terme." },
        { title: "Revenus complémentaires", description: "SCPI, fonds diversifiés, immobilier locatif : construire un *flux de revenus* pour compléter la retraite obligatoire." },
        { title: "Donation", description: "Transmettre de son vivant pour profiter des **abattements fiscaux** : *100 000 € par enfant tous les 15 ans*." },
        { title: "Démembrement de propriété", description: "Séparer **nue-propriété** et **usufruit** pour transmettre un bien tout en conservant les revenus ou l'usage." },
        { title: "Organisation successorale", description: "Révision des **clauses bénéficiaires**, testament, protection du conjoint survivant — *souvent négligé, pourtant essentiel*." },
      ],
    },
    comparison: {
      title: "Fiscalité de la transmission : les abattements clés",
      columns: ["Bénéficiaire", "Abattement", "Renouvellement"],
      rows: [
        { label: "Donation / Succession", cells: ["**Enfant**", "**100 000 €**", "*Tous les 15 ans*"] },
        { label: "Donation / Succession", cells: ["Petit-enfant", "31 865 €", "*Tous les 15 ans*"] },
        { label: "Assurance-vie avant 70 ans", cells: ["**Tout bénéficiaire**", "**152 500 €**", "*Par bénéficiaire*"] },
        { label: "Assurance-vie après 70 ans", cells: ["Tout bénéficiaire", "30 500 € total", "*Une seule fois*"] },
        { label: "Conjoint survivant", cells: ["**Conjoint / PACS**", "**Exonération totale**", "—"] },
      ],
    },
    forWho: {
      title: "Pour qui ?",
      profiles: ["Actifs dès 40 ans", "Dirigeants", "Professions libérales", "Proches de la retraite", "Retraités", "Familles avec enfants"],
    },
    whyUs: { title: "", points: [] },
    summary: { title: "", bullets: [] },
    faq: [
      {
        q: "À quel âge faut-il commencer à préparer sa retraite ?",
        a: "Le plus tôt possible. Commencer à **35 ans** avec de petits versements réguliers est *bien plus efficace* que commencer à 55 ans avec de gros versements. Le temps est votre meilleur allié grâce aux **intérêts composés**.",
      },
      {
        q: "Comment estimer sa future pension de retraite ?",
        a: "Vous pouvez consulter votre **relevé de carrière** sur *info-retraite.fr*. Mais les projections dépendent aussi de vos revenus futurs et de l'évolution des régimes. Nous faisons cette simulation avec vous lors du bilan.",
      },
      {
        q: "Le PER vaut-il vraiment le coup ?",
        a: "Pour un contribuable imposé à **30 % ou plus**, souvent oui : vous déduisez les versements de votre revenu imposable aujourd'hui et payez l'impôt à la sortie, *souvent dans une tranche plus basse*. Mais ce n'est pas automatique — cela dépend de votre situation.",
      },
      {
        q: "Peut-on transmettre de son vivant sans s'appauvrir ?",
        a: "Oui. Le **démembrement** permet de donner la *nue-propriété* d'un bien à ses enfants tout en en conservant l'usage ou les loyers (*usufruit*). On organise la transmission *sans perdre les revenus*.",
      },
      {
        q: "Quelle est la fiscalité d'une succession ?",
        a: "Entre parents et enfants, les droits de succession s'appliquent après un abattement de **100 000 € par enfant**, renouvelable tous les **15 ans**. Au-delà, le taux progressif va de **5 % à 45 %**. L'assurance-vie permet de transmettre en dehors de ces règles, *sous conditions*.",
      },
      {
        q: "Faut-il un notaire pour préparer sa transmission ?",
        a: "Pour certains actes (**donation**, testament authentique), oui. Notre rôle est complémentaire : nous structurons la stratégie patrimoniale, les aspects juridiques étant *validés avec vos conseillers habituels*.",
      },
    ],
    internalLinks: [
      { slug: "placements-epargne", label: "Placements & épargne" },
      { slug: "gestion-de-patrimoine", label: "Gestion de patrimoine" },
      { slug: "fiscalite-investissement", label: "Fiscalité & investissement" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Fiscalité & investissement
  // ─────────────────────────────────────────────────────────────────────────
  "fiscalite-investissement": {
    slug: "fiscalite-investissement",
    meta: {
      title: "Optimisation fiscale et investissement patrimonial | Lefèvre Conseil",
      description:
        "Réduire ses impôts intelligemment : PER, assurance-vie, immobilier, SCPI, déficit foncier. Lefèvre Conseil analyse votre situation fiscale avant toute recommandation.",
    },
    hero: {
      h1: "Fiscalité et investissement patrimonial",
      subtitle: "Réduire ses impôts, oui — mais pas au prix d'un mauvais investissement.",
      taglineHighlightAfter: ", oui — mais pas au prix",
      intro:
        "Un **avantage fiscal ne fait pas un bon investissement**. Lefèvre Conseil commence toujours par analyser votre situation fiscale réelle avant de comparer les leviers disponibles. L'objectif : cohérence patrimoniale, *pas défiscalisation à tout prix*.",
    },
    whyImportant: {
      title: "Comprendre avant d'investir pour réduire ses impôts",
      paragraphs: [
        "Il existe **trois mécanismes fiscaux principaux** : la __déduction__ *(réduit le revenu imposable, donc l'impôt calculé dessus)*, la __réduction d'impôt__ *(s'applique directement sur le montant dû)* et le __crédit d'impôt__ *(peut être remboursé si supérieur à l'impôt)*. Ces trois notions sont souvent confondues, avec des conséquences *très différentes* selon votre **taux marginal d'imposition (TMI)**.",
        "Le deuxième point essentiel : **la fiscalité de sortie compte autant que l'avantage à l'entrée**. Un dispositif qui réduit vos impôts aujourd'hui peut générer une imposition importante dans 10 ans, ou *bloquer votre capital* dans un actif difficile à revendre.",
        "Notre méthode : analyser votre **feuille d'imposition**, simuler plusieurs scénarios, comparer les options en intégrant risque, liquidité et horizon — et *seulement ensuite*, proposer.",
      ],
    },
    accompaniment: { title: "", steps: [] },
    solutions: {
      title: "Les leviers fiscaux pouvant être étudiés",
      intro: "Ces solutions ne sont *pas adaptées à tous les profils*. Chacune fait l'objet d'une **analyse personnalisée**.",
      items: [
        { title: "PER", description: "Versements potentiellement **déductibles du revenu imposable** selon votre TMI et plafonds en vigueur. Particulièrement pertinent pour les contribuables *fortement imposés*." },
        { title: "Assurance-vie", description: "Pas d'avantage fiscal à l'entrée, mais **fiscalité allégée sur les gains après 8 ans** et transmission hors succession *sous conditions*." },
        { title: "Immobilier locatif", description: "**Déficit foncier**, LMNP *(amortissement)*, statut LMP : chaque régime a ses règles, ses plafonds et ses contraintes de gestion. *Étude au cas par cas indispensable.*" },
        { title: "SCPI", description: "Pierre-papier avec revenus potentiellement réguliers. La **fiscalité des revenus fonciers** s'applique — à intégrer dans votre tranche." },
        { title: "Démembrement de propriété", description: "Acheter la **nue-propriété** d'un bien (moins cher) pour en récupérer la pleine propriété à terme. Intérêt fiscal et patrimonial *selon la situation*." },
        { title: "FIP / FCPI", description: "**Réduction d'impôt** sur le revenu en échange d'un investissement dans des PME. *Risque élevé en capital*, horizon long — à étudier avec prudence." },
      ],
    },
    comparison: {
      title: "Déduction vs réduction vs crédit d'impôt",
      columns: ["Déduction", "Réduction", "Crédit d'impôt"],
      rows: [
        { label: "Comment ça marche ?", cells: ["Réduit le **revenu imposable**", "Enlève directement de **l'impôt dû**", "Enlève de l'impôt, *remboursé* si excédent"] },
        { label: "Exemple", cells: ["**PER** (versements)", "Don à une association", "Frais de garde d'enfant"] },
        { label: "Dépend de votre TMI ?", cells: ["**Oui** — plus vous êtes imposé, plus c'est avantageux", "*Non* — identique quelle que soit la tranche", "*Non* — identique quelle que soit la tranche"] },
        { label: "Si impôt = 0 ?", cells: ["*Aucun effet*", "*Aucun effet*", "**Remboursé** par le fisc"] },
      ],
    },
    forWho: {
      title: "Pour qui ?",
      profiles: ["Contribuables imposés à 30 % ou plus", "Dirigeants", "Professions libérales", "Propriétaires fonciers", "Investisseurs immobiliers", "Entreprises"],
    },
    whyUs: { title: "", points: [] },
    summary: { title: "", bullets: [] },
    faq: [
      {
        q: "Quelle différence entre déduction et réduction d'impôt ?",
        a: "Une **déduction** réduit votre *revenu imposable* (vous payez moins d'impôt selon votre taux marginal). Une **réduction** s'enlève directement de l'*impôt dû* — elle est donc identique quelle que soit votre tranche.",
      },
      {
        q: "Le PER réduit-il vraiment les impôts ?",
        a: "Potentiellement, oui. Si vous êtes imposé à **30 % ou plus**, chaque euro versé sur un PER peut *réduire votre impôt de 30 centimes*. Mais cette somme sera **imposée à la sortie** — d'où l'importance de simuler les deux côtés.",
      },
      {
        q: "Vaut-il mieux investir dans l'immobilier locatif ou les placements financiers ?",
        a: "Tout dépend de votre tranche, de votre capacité à gérer un bien et de votre liquidité. L'immobilier offre des leviers puissants (**déficit foncier**, LMNP) mais *immobilise du capital*. Les placements sont plus *liquides*. Les deux peuvent coexister.",
      },
      {
        q: "La défiscalisation est-elle toujours intéressante ?",
        a: "Non. Un avantage fiscal *ne compense pas* un actif peu rentable, illiquide ou difficile à revendre. La **rentabilité nette** (après fiscalité de sortie) est le critère décisif.",
      },
      {
        q: "Qu'est-ce que le déficit foncier ?",
        a: "C'est un mécanisme qui permet de **déduire les charges et travaux** d'un bien locatif de vos revenus fonciers, et partiellement de votre revenu global si les charges dépassent les loyers. Utile pour les propriétaires soumis aux tranches *élevées*.",
      },
      {
        q: "Pourquoi analyser ma feuille d'imposition avant d'investir ?",
        a: "Parce que l'intérêt d'un levier fiscal dépend directement de votre **tranche marginale**. Une réduction d'impôt a plus de valeur si vous payez **45 %** que si vous payez **11 %**. *Sans cette analyse, les recommandations peuvent être inadaptées.*",
      },
    ],
    internalLinks: [
      { slug: "gestion-de-patrimoine", label: "Gestion de patrimoine" },
      { slug: "placements-epargne", label: "Placements & épargne" },
      { slug: "investissement-art", label: "Investissement dans l'art" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Prévoyance, santé & assurance de prêt
  // ─────────────────────────────────────────────────────────────────────────
  "prevoyance-sante-assurance-pret": {
    slug: "prevoyance-sante-assurance-pret",
    meta: {
      title: "Prévoyance, santé et assurance emprunteur | Lefèvre Conseil",
      description:
        "Protégez vos revenus et votre famille avec des garanties prévoyance, complémentaire santé et assurance de prêt adaptées. Comparatif indépendant à Perpignan.",
    },
    hero: {
      h1: "Prévoyance, complémentaire santé et assurance de prêt",
      subtitle: "Se protéger, c'est protéger ce qu'on a construit — revenus, famille, projet immobilier.",
      taglineHighlightAfter: ", c'est protéger ce qu'on a construit",
      intro:
        "Un arrêt de travail prolongé, un décès ou une invalidité peuvent fragiliser un foyer *bien plus vite* qu'une mauvaise année boursière. Pourtant, la **prévoyance** reste souvent le parent pauvre de la stratégie patrimoniale. Nous l'intégrons dès le départ.",
    },
    whyImportant: {
      title: "La protection : le fondement avant l'investissement",
      paragraphs: [
        "Avant d'investir, il faut **sécuriser** : ses revenus en cas d'aléa *(arrêt maladie, accident, décès)*, sa santé pour ne pas se retrouver exposé à des dépenses imprévues, et son emprunt pour que le projet immobilier ne devienne pas un risque pour sa famille.",
        "Beaucoup de personnes disposent déjà de contrats — via leur employeur, leur banque ou leur mutuelle — mais sans vraiment savoir *ce qu'ils couvrent*, à quel niveau et à quel prix. Une révision régulière est souvent source d'**économies et d'amélioration des garanties**.",
        "Pour les **indépendants**, les **dirigeants** et les **professions libérales**, la situation est encore plus critique : sans protection adaptée, un arrêt de travail peut remettre en cause *toute l'activité*.",
      ],
    },
    accompaniment: { title: "", steps: [] },
    solutions: {
      title: "Ce que nous pouvons étudier et comparer",
      intro: "Nous analysons vos **contrats existants**, identifions les lacunes et comparons les offres de notre réseau de partenaires.",
      items: [
        { title: "Prévoyance individuelle", description: "Garantit un **revenu de remplacement** en cas d'arrêt de travail, d'invalidité ou de décès. *Indispensable* pour les indépendants et dirigeants qui n'ont pas de maintien de salaire automatique." },
        { title: "Prévoyance collective", description: "Mise en place ou optimisation des garanties prévoyance pour les salariés d'une entreprise. **Obligation légale** dans beaucoup de secteurs." },
        { title: "Complémentaire santé", description: "Remboursement des frais non pris en charge par la Sécu. La bonne mutuelle dépend de vos besoins réels (**optique**, **dentaire**, **hospitalisation**) et de votre budget." },
        { title: "Assurance emprunteur", description: "Garantit le remboursement de votre crédit immobilier en cas de décès, d'invalidité ou d'incapacité. **Changer d'assurance emprunteur** est possible et peut générer des économies *significatives*." },
        { title: "Assurance de prêt professionnel", description: "Protection spécifique pour les emprunts liés à l'activité professionnelle *(rachat de parts, investissement immobilier professionnel)*." },
      ],
    },
    comparison: {
      title: "Mutuelle santé vs Prévoyance : quelle différence ?",
      columns: ["Mutuelle santé", "Prévoyance"],
      rows: [
        { label: "Ce qu'elle couvre", cells: ["Les **frais de santé** (consultations, médicaments, optique, dentaire)", "La **perte de revenus** (arrêt, invalidité, décès)"] },
        { label: "Se déclenche quand ?", cells: ["Lors de *soins médicaux*", "En cas d'*aléa de vie grave*"] },
        { label: "Complète…", cells: ["Le remboursement **Sécurité sociale**", "Vos **revenus** si vous ne pouvez plus travailler"] },
        { label: "Obligatoire ?", cells: ["**Oui** pour les salariés (loi ANI)", "Non, mais *fortement recommandé*"] },
        { label: "Cas critique", cells: ["Hospitalisation ou soins coûteux", "Arrêt de travail **longue durée**"] },
      ],
    },
    forWho: {
      title: "Pour qui ?",
      profiles: ["Particuliers", "Familles avec emprunt immobilier", "Indépendants", "Dirigeants", "Professions libérales", "Seniors"],
    },
    whyUs: { title: "", points: [] },
    summary: { title: "", bullets: [] },
    faq: [
      {
        q: "Quelle différence entre prévoyance et mutuelle santé ?",
        a: "La **mutuelle** rembourse vos frais de santé (consultations, médicaments, optique, dentaire). La **prévoyance** vous verse un *revenu de remplacement* si vous ne pouvez plus travailler (arrêt, invalidité, décès). Ce sont deux besoins *très différents*.",
      },
      {
        q: "Suis-je obligé de garder l'assurance emprunteur de ma banque ?",
        a: "Non. Depuis la **loi Lemoine** (2022), vous pouvez changer d'assurance emprunteur *à tout moment*, sans frais, à condition que les garanties du nouveau contrat soient **équivalentes** à celles exigées par votre banque.",
      },
      {
        q: "Combien peut-on économiser en changeant d'assurance de prêt ?",
        a: "Selon votre âge et le montant de votre emprunt, les économies peuvent aller de quelques centaines à **plusieurs milliers d'euros** sur la durée totale du crédit. Une comparaison s'impose *systématiquement*.",
      },
      {
        q: "La prévoyance est-elle obligatoire pour un indépendant ?",
        a: "Non, mais elle est **fortement recommandée**. Un indépendant sans prévoyance qui subit un arrêt de travail de 6 mois n'a généralement que les indemnités journalières du RSI, *très inférieures* à ses revenus habituels.",
      },
      {
        q: "Qu'est-ce qu'une prévoyance pour dirigeant ?",
        a: "Un contrat qui couvre le **chef d'entreprise** en cas d'arrêt de travail ou d'invalidité, avec des garanties adaptées à sa *rémunération réelle* et aux **charges de son activité**.",
      },
      {
        q: "Comment savoir si mes contrats actuels sont bien calibrés ?",
        a: "En faisant un **audit de vos garanties existantes**. Nous examinons vos contrats actuels, identifions les *doublons*, les *lacunes* et les *surcoûts*, et vous proposons des pistes d'optimisation.",
      },
    ],
    internalLinks: [
      { slug: "gestion-de-patrimoine", label: "Gestion de patrimoine" },
      { slug: "retraite-transmission", label: "Retraite & transmission" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Investissement dans l'art
  // ─────────────────────────────────────────────────────────────────────────
  "investissement-art": {
    slug: "investissement-art",
    meta: {
      title: "Investir dans l'art en entreprise | Lefèvre Conseil",
      description:
        "Leasing d'œuvres d'art pour entreprises : valorisez vos locaux, étudiez le cadre fiscal et constituez un patrimoine artistique. Accompagnement clé en main à Perpignan.",
    },
    hero: {
      h1: "Investir dans l'art en entreprise",
      subtitle: "Valoriser ses locaux, développer son image et étudier un avantage fiscal méconnu.",
      taglineHighlightAfter: ", développer son image",
      intro:
        "Une entreprise peut acquérir ou louer des œuvres d'art — et dans certains cas, **déduire les dépenses de son résultat imposable**. Lefèvre Conseil accompagne les entreprises dans cette démarche : sélection des œuvres, montage du leasing et analyse du cadre fiscal *avec vos conseils habituels*.",
    },
    whyImportant: {
      title: "L'art en entreprise : esthétique, image et fiscalité",
      paragraphs: [
        "Exposer une œuvre d'art dans ses locaux professionnels n'est pas réservé aux grandes entreprises. Une TPE, un cabinet médical ou un commerce peuvent **valoriser leur espace d'accueil**, créer une atmosphère distinctive et signaler une attention portée à la qualité — des éléments qui pèsent dans la perception *clients et collaborateurs*.",
        "Du côté fiscal, les entreprises soumises à l'IS peuvent, sous conditions, déduire les achats ou loyers d'œuvres d'**artistes vivants** de leur bénéfice imposable. Ce mécanisme est encadré *(plafonds, obligations d'exposition)* et nécessite une vérification avec votre expert-comptable. *Nous ne promettons pas une déductibilité systématique : nous l'étudions au cas par cas.*",
        "Le **leasing d'œuvres d'art** est une alternative à l'achat : vous exposez des pièces sélectionnées avec des partenaires spécialisés, sur des *mensualités maîtrisées*, sans immobiliser votre trésorerie.",
      ],
    },
    accompaniment: { title: "", steps: [] },
    solutions: {
      title: "Ce que nous proposons",
      items: [
        { title: "Audit & conseil", description: "Analyse de votre **situation fiscale** et de vos locaux pour identifier la pertinence et le cadre applicable." },
        { title: "Sélection des œuvres", description: "Avec nos partenaires galeries et artistes, nous vous aidons à choisir des pièces cohérentes avec votre **image de marque** et vos goûts." },
        { title: "Leasing d'art", description: "Mise en place d'un **contrat de location** avec option d'achat. Mensualités maîtrisées, œuvre livrée et assurée." },
        { title: "Acquisition directe", description: "Pour les entreprises qui souhaitent constituer une **collection**, nous structurons l'achat avec analyse du traitement comptable et fiscal." },
        { title: "Fiscalité & comptabilité", description: "Étude des conditions de **déductibilité** en lien avec votre expert-comptable. *Nous ne travaillons pas seuls sur ce volet.*" },
      ],
    },
    comparison: {
      title: "Leasing vs Achat direct : ce qu'il faut savoir",
      columns: ["Leasing d'art", "Achat direct"],
      rows: [
        { label: "Trésorerie", cells: ["**Mensualités** maîtrisées", "*Capital immobilisé* en une fois"] },
        { label: "Propriété", cells: ["Reste chez le bailleur *(option d'achat possible)*", "**Propriété immédiate**"] },
        { label: "Fiscalité", cells: ["**Loyers potentiellement déductibles** selon montage", "**Amortissement** possible sur plusieurs années"] },
        { label: "Flexibilité", cells: ["*Changement d'œuvre* possible selon contrat", "Œuvre dans le patrimoine de l'entreprise"] },
        { label: "Idéal pour", cells: ["TPE/PME souhaitant *tester* ou préserver la trésorerie", "Entreprises constituant une **collection durable**"] },
      ],
    },
    forWho: {
      title: "Pour qui ?",
      profiles: ["TPE / PME", "Professions libérales", "Cabinets médicaux et juridiques", "Commerces premium", "Sièges sociaux", "Hôtels & restaurants"],
    },
    whyUs: { title: "", points: [] },
    summary: { title: "", bullets: [] },
    faq: [
      {
        q: "Une entreprise peut-elle déduire l'achat d'œuvres d'art ?",
        a: "Oui, sous conditions : l'œuvre doit être d'un **artiste vivant**, exposée dans les locaux ouverts au public *(salariés, clients)*, et le montant annuel est plafonné à **5 ‰ du chiffre d'affaires HT**. Cette déductibilité est *étalée sur 5 ans*.",
      },
      {
        q: "Qu'est-ce que le leasing d'œuvres d'art ?",
        a: "Un contrat de location *(avec ou sans option d'achat)* qui permet à une entreprise d'exposer une ou plusieurs œuvres moyennant des **mensualités**, sans payer le prix total en une fois. L'œuvre est *assurée et entretenue* selon les termes du contrat.",
      },
      {
        q: "Comment sont sélectionnées les œuvres ?",
        a: "En fonction de vos **goûts**, de l'ambiance de vos locaux, de votre **budget** et de vos objectifs *(image, collection, fiscalité)*. Nous travaillons avec des galeries et artistes partenaires pour vous proposer une sélection adaptée.",
      },
      {
        q: "Ce dispositif est-il adapté aux petites entreprises ?",
        a: "Oui. Des solutions existent à partir de quelques centaines d'euros par mois en leasing. L'enjeu n'est pas la taille de l'entreprise mais la *cohérence du projet* avec ses objectifs et son image.",
      },
      {
        q: "Faut-il un expert-comptable pour valider le cadre fiscal ?",
        a: "**Absolument.** Nous vous aidons à structurer le projet et à comprendre les mécanismes, mais la **validation comptable et fiscale définitive** revient à votre expert-comptable.",
      },
      {
        q: "Peut-on acquérir l'œuvre à la fin du leasing ?",
        a: "Dans certains contrats, oui. Une **option d'achat** est prévue à la signature, pour une *valeur résiduelle définie à l'avance*. C'est un point à négocier avec le partenaire selon vos intentions.",
      },
    ],
    internalLinks: [
      { slug: "fiscalite-investissement", label: "Fiscalité & investissement" },
      { slug: "gestion-de-patrimoine", label: "Gestion de patrimoine" },
    ],
  },
};

export function getServicePremiumContent(slug: string): ServicePremiumContent | null {
  if (slug in SERVICE_PREMIUM_CONTENTS) {
    return SERVICE_PREMIUM_CONTENTS[slug as ServiceSlug];
  }
  return null;
}
