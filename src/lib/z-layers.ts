/** Empilement global — classes Tailwind alignées sur `globals.css` (@theme z-index). */
export const zLayerClass = {
  tooltip: "z-tooltip",
  cookie: "z-cookie",
  modal: "z-modal",
  toast: "z-toast",
  sheet: "z-sheet",
} as const;

export const zIndexNumeric = {
  tooltip: 70,
  cookie: 75,
  modal: 85,
  toast: 95,
  sheet: 100,
} as const;
