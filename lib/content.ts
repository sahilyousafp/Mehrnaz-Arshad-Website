// Server-side helpers joining the hand-written content (content/projects.ts,
// content/events.ts) with the generated image manifests (content/manifest.json,
// content/logos.json).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { eventLogos, type EventLogo } from "@/content/events";
import { projects, type Project } from "@/content/projects";

export type GalleryImage = { file: string; width: number; height: number };

let manifest: Record<string, GalleryImage[]>;
try {
  manifest = JSON.parse(
    readFileSync(join(process.cwd(), "content", "manifest.json"), "utf8"),
  );
} catch {
  throw new Error(
    'content/manifest.json is missing. Run "npm run fetch-images && npm run manifest" first.',
  );
}

export function gallery(slug: string): GalleryImage[] {
  return manifest[slug] ?? [];
}

// Raw Drive folder name per slug, written by scripts/fetch-images.py. Only
// used to synthesize entries for folders not yet curated below, so a missing
// file (e.g. local dev before the first fetch) just means no auto entries.
let driveFolders: Record<string, string>;
try {
  driveFolders = JSON.parse(
    readFileSync(join(process.cwd(), "content", "drive-folders.json"), "utf8"),
  );
} catch {
  driveFolders = {};
}

const FOLDER_NAME_PATTERN = " - ";

/** Parses the "Year - Event - Client - Location - Partner" convention; falls
 * back to using the raw name as the client when a folder doesn't match it. */
function parseFolderName(raw: string): Omit<Project, "slug" | "hero" | "boothSize"> {
  const parts = raw.split(FOLDER_NAME_PATTERN).map((s) => s.trim());
  if (parts.length === 5) {
    const [yearStr, event, client, location, partner] = parts;
    const year = Number(yearStr);
    if (client && event && location && partner && /^\d{4}$/.test(yearStr) && Number.isInteger(year)) {
      return { client, event, location, year, partner };
    }
  }
  console.warn(
    `[content] Drive folder "${raw}" doesn't match the "Year - Event - Client - Location - Partner" ` +
      "naming convention - showing it with just the folder name until it's renamed or curated in content/projects.ts.",
  );
  return { client: raw };
}

const curatedSlugs = new Set(projects.map((p) => p.slug));

/** Uncurated Drive folders that have synced images: not in content/projects.ts. */
const autoProjects: Project[] = Object.keys(manifest)
  .filter((slug) => !curatedSlugs.has(slug) && gallery(slug).length > 0)
  .sort()
  .map((slug) => ({ slug, ...parseFolderName(driveFolders[slug] ?? slug) }));

/** Projects that have at least one image synced from Drive: curated first
 * (so homepage hero/intro picks stay stable), then auto-detected ones. */
export const visibleProjects: Project[] = [
  ...projects.filter((p) => gallery(p.slug).length > 0),
  ...autoProjects,
];

/** `"Client, Event, Year"`, skipping any field a project doesn't have. */
export function projectTitle(p: Project): string {
  return [p.client, p.event, p.year].filter(Boolean).join(", ");
}

/** Alt text for a project's hero/card image. */
export function projectAlt(p: Project): string {
  return p.event ? `${p.client} stand at ${p.event}` : `${p.client} stand`;
}

export function heroImage(project: Project): GalleryImage {
  const images = gallery(project.slug);
  return images.find((i) => i.file === project.hero) ?? images[0];
}

export function imagePath(slug: string, file: string): string {
  return `/exhibitions/${slug}/${encodeURIComponent(file)}`;
}

export type SizedEventLogo = EventLogo & { width: number; height: number };

let logoSizes: Record<string, { width: number; height: number }>;
try {
  logoSizes = JSON.parse(readFileSync(join(process.cwd(), "content", "logos.json"), "utf8"));
} catch {
  throw new Error(
    'content/logos.json is missing. Run "npm run fetch-images && npm run manifest" first.',
  );
}

/** Curated event logos whose file has been synced from Drive. */
export const visibleEventLogos: SizedEventLogo[] = eventLogos.flatMap((logo) => {
  const size = logoSizes[logo.file];
  return size ? [{ ...logo, ...size }] : [];
});

export function logoPath(file: string): string {
  return `/logos/${encodeURIComponent(file)}`;
}
