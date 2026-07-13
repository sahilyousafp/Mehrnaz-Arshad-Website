// Static UI copy in English/Spanish. Project data itself (client names,
// event names, cities, partner names) is left untranslated - those are
// proper nouns, not prose - only the surrounding chrome and Mehrnaz's own
// descriptive copy is translated here.

export type Locale = "en" | "es";

export const locales: Locale[] = ["en", "es"];

export type TranslationKey = keyof typeof en;

const en = {
  navProjects: "Projects",
  navProjectsAria: "See selected projects",
  navExpertise: "Expertise",
  navExpertiseAria: "See the design process",
  navPartners: "Partners",
  navPartnersAria: "See construction partners",
  navContact: "Contact",
  navContactAria: "Get in touch",

  menuLabel: "Menu",
  closeLabel: "Close",
  openMenuAria: "Open menu",
  closeMenuAria: "Close menu",

  socialsTitle: "Socials",
  socialEmail: "Email",
  socialLinkedin: "LinkedIn",

  heroTagline: "Exhibition stand designer — from the first render to the show floor",
  moreAboutMehrnaz: "More about Mehrnaz",
  viewTheProject: "View the project",
  scroll: "Scroll",

  introStatement:
    "Serving brands on the show floor, I design and deliver custom exhibition stands — from concept and 3D visualisation to fabrication and on-site installation, across Europe, the Middle East and Asia.",
  introP1:
    "From MWC Barcelona to Web Summit Qatar and the Farnborough International Airshow, my stands are designed to stop visitors mid-aisle — and engineered to survive the schedule of a live show.",
  introP2:
    "Working with trusted construction partners in nine countries, I follow every project personally from the first sketch to handover on site, so the stand that opens on day one is the stand the client approved in the render.",
  getInTouch: "Get in touch",

  expertiseStatement: "One designer, four stages: every stand follows the same path from idea to opening day.",
  expertiseNote:
    "Each stage can be commissioned on its own or run as one continuous chain — depending on the client, the venue and the deadline.",
  seeTheProjects: "See the projects",

  stageDesign: "Design",
  stageVisualise: "Visualise",
  stageBuild: "Build",
  stageInstall: "Install",
  captionDesign1: "Client brief & concept sketches",
  captionDesign2: "3D CAD modelling",
  captionDesign3: "Layout & material planning",
  captionVisualise1: "Photoreal 3D renders",
  captionVisualise2: "Client review & revisions",
  captionVisualise3: "Final sign-off",
  captionBuild1: "Multi-material fabrication",
  captionBuild2: "Joinery, metalwork & finishing",
  captionBuild3: "Quality check before ship",
  captionInstall1: "On-site assembly",
  captionInstall2: "Rigging, lighting & AV",
  captionInstall3: "Walkthrough before opening",

  selectedProjects: "Selected projects",
  discover: "Discover",

  showsVenues: "Shows & venues",

  constructionPartners: "Construction partners",
  partnersTitle: "Built with trusted partners across nine countries.",

  eventLabel: "Event",
  locationLabel: "Location",
  yearLabel: "Year",
  builtWithLabel: "Built with",
  standSizeLabel: "Stand size",
  moreProjectsAria: "More projects",
  previous: "Previous",
  next: "Next",

  role: "Exhibition Stand Designer",
} as const;

const es: Record<TranslationKey, string> = {
  navProjects: "Proyectos",
  navProjectsAria: "Ver proyectos seleccionados",
  navExpertise: "Experiencia",
  navExpertiseAria: "Ver el proceso de diseño",
  navPartners: "Colaboradores",
  navPartnersAria: "Ver socios de construcción",
  navContact: "Contacto",
  navContactAria: "Ponte en contacto",

  menuLabel: "Menú",
  closeLabel: "Cerrar",
  openMenuAria: "Abrir menú",
  closeMenuAria: "Cerrar menú",

  socialsTitle: "Redes",
  socialEmail: "Correo",
  socialLinkedin: "LinkedIn",

  heroTagline: "Diseñadora de stands de exhibición — desde el primer render hasta el suelo de la feria",
  moreAboutMehrnaz: "Más sobre Mehrnaz",
  viewTheProject: "Ver el proyecto",
  scroll: "Desplázate",

  introStatement:
    "Al servicio de marcas en el suelo ferial, diseño y entrego stands de exhibición a medida — desde el concepto y la visualización 3D hasta la fabricación y la instalación in situ, en Europa, Oriente Medio y Asia.",
  introP1:
    "Desde el MWC Barcelona hasta el Web Summit Qatar y el Farnborough International Airshow, mis stands están diseñados para detener a los visitantes en pleno pasillo — e ingeniados para sobrevivir al ritmo de una feria en vivo.",
  introP2:
    "Trabajando con socios de construcción de confianza en nueve países, sigo cada proyecto personalmente desde el primer boceto hasta la entrega en el sitio, para que el stand que abre el primer día sea el mismo que el cliente aprobó en el render.",
  getInTouch: "Ponte en contacto",

  expertiseStatement: "Una diseñadora, cuatro etapas: cada stand sigue el mismo camino desde la idea hasta el día de apertura.",
  expertiseNote:
    "Cada etapa puede encargarse por separado o como una cadena continua — según el cliente, el recinto y el plazo.",
  seeTheProjects: "Ver los proyectos",

  stageDesign: "Diseño",
  stageVisualise: "Visualizar",
  stageBuild: "Construir",
  stageInstall: "Instalar",
  captionDesign1: "Briefing del cliente y bocetos de concepto",
  captionDesign2: "Modelado 3D CAD",
  captionDesign3: "Distribución y planificación de materiales",
  captionVisualise1: "Renders 3D fotorrealistas",
  captionVisualise2: "Revisión y ajustes con el cliente",
  captionVisualise3: "Aprobación final",
  captionBuild1: "Fabricación multimaterial",
  captionBuild2: "Carpintería, metalistería y acabados",
  captionBuild3: "Control de calidad antes del envío",
  captionInstall1: "Montaje in situ",
  captionInstall2: "Rigging, iluminación y AV",
  captionInstall3: "Recorrido final antes de la apertura",

  selectedProjects: "Proyectos seleccionados",
  discover: "Descubrir",

  showsVenues: "Ferias y sedes",

  constructionPartners: "Socios de construcción",
  partnersTitle: "Construido con socios de confianza en nueve países.",

  eventLabel: "Evento",
  locationLabel: "Ubicación",
  yearLabel: "Año",
  builtWithLabel: "Construido con",
  standSizeLabel: "Tamaño del stand",
  moreProjectsAria: "Más proyectos",
  previous: "Anterior",
  next: "Siguiente",

  role: "Diseñadora de Stands de Exhibición",
};

export const dictionaries: Record<Locale, Record<TranslationKey, string>> = { en, es };

export function translate(locale: Locale, key: TranslationKey): string {
  return dictionaries[locale][key];
}
