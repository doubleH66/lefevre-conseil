/** Contenu page /expertises/investissement-art - images servies depuis /public */
export const ART_INVESTMENT_IMAGES = {
  croco: "/images/investissement-art/croco.png",
  courseBrise: "/images/investissement-art/course-brise-legere.png",
  ludwig: "/images/investissement-art/ludwig.png",
  accompagnement: "/images/investissement-art/accompagnement.webp",
  fiscalite: "/images/investissement-art/fiscalite.webp",
} as const;

export const ART_NOUVEAUTES = [
  {
    id: "croco",
    title: "Croco",
    artist: "AKET",
    dimensions: "61×50",
    image: ART_INVESTMENT_IMAGES.croco,
    imageAlt: "Œuvre Croco par AKET",
  },
  {
    id: "course-brise",
    title: "Course contre la brise légère",
    artist: "PONDZ Hugo",
    dimensions: "100×100",
    image: ART_INVESTMENT_IMAGES.courseBrise,
    imageAlt: "Œuvre Course contre la brise légère par Hugo Pondz",
  },
  {
    id: "ludwig",
    title: "LUDWIG 4/8",
    artist: "RIVES Bernard",
    dimensions: "65×48×25",
    image: ART_INVESTMENT_IMAGES.ludwig,
    imageAlt: "Sculpture LUDWIG 4/8 par Bernard Rives",
  },
] as const;

export const ART_VISUAL_BENEFITS = [
  {
    title: "Cadre de travail positif",
    description: "Améliore l'ambiance et le bien-être au quotidien.",
  },
  {
    title: "Construction d'une collection",
    description: "Valorise l'identité de votre entreprise.",
  },
  {
    title: "Culture d'entreprise",
    description: "Renforce les valeurs internes et l'engagement des équipes.",
  },
] as const;

export const ART_ACCOMPANIMENT_STEPS = [
  {
    title: "Sélection",
    description:
      "Bénéficiez d'un accompagnement gratuit et d'une sélection sur-mesure adaptées à vos goûts et vos envies. Artistes côtés dans le monde : faites le choix de l'investissement le plus avantageux.",
  },
  {
    title: "Validation du contrat",
    description:
      "Montage du leasing ou de l'acquisition avec nos partenaires : conditions, fiscalité et calendrier validés avec vous et votre expert-comptable.",
  },
  {
    title: "Livraison et exposition",
    description:
      "Installation des œuvres dans vos locaux, assurance et mise en valeur pour vos collaborateurs et vos clients.",
  },
] as const;

export const ART_TAX_BENEFITS = [
  {
    title: "Diminution des impôts",
    description:
      "Sous conditions, les dépenses liées à des œuvres d'artistes vivants peuvent être déduites du résultat imposable - dans la limite des plafonds légaux.",
  },
  {
    title: "Levée d'option",
    description:
      "En leasing, une option d'achat peut être prévue en fin de contrat pour intégrer l'œuvre au patrimoine de l'entreprise.",
  },
  {
    title: "Risque limité",
    description:
      "Des mensualités maîtrisées et un cadre contractuel clair : vous testez ou développez votre projet sans immobiliser toute votre trésorerie.",
  },
] as const;

export const ART_CONTACT_SUBJECT = "Arts";
