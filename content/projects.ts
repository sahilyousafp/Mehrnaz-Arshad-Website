// One entry per client subfolder in the shared Google Drive folder (layout:
// <Year>/<Event>/<Client>/<Location>_<Partner>/*.ext). `slug` must match the
// slugified client folder name (see scripts/fetch-images.py): the gallery
// images for a project live in public/exhibitions/<slug>/.
//
// A Drive client folder with images but no entry here still appears on the
// site: lib/content.ts synthesizes one from content/drive-folders.json
// (year/event/client/location/partner parsed straight from the folder
// hierarchy). An entry added here always takes precedence over that
// synthesized one.

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
    slug: "italia",
    client: "Italia",
    event: "MWC Barcelona",
    location: "Barcelona, Spain",
    year: 2026,
    partner: "Standecor",
    hero: "ITALIA_Site.jpg",
  },
  {
    slug: "talabat",
    client: "Talabat",
    event: "Web Summit Qatar",
    location: "Doha, Qatar",
    year: 2026,
    partner: "Dar Agha",
    hero: "Talabat_Render.jpg",
  },
  {
    slug: "paylater",
    client: "PayLater",
    event: "Web Summit Qatar",
    location: "Doha, Qatar",
    year: 2026,
    partner: "Dar Agha",
    hero: "PayLater_Site.jpg",
  },
  {
    slug: "hondajet",
    client: "HondaJet",
    event: "Farnborough International Airshow",
    location: "Farnborough, United Kingdom",
    year: 2026,
    partner: "Standecor",
    hero: "HONDAJET_Render.jpg",
  },
  {
    slug: "caf",
    client: "CAF",
    event: "FITUR",
    location: "Madrid, Spain",
    year: 2026,
    partner: "Standecor",
    hero: "CAF_site.jpg",
  },
  {
    slug: "port-de-barcelona",
    client: "Port de Barcelona",
    event: "SIL",
    location: "Barcelona, Spain",
    year: 2026,
    partner: "Standecor",
    hero: "Port de Barcelona 2026_Render_key.png",
  },
  {
    slug: "inalme",
    client: "Alta Natura · Inalme",
    event: "Vitafoods Europe",
    location: "Barcelona, Spain",
    year: 2026,
    partner: "Standecor",
  },
  {
    slug: "garnica",
    client: "Garnica",
    event: "Carrefour International du Bois",
    location: "Nantes, France",
    year: 2026,
    partner: "Standecor",
  },
  {
    slug: "pixel-farma",
    client: "Pixel",
    event: "Infarma",
    location: "Barcelona, Spain",
    year: 2026,
    partner: "Standecor",
    hero: "Pixel_Render.jpg",
  },
  {
    slug: "saray",
    client: "SARAY",
    event: "BATIMAT",
    location: "Paris, France",
    year: 2026,
    partner: "Wenes Stand",
  },
];
