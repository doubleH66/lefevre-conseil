import type { ServiceSlug } from "@/lib/content/services";
import type { ServicePremiumContent } from "@/lib/content/service-premium-types";
import {
  DEFAULT_ACCOMPANIMENT_STEPS,
  DEFAULT_ACCOMPANIMENT_TITLE,
  DEFAULT_WHY_US_POINTS,
  DEFAULT_WHY_US_TITLE,
} from "@/lib/content/service-premium-shared";

const whyUs = () => ({
  title: DEFAULT_WHY_US_TITLE,
  points: [...DEFAULT_WHY_US_POINTS],
});

const accompaniment = (title = DEFAULT_ACCOMPANIMENT_TITLE) => ({
  title,
  steps: [...DEFAULT_ACCOMPANIMENT_STEPS],
});

export const SERVICE_PREMIUM_CONTENTS: Record<ServiceSlug, ServicePremiumContent> = {
  "gestion-de-patrimoine": {
    slug: "gestion-de-patrimoine",
    meta: {
      title: "Gestion de patrimoine à Perpignan | Lefèvre Conseil",
      description:
        "Cabinet indépendant à Perpignan, Lefèvre Conseil vous accompagne pour organiser, développer, protéger et transmettre votre patrimoine.",
    },
    hero: {
      h1: "Gestion de patrimoine à Perpignan",
      subtitle:
        "Un accompagnement indépendant pour organiser, développer, protéger et transmettre votre patrimoine.",
      taglineHighlightAfter: ", pour organiser",
      intro:
        "La gestion de patrimoine ne consiste pas à vendre un produit, mais à construire une stratégie cohérente selon votre situation familiale, professionnelle et fiscale. Depuis Perpignan, Lefèvre Conseil vous accompagne avec clarté et indépendance, en France entière.",
    },
    whyImportant: {
      title: "Un accompagnement patrimonial global",
      paragraphs: [
        "Sans vision d’ensemble, les décisions s’accumulent : un placement ici, un contrat là, un achat immobilier sans lien avec le reste. Les risques sont réels : fiscalité mal anticipée, liquidités insuffisantes, transmission non préparée ou niveau de risque mal maîtrisé.",
        "Un conseil patrimonial indépendant part de votre situation réelle : revenus, charges, projets, horizon et tolérance au risque. L’objectif n’est pas le « meilleur produit », mais la cohérence de l’ensemble selon vos objectifs patrimoniaux.",
        "Que vous soyez particulier, dirigeant ou profession libérale, anticiper permet d’éviter les décisions prises sous contrainte et de garder la maîtrise de votre patrimoine.",
      ],
    },
    accompaniment: accompaniment("Notre méthode d’accompagnement"),
    solutions: {
      title: "Les solutions pouvant être étudiées",
      intro:
        "Après analyse de votre bilan patrimonial, nous pouvons étudier notamment les pistes suivantes — toujours selon votre profil et votre horizon.",
      items: [
        {
          title: "Assurance-vie",
          description: "Épargne long terme, transmission et diversification, selon votre situation fiscale.",
        },
        {
          title: "PER",
          description: "Préparation de la retraite avec un intérêt fiscal potentiel, après étude de votre TMI et de vos objectifs.",
        },
        {
          title: "Placements financiers",
          description: "PEA, compte-titres, fonds ou unités de compte, en lien avec votre profil de risque.",
        },
        {
          title: "Immobilier",
          description: "Résidence principale, locatif ou pierre-papier, dans une logique patrimoniale globale.",
        },
        {
          title: "Prévoyance & protection",
          description: "Sécuriser vos revenus et vos proches dans une stratégie cohérente.",
        },
        {
          title: "Transmission & fiscalité",
          description: "Organisation familiale et optimisation, sans promesse de défiscalisation miracle.",
        },
      ],
    },
    forWho: {
      title: "Pour quels profils ?",
      profiles: [
        "Particuliers",
        "Familles",
        "Dirigeants",
        "Indépendants",
        "Professions libérales",
        "Propriétaires",
        "Investisseurs",
      ],
    },
    whyUs: whyUs(),
    summary: {
      title: "À retenir",
      bullets: [
        "La gestion de patrimoine vise une stratégie globale, pas la vente d’un produit isolé.",
        "Lefèvre Conseil est un cabinet indépendant basé à Perpignan, avec plus de 19 ans d’expertise.",
        "Chaque recommandation dépend de votre profil, de votre fiscalité et de votre horizon de placement.",
        "Le point d’entrée est le bilan patrimonial : analyse, priorités, puis solutions adaptées.",
      ],
    },
    faq: [
      {
        q: "Pourquoi faire appel à un conseiller en gestion de patrimoine ?",
        a: "Pour structurer vos décisions, éviter les incohérences entre placements, immobilier, retraite et transmission, et bénéficier d’un regard indépendant sur les solutions du marché.",
      },
      {
        q: "Quel patrimoine minimum faut-il avoir pour consulter ?",
        a: "Il n’y a pas de seuil absolu : l’important est d’avoir des objectifs clairs (épargne, retraite, protection, transmission) et le souhait d’être accompagné. Nous étudions chaque demande au cas par cas.",
      },
      {
        q: "Comment se déroule un bilan patrimonial ?",
        a: "Après un premier échange, nous analysons votre situation (famille, revenus, patrimoine, fiscalité, projets). Nous identifions vos priorités et vous présentons des pistes personnalisées, sans engagement immédiat.",
      },
      {
        q: "Lefèvre Conseil accompagne-t-il aussi les dirigeants ?",
        a: "Oui : dirigeants, indépendants et professions libérales font partie de nos profils types, avec une attention particulière à la rémunération, la protection et la transmission.",
      },
      {
        q: "Le cabinet peut-il accompagner à distance ?",
        a: "Oui. Nous recevons à Perpignan et accompagnons nos clients partout en France par visioconférence et échanges sécurisés.",
      },
      {
        q: "Les recommandations sont-elles personnalisées ?",
        a: "Toujours. Aucune solution n’est proposée sans analyse préalable ; nous n’affichons pas de rendement garanti ni de conseil universel.",
      },
    ],
    internalLinks: [
      { slug: "placements-epargne", label: "Placements & épargne" },
      { slug: "retraite-transmission", label: "Retraite & transmission" },
      { slug: "fiscalite-investissement", label: "Fiscalité & investissement" },
    ],
  },

  "placements-epargne": {
    slug: "placements-epargne",
    meta: {
      title: "Placements & épargne à Perpignan | Lefèvre Conseil",
      description:
        "Assurance-vie, PER, épargne long terme, placements financiers : Lefèvre Conseil vous aide à choisir des solutions adaptées.",
    },
    hero: {
      h1: "Placements financiers et solutions d’épargne",
      subtitle:
        "Faites fructifier votre capital avec des solutions adaptées à vos objectifs, votre horizon et votre profil de risque.",
      taglineHighlightAfter: ", avec des solutions",
      intro:
        "Assurance-vie, PER, PEA ou contrat de capitalisation : le bon support dépend de votre âge, de votre fiscalité et de vos projets. À Perpignan, nous vous aidons à comparer, comprendre et choisir — sans promesse de performance.",
    },
    whyImportant: {
      title: "Choisir les bons placements selon votre profil",
      paragraphs: [
        "Placer son épargne sans méthode expose à un double risque : sous-performance par rapport à l’inflation, ou prise de risque excessive par manque de diversification.",
        "Chaque enveloppe a ses règles fiscales, ses horizons et ses contraintes de liquidité. L’assurance-vie n’a pas le même rôle qu’un PER ou qu’un PEA : l’enjeu est de les articuler dans une stratégie patrimoniale cohérente.",
        "Nous expliquons les options en langage clair, pour que vous puissiez décider en connaissance de cause, selon votre situation.",
      ],
    },
    accompaniment: accompaniment(),
    solutions: {
      title: "Les principales solutions d’épargne étudiées",
      items: [
        {
          title: "Assurance-vie",
          description: "Polyvalence patrimoniale : épargne, transmission, diversification.",
        },
        { title: "PER", description: "Épargne retraite et optimisation fiscale potentielle." },
        {
          title: "Contrat de capitalisation",
          description: "Utile notamment dans certains montages patrimoniaux ou transmission.",
        },
        { title: "PEA", description: "Investissement en actions avec fiscalité dédiée après 5 ans." },
        { title: "Compte-titres", description: "Souplesse et large univers de supports." },
        {
          title: "SCPI / pierre-papier",
          description: "Diversification immobilière indirecte, selon profil et horizon.",
        },
        {
          title: "Fonds, obligations, unités de compte",
          description: "Allocation selon profil de risque et horizon de placement.",
        },
      ],
    },
    forWho: {
      title: "Pour qui ?",
      profiles: [
        "Épargnants réguliers",
        "Investisseurs débutants",
        "Profils patrimoniaux établis",
        "Dirigeants",
        "Futurs retraités",
      ],
    },
    whyUs: whyUs(),
    summary: {
      title: "À retenir",
      bullets: [
        "Le choix du placement dépend de l’horizon, de la fiscalité et du niveau de risque accepté.",
        "L’assurance-vie et le PER répondent à des objectifs différents : nous vous aidons à les distinguer.",
        "Aucun placement financier n’est garanti en capital ou en performance.",
        "Diversifier permet de mieux piloter le risque sur le long terme.",
      ],
    },
    faq: [
      {
        q: "Quel placement choisir pour faire fructifier son épargne ?",
        a: "Cela dépend de votre horizon, de votre fiscalité et de votre tolérance au risque. Un bilan patrimonial permet de comparer assurance-vie, PER, PEA et autres supports de façon structurée.",
      },
      {
        q: "Quelle différence entre assurance-vie et PER ?",
        a: "L’assurance-vie est une enveloppe patrimoniale polyvalente (épargne, transmission). Le PER est orienté retraite, avec des règles de sortie et un intérêt fiscal potentiel sur les versements, selon votre situation.",
      },
      {
        q: "Peut-on investir sans prendre trop de risques ?",
        a: "Oui, avec des supports plus prudents et une diversification adaptée. Le niveau de risque est défini avec vous, sans promesse de rendement garanti.",
      },
      {
        q: "Pourquoi diversifier ses placements ?",
        a: "Pour ne pas dépendre d’un seul support, d’un seul secteur ou d’une seule zone géographique, et mieux absorber les cycles de marché.",
      },
      {
        q: "Les placements financiers sont-ils garantis ?",
        a: "Non : les supports en unités de compte fluctuent. Seuls certains fonds euros offrent une garantie en capital sous conditions du contrat, sans garantie de rendement futur.",
      },
      {
        q: "Comment Lefèvre Conseil sélectionne les solutions ?",
        a: "Après analyse de votre profil, nous comparons les contrats et supports auprès de notre réseau de partenaires, en toute transparence sur les frais et les limites.",
      },
    ],
    internalLinks: [
      { slug: "gestion-de-patrimoine", label: "Gestion de patrimoine" },
      { slug: "retraite-transmission", label: "Retraite & transmission" },
      { slug: "fiscalite-investissement", label: "Fiscalité & investissement" },
    ],
  },

  "retraite-transmission": {
    slug: "retraite-transmission",
    meta: {
      title: "Retraite & transmission à Perpignan | Lefèvre Conseil",
      description:
        "Préparez votre retraite, créez des revenus complémentaires et organisez la transmission de votre patrimoine avec Lefèvre Conseil.",
    },
    hero: {
      h1: "Préparer sa retraite et transmettre son patrimoine",
      subtitle:
        "Anticipez votre avenir, protégez vos proches et organisez la transmission de votre patrimoine dans les meilleures conditions.",
      taglineHighlightAfter: ", protégez vos proches",
      intro:
        "La baisse des revenus à la retraite et les enjeux de succession concernent tôt ou tard la plupart des ménages. Nous vous aidons à anticiper, sans décisions prises dans l’urgence, depuis Perpignan et partout en France.",
    },
    whyImportant: {
      title: "Préparer sa retraite le plus tôt possible",
      paragraphs: [
        "Les régimes obligatoires évoluent ; les revenus futurs peuvent être inférieurs à vos dépenses actuelles. Plus l’anticipation est précoce, plus les leviers (épargne, PER, immobilier locatif, assurance-vie) sont efficaces.",
        "La transmission pose des questions familiales et fiscales sensibles : protéger le conjoint, préparer les enfants, organiser le patrimoine sans conflit. Reporter ces sujets augmente le stress et limite les options.",
        "Notre rôle est pédagogique et structurant : projections, comparaison des outils, mise en œuvre progressive.",
      ],
    },
    accompaniment: accompaniment("Notre accompagnement retraite et transmission"),
    solutions: {
      title: "Les solutions pour préparer votre retraite et transmettre",
      items: [
        { title: "PER", description: "Constituer une épargne retraite avec sortie en capital ou rente selon cadre applicable." },
        {
          title: "Assurance-vie",
          description: "Épargne long terme et transmission via clauses bénéficiaires, selon votre organisation familiale.",
        },
        {
          title: "Épargne & placements revenus",
          description: "Supports générateurs de revenus complémentaires à horizon long.",
        },
        {
          title: "Immobilier",
          description: "Stratégie locative ou patrimoniale pour compléter les revenus.",
        },
        {
          title: "Donation & démembrement",
          description: "Outils d’anticipation successorale, étudiés avec vos conseils habituels si besoin.",
        },
        {
          title: "Organisation patrimoniale",
          description: "Vision globale pour protéger le conjoint et les héritiers.",
        },
      ],
    },
    forWho: {
      title: "Une stratégie adaptée à chaque étape de vie",
      profiles: [
        "Actifs",
        "Dirigeants",
        "Proches de la retraite",
        "Retraités",
        "Familles avec enfants",
      ],
    },
    whyUs: whyUs(),
    summary: {
      title: "À retenir",
      bullets: [
        "Anticiper la retraite permet de créer des revenus complémentaires plus sereinement.",
        "La transmission se prépare : assurance-vie, donations et organisation patrimoniale sont des leviers à étudier tôt.",
        "Le PER n’est pas adapté à tous les profils : nous analysons votre TMI et vos objectifs avant recommandation.",
        "Lefèvre Conseil accompagne à Perpignan et à distance, avec une approche indépendante.",
      ],
    },
    faq: [
      {
        q: "Quand faut-il commencer à préparer sa retraite ?",
        a: "Le plus tôt possible. Dès les premières années d’activité, même de petits versements réguliers peuvent faire une différence sur le long terme grâce à l’effet du temps.",
      },
      {
        q: "Comment créer des revenus complémentaires ?",
        a: "En combinant épargne retraite (PER), assurance-vie, placements orientés revenus et, selon le profil, immobilier. La combinaison dépend de votre situation après analyse.",
      },
      {
        q: "Le PER est-il adapté à tous les profils ?",
        a: "Non. Il est particulièrement pertinent pour certains niveaux d’imposition et horizons longs. Nous vérifions la cohérence avec vos autres enveloppes avant tout versement.",
      },
      {
        q: "Comment préparer la transmission de son patrimoine ?",
        a: "Par une vision d’ensemble : clauses bénéficiaires, donations, démembrement éventuel et organisation des actifs. Chaque famille a des priorités différentes.",
      },
      {
        q: "L’assurance-vie est-elle utile pour transmettre ?",
        a: "Oui, c’est souvent un outil central pour transmettre hors succession sous certaines conditions. Nous adaptons les clauses à votre situation familiale.",
      },
      {
        q: "Pourquoi anticiper sa succession ?",
        a: "Pour protéger le conjoint, clarifier les volontés, limiter les tensions et optimiser la fiscalité lorsque c’est possible, sans promettre un résultat systématique.",
      },
    ],
    internalLinks: [
      { slug: "placements-epargne", label: "Placements & épargne" },
      { slug: "gestion-de-patrimoine", label: "Gestion de patrimoine" },
      { slug: "fiscalite-investissement", label: "Fiscalité & investissement" },
    ],
  },

  "fiscalite-investissement": {
    slug: "fiscalite-investissement",
    meta: {
      title: "Fiscalité & investissement à Perpignan | Lefèvre Conseil",
      description:
        "Optimisation fiscale, investissement immobilier, PER, SCPI, démembrement : construisez une stratégie cohérente et adaptée.",
    },
    hero: {
      h1: "Optimisation fiscale et investissement patrimonial",
      subtitle:
        "Réduisez votre fiscalité intelligemment, sans perdre de vue la cohérence, le risque et la rentabilité de votre stratégie.",
      taglineHighlightAfter: ", sans perdre de vue",
      intro:
        "Une réduction d’impôt ne suffit pas à faire un bon investissement. Nous vous aidons à construire une stratégie patrimoniale où la fiscalité est un levier parmi d’autres — jamais une promesse miracle.",
    },
    whyImportant: {
      title: "Optimiser sa fiscalité sans se tromper de priorité",
      paragraphs: [
        "Choisir un dispositif uniquement pour sa défiscalisation peut conduire à un actif peu rentable, illiquide ou difficile à revendre. La fiscalité de sortie compte autant que l’avantage initial.",
        "L’objectif reste la cohérence patrimoniale : maîtrise du risque, horizon de détention, flux de trésorerie et adéquation avec vos projets de vie.",
        "Nous analysons votre imposition actuelle, simulons des scénarios et comparons les options avant toute mise en place.",
      ],
    },
    accompaniment: accompaniment("Notre méthode d’analyse fiscale"),
    solutions: {
      title: "Les solutions fiscales pouvant être étudiées",
      items: [
        { title: "PER", description: "Réduction d’impôt potentielle sur les versements, selon plafonds et situation." },
        { title: "Assurance-vie", description: "Fiscalité dédiée à la transmission et à la sortie selon ancienneté." },
        { title: "Immobilier locatif", description: "LMNP, LMP, déficit foncier : étude au cas par cas." },
        { title: "SCPI", description: "Pierre-papier et revenus complémentaires, avec risque de marché." },
        { title: "Démembrement", description: "Anticipation successorale et optimisation, selon validation juridique." },
        { title: "FIP / FCPI", description: "Supports à étudier avec prudence sur le risque et l’horizon." },
        {
          title: "Investissement dans l’art (entreprises)",
          description: "Solution esthétique et fiscale pour les sociétés, via notre expertise dédiée.",
        },
      ],
    },
    forWho: {
      title: "Pour qui ?",
      profiles: [
        "Particuliers imposés",
        "Dirigeants",
        "Professions libérales",
        "Propriétaires fonciers",
        "Investisseurs immobiliers",
        "Entreprises",
      ],
    },
    whyUs: whyUs(),
    summary: {
      title: "À retenir",
      bullets: [
        "Réduire ses impôts intelligemment, c’est d’abord investir dans une stratégie cohérente.",
        "Immobilier et placement financier ne s’opposent pas : ils se complètent selon le profil.",
        "La défiscalisation seule n’est pas un critère suffisant pour investir.",
        "Une analyse préalable évite les erreurs coûteuses à la revente ou à la sortie.",
      ],
    },
    faq: [
      {
        q: "Comment réduire ses impôts intelligemment ?",
        a: "En combinant des leviers adaptés à votre TMI et à vos projets (PER, assurance-vie, immobilier…) dans une logique patrimoniale globale, pas en cherchant le « produit miracle ».",
      },
      {
        q: "Quels investissements permettent d’optimiser sa fiscalité ?",
        a: "Cela dépend de votre situation : PER, assurance-vie, immobilier, SCPI, etc. Nous simulons et comparons avant recommandation.",
      },
      {
        q: "La défiscalisation est-elle toujours intéressante ?",
        a: "Non. Un avantage fiscal immédiat peut être compensé par une rentabilité faible, des frais élevés ou une revente difficile.",
      },
      {
        q: "Faut-il privilégier immobilier ou placement financier ?",
        a: "Les deux peuvent coexister. Le bon équilibre dépend de votre liquidité, de votre horizon et de votre tolérance au risque.",
      },
      {
        q: "Qu’est-ce qu’un investissement patrimonial ?",
        a: "Un investissement choisi pour servir vos objectifs de vie (revenus, retraite, transmission) et non uniquement pour réduire une facture d’impôt.",
      },
      {
        q: "Pourquoi faire une analyse avant d’investir ?",
        a: "Pour vérifier la cohérence fiscale, financière et familiale, et éviter les engagements difficiles à sortir.",
      },
    ],
    internalLinks: [
      { slug: "gestion-de-patrimoine", label: "Gestion de patrimoine" },
      { slug: "placements-epargne", label: "Placements & épargne" },
      { slug: "investissement-art", label: "Investissement dans l’art" },
    ],
  },

  "prevoyance-sante-assurance-pret": {
    slug: "prevoyance-sante-assurance-pret",
    meta: {
      title: "Prévoyance, santé & assurance de prêt | Lefèvre Conseil",
      description:
        "Protégez vos revenus, vos proches et vos projets avec des garanties prévoyance, santé et assurance emprunteur adaptées.",
    },
    hero: {
      h1: "Prévoyance, santé et assurance de prêt",
      subtitle:
        "Protégez vos revenus, votre famille et vos projets avec des garanties adaptées à votre situation.",
      taglineHighlightAfter: ", votre famille",
      intro:
        "Protéger son patrimoine, ce n’est pas seulement investir : c’est aussi sécuriser ses revenus, sa santé et son emprunt. Nous comparons les garanties et expliquons les options, pour particuliers, indépendants et dirigeants à Perpignan et en France.",
    },
    whyImportant: {
      title: "Protéger son patrimoine, ce n’est pas seulement investir",
      paragraphs: [
        "Un arrêt de travail, un décès ou une invalidité peuvent fragiliser un foyer ou une entreprise bien plus vite qu’une baisse de marché.",
        "Une complémentaire santé mal adaptée ou une assurance de prêt trop chère pèsent chaque mois, sans apporter la bonne couverture.",
        "Nous intégrons la protection dans votre stratégie patrimoniale globale, en cohérence avec vos contrats existants.",
      ],
    },
    accompaniment: accompaniment(),
    solutions: {
      title: "Nos domaines d’intervention",
      items: [
        {
          title: "Prévoyance",
          description: "Arrêt de travail, invalidité, décès, maintien de revenus pour indépendants et dirigeants.",
        },
        {
          title: "Santé",
          description: "Complémentaire santé adaptée aux familles, seniors, indépendants et dirigeants.",
        },
        {
          title: "Assurance de prêt",
          description: "Comparaison et changement d’assurance emprunteur avec garanties équivalentes.",
        },
        {
          title: "Protection du dirigeant",
          description: "Couverture des risques liés à l’activité professionnelle.",
        },
      ],
    },
    forWho: {
      title: "Pour qui ?",
      profiles: [
        "Particuliers",
        "Familles",
        "Emprunteurs",
        "Indépendants",
        "Dirigeants",
        "Professions libérales",
      ],
    },
    whyUs: whyUs(),
    summary: {
      title: "À retenir",
      bullets: [
        "Prévoyance et mutuelle santé répondent à des besoins différents : nous clarifions les garanties.",
        "Changer d’assurance de prêt est possible sous conditions, avec un accompagnement administratif.",
        "Réduire le coût ne doit pas se faire au détriment d’une protection suffisante.",
        "Lefèvre Conseil compare les offres auprès de plus de 40 partenaires.",
      ],
    },
    faq: [
      {
        q: "Pourquoi souscrire une prévoyance ?",
        a: "Pour maintenir un niveau de vie en cas d’arrêt de travail, d’invalidité ou de décès, et protéger votre famille ou votre activité.",
      },
      {
        q: "Quelle prévoyance pour un indépendant ou un dirigeant ?",
        a: "Des garanties spécifiques couvrent le maintien de revenus et les charges de l’entreprise. Nous adaptons les montants à votre rémunération et à vos besoins.",
      },
      {
        q: "Peut-on changer d’assurance de prêt ?",
        a: "Oui, sous réserve d’équivalence des garanties et d’acceptation par l’établissement prêteur. Nous vous accompagnons dans les démarches.",
      },
      {
        q: "Comment réduire le coût de son assurance emprunteur ?",
        a: "En comparant les tarifs et en ajustant les garanties à l’âge et au profil, sans supprimer les protections essentielles.",
      },
      {
        q: "Quelle différence entre mutuelle santé et prévoyance ?",
        a: "La mutuelle rembourse les frais de santé. La prévoyance couvre la perte de revenus en cas d’aléa majeur (arrêt, invalidité, décès).",
      },
      {
        q: "Comment choisir les bonnes garanties ?",
        a: "En partant de votre situation familiale, professionnelle et de vos contrats existants. Nous expliquons chaque option clairement.",
      },
    ],
    internalLinks: [
      { slug: "gestion-de-patrimoine", label: "Gestion de patrimoine" },
      { slug: "retraite-transmission", label: "Retraite & transmission" },
    ],
  },

  "investissement-art": {
    slug: "investissement-art",
    meta: {
      title: "Investir dans l’art en entreprise | Lefèvre Conseil",
      description:
        "Leasing d’œuvres d’art, fiscalité, valorisation des locaux : Lefèvre Conseil accompagne les entreprises dans l’investissement artistique.",
    },
    hero: {
      h1: "Investir dans l’art et valoriser votre entreprise",
      subtitle:
        "Une solution patrimoniale, fiscale et esthétique pour les entreprises qui souhaitent investir dans des œuvres d’art.",
      taglineHighlightAfter: ", fiscale et esthétique",
      intro:
        "Améliorer vos locaux, renforcer votre image et étudier un cadre fiscal adapté : Lefèvre Conseil accompagne les entreprises dans le leasing d’œuvres d’art, de la sélection à l’exposition, avec des partenaires spécialisés.",
    },
    whyImportant: {
      title: "Pourquoi investir dans l’art en entreprise ?",
      paragraphs: [
        "Une œuvre visible dans vos locaux valorise l’accueil clients et collaborateurs, renforce la culture d’entreprise et peut constituer le début d’une collection.",
        "Le leasing permet de préserver la trésorerie tout en exposant des pièces sélectionnées. Le cadre fiscal dépend de votre situation : nous le vérifions avant engagement.",
        "Ce dispositif s’adresse aux TPE, PME et structures qui souhaitent allier esthétique, image de marque et réflexion patrimoniale.",
      ],
    },
    accompaniment: accompaniment("Comment fonctionne l’accompagnement ?"),
    solutions: {
      title: "Les avantages pour l’entreprise",
      items: [
        { title: "Image de marque", description: "Des locaux premium qui reflètent vos valeurs." },
        { title: "Environnement de travail", description: "Un cadre inspirant pour vos équipes et visiteurs." },
        { title: "Collection", description: "Constitution progressive d’un patrimoine artistique." },
        {
          title: "Fiscalité",
          description: "Étude des déductibilités potentielles selon votre structure — sans promesse systématique.",
        },
        {
          title: "Leasing",
          description: "Mensualités maîtrisées et préservation de la capacité d’emprunt.",
        },
      ],
    },
    forWho: {
      title: "Pour qui ?",
      profiles: ["TPE / PME", "Professions libérales", "Cabinets", "Commerces", "Sièges sociaux"],
    },
    whyUs: whyUs(),
    summary: {
      title: "À retenir",
      bullets: [
        "Une entreprise peut investir dans l’art via un accompagnement structuré et un partenaire spécialisé.",
        "Le leasing d’œuvres permet d’exposer sans immobiliser tout le capital.",
        "Les loyers peuvent être déductibles selon situation : à valider avec votre expert-comptable.",
        "La sélection des œuvres se fait avec vous, selon vos goûts et vos objectifs.",
      ],
    },
    faq: [
      {
        q: "Une entreprise peut-elle investir dans l’art ?",
        a: "Oui, notamment via des montages de location ou d’acquisition adaptés à la taille et à l’activité de la société.",
      },
      {
        q: "Comment fonctionne le leasing d’œuvres d’art ?",
        a: "Vous choisissez une œuvre, un contrat de location est établi avec un partenaire, puis l’œuvre est livrée et exposée dans vos locaux.",
      },
      {
        q: "Les loyers sont-ils déductibles ?",
        a: "Souvent partiellement, selon le montage et la fiscalité de l’entreprise. Nous réalisons une simulation avant validation.",
      },
      {
        q: "Qui choisit les œuvres ?",
        a: "Vous, avec notre conseil et celui de nos partenaires artistiques, selon vos goûts, votre budget et vos objectifs.",
      },
      {
        q: "Comment se déroule la livraison ?",
        a: "Après validation du contrat, l’œuvre est installée et assurée selon les conditions prévues avec le partenaire.",
      },
      {
        q: "Est-ce adapté aux petites entreprises ?",
        a: "Oui, des solutions existent pour différentes tailles de structure. Nous étudions la pertinence au cas par cas.",
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
