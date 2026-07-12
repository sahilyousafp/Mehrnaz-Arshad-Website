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

// Structured metadata per slug (year/event/client/location/partner, parsed
// from the Drive folder hierarchy), written by scripts/fetch-images.py. Only
// used to synthesize entries for folders not yet curated below, so a missing
// file (e.g. local dev before the first fetch) just means no auto entries.
type DriveFolderMeta = {
  year: number | null;
  event: string;
  client: string;
  location: string | null;
  partner: string | null;
};

let driveFolders: Record<string, DriveFolderMeta>;
try {
  driveFolders = JSON.parse(
    readFileSync(join(process.cwd(), "content", "drive-folders.json"), "utf8"),
  );
} catch {
  driveFolders = {};
}

function autoProject(slug: string): Project {
  const meta = driveFolders[slug];
  if (!meta) return { slug, client: slug };
  return {
    slug,
    client: meta.client,
    event: meta.event,
    location: meta.location ?? undefined,
    year: meta.year ?? undefined,
    partner: meta.partner ?? undefined,
  };
}

const curatedSlugs = new Set(projects.map((p) => p.slug));

/** Uncurated Drive folders that have synced images: not in content/projects.ts. */
const autoProjects: Project[] = Object.keys(manifest)
  .filter((slug) => !curatedSlugs.has(slug) && gallery(slug).length > 0)
  .sort()
  .map(autoProject);

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

/** True for filenames marked as the card/hero image, e.g. "ITALIA_key.jpg". */
function isKeyImage(file: string): boolean {
  const base = file.replace(/\.[^.]+$/, "");
  return /(^|_)key(_|$)/i.test(base);
}

export function heroImage(project: Project): GalleryImage {
  const images = gallery(project.slug);
  const explicit = project.hero ? images.find((i) => i.file === project.hero) : undefined;
  return explicit ?? images.find((i) => isKeyImage(i.file)) ?? images[0];
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
