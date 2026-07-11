// Site-wide details. TODO(Mehrnaz): replace the placeholder contact details
// below with the real ones before going live.

export const site = {
  name: "Mehrnaz Arshad",
  role: "Exhibition Stand Designer",
  // TODO: real email address
  email: "hello@mehrnazarshad.com",
  // TODO: real LinkedIn URL (or remove)
  linkedin: "https://www.linkedin.com/in/mehrnaz-arshad",
  base: "Barcelona, Spain",
};

// Construction partner network shown on the contact map.
// lat/lon are city coordinates used by the equirectangular projection.
export type PartnerPoint = {
  country: string;
  city: string;
  lat: number;
  lon: number;
  /** Named construction partner, where known */
  partner?: string;
  /** The home base the connection lines radiate from */
  isBase?: boolean;
};

export const partnerNetwork: PartnerPoint[] = [
  { country: "Spain", city: "Madrid", lat: 40.42, lon: -3.7, partner: "Standecor", isBase: true },
  { country: "Poland", city: "Warsaw", lat: 52.23, lon: 21.01 },
  { country: "France", city: "Paris", lat: 48.86, lon: 2.35 },
  { country: "United Kingdom", city: "London", lat: 51.51, lon: -0.13 },
  { country: "Germany", city: "Berlin", lat: 52.52, lon: 13.4 },
  { country: "Turkey", city: "Istanbul", lat: 41.01, lon: 28.98, partner: "Wenes Stand" },
  { country: "India", city: "Mumbai", lat: 19.08, lon: 72.88 },
  { country: "UAE", city: "Dubai", lat: 25.2, lon: 55.27 },
  { country: "Qatar", city: "Doha", lat: 25.29, lon: 51.53, partner: "Dar Agha" },
];

// Partners whose country pairing is not yet confirmed.
export const otherPartners = ["CM-Creative"];
