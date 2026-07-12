// One entry per project subfolder in the shared Google Drive folder.
// `slug` must match the slugified folder name (see scripts/fetch-images.py):
// the gallery images for a project live in public/exhibitions/<slug>/.
// Projects whose folder has no images yet (e.g. BATIMAT) are kept here but
// only appear on the site once photos land in Drive.
//
// A Drive folder with images but no entry here still appears on the site:
// lib/content.ts synthesizes one from the raw folder name, parsed against
// the "Year - Event - Client - Location - Partner" naming convention. An
// entry added here always takes precedence over that synthesized one.

export type Project = {
  slug: string;
  /** Display title - the client / stand shown */
  client: string;
  event?: string;
  location?: string;
  year?: number;
  /** Construction partner who built the stand */
  partner?: string;
  /** e.g. "120 m2" - fill in when known */
  boothSize?: string;
  /** Preferred hero image filename; overrides an image named "..._key.ext"
   * in Drive, which in turn overrides falling back to the first image. */
  hero?: string;
};

export const projects: Project[] = [
  {
    slug: "mwc",
    client: "Italia",
    event: "MWC Barcelona",
    location: "Barcelona, Spain",
    year: 2026,
    partner: "Standecor",
    hero: "ITALIA_Site.jpg",
  },
  {
    slug: "websummit",
    client: "Talabat · PayLater",
    event: "Web Summit Qatar",
    location: "Doha, Qatar",
    year: 2026,
    partner: "Dar Agha",
    hero: "Talabat_Site.jpg",
  },
  {
    slug: "farnborough-air-show",
    client: "HondaJet",
    event: "Farnborough International Airshow",
    location: "Farnborough, United Kingdom",
    year: 2026,
    partner: "Standecor",
    hero: "HONDAJET_Render.jpg",
  },
  {
    slug: "fitur",
    client: "CAF",
    event: "FITUR",
    location: "Madrid, Spain",
    year: 2026,
    partner: "Standecor",
    hero: "CAF_site.jpg",
  },
  {
    slug: "sil",
    client: "Port de Barcelona",
    event: "SIL",
    location: "Barcelona, Spain",
    year: 2026,
    partner: "Standecor",
    hero: "Port de Barcelona 2026_Render.png",
  },
  {
    slug: "vitafood",
    client: "Alta Natura · Inalme",
    event: "Vitafoods Europe",
    location: "Barcelona, Spain",
    year: 2026,
    partner: "Standecor",
  },
  {
    slug: "cib",
    client: "Garnica",
    event: "Carrefour International du Bois",
    location: "Nantes, France",
    year: 2026,
    partner: "Standecor",
  },
  {
    slug: "infarma",
    client: "Pixel",
    event: "Infarma",
    location: "Barcelona, Spain",
    year: 2026,
    partner: "Standecor",
    hero: "Pixel_Render.jpg",
  },
  {
    slug: "batimat",
    client: "BATIMAT",
    event: "BATIMAT",
    location: "Paris, France",
    year: 2026,
    partner: "Wenes Stand",
  },
];
