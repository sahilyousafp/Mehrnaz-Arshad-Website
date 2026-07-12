// Event and venue logos shown in the logo wall on the home page.
// `file` must match a filename in the shared Google Drive "EVENTS" folder
// (see scripts/fetch-images.py): the images are synced into public/logos/.
// Logos whose file has not landed in Drive yet are skipped automatically.

export type EventLogo = {
  /** Filename inside the Drive EVENTS folder / public/logos */
  file: string;
  /** Display name, used as alt text */
  name: string;
  /** Light artwork or dark background - invert to read on the white page */
  invert?: boolean;
};

export const eventLogos: EventLogo[] = [
  { file: "MWC-Barcelona-Logo-RGB_colour-undated.png", name: "MWC Barcelona" },
  { file: "Web_Summit_logo.svg.webp", name: "Web Summit" },
  { file: "FI_20250623-120809_1.png", name: "Farnborough International", invert: true },
  { file: "logo-FITUR.png", name: "FITUR" },
  { file: "SIL_logo-white.png", name: "SIL Barcelona", invert: true },
  { file: "INFARMA.jpg", name: "Infarma" },
  { file: "bp_events_logo_vitafoods.jpg", name: "Vitafoods Europe" },
  { file: "Paris-Air-Show.jpg", name: "Paris Air Show" },
  { file: "MRO.png", name: "MRO Europe" },
  { file: "Seafood_1200x627.png", name: "Seafood Expo Global" },
  { file: "fruit-attraction-logo-spain.png", name: "Fruit Attraction" },
  { file: "Madrid tech show.webp", name: "Madrid Tech Show" },
  { file: "ISE-logo.jpg", name: "Integrated Systems Europe" },
  { file: "ibtm_horizontal_black_828x280.png", name: "IBTM World" },
  { file: "ice-logo-white.webp", name: "ICE Barcelona", invert: true },
  { file: "automechanika-FFM_square.jpg", name: "Automechanika Frankfurt", invert: true },
  { file: "maxresdefault.jpg", name: "EroSpain" },
  { file: "ifema_feriademadrid.png", name: "IFEMA Madrid", invert: true },
  { file: "logo_fira_negre-1_0.jpg", name: "Fira Barcelona" },
  { file: "575150867f6fe-fieramilano.png", name: "Fiera Milano" },
  { file: "messe-berlin-logo-vector.png", name: "Messe Berlin" },
  { file: "MF_black_1x1.jpg", name: "Messe Frankfurt" },
];
