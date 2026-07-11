// Server-side helpers joining the hand-written project data (content/projects.ts)
// with the generated image manifest (content/manifest.json).

import { readFileSync } from "node:fs";
import { join } from "node:path";
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

/** Projects that have at least one image synced from Drive. */
export const visibleProjects: Project[] = projects.filter(
  (p) => gallery(p.slug).length > 0,
);

export function heroImage(project: Project): GalleryImage {
  const images = gallery(project.slug);
  return images.find((i) => i.file === project.hero) ?? images[0];
}

export function imagePath(slug: string, file: string): string {
  return `/exhibitions/${slug}/${encodeURIComponent(file)}`;
}
