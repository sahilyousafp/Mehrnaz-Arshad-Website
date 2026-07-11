// Build content/manifest.json: for every image under public/exhibitions,
// record its intrinsic width and height so next/image can render it without
// layout shift. Runs after fetch-images.py in the prebuild step.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { imageSize } from "image-size";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const exhibitionsDir = join(root, "public", "exhibitions");
const outFile = join(root, "content", "manifest.json");

if (!existsSync(exhibitionsDir)) {
  console.error(`Missing ${exhibitionsDir} - run "npm run fetch-images" first.`);
  process.exit(1);
}

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const manifest = {};

for (const slug of readdirSync(exhibitionsDir).sort()) {
  const dir = join(exhibitionsDir, slug);
  const images = [];
  for (const file of readdirSync(dir).sort()) {
    if (!IMAGE_EXTENSIONS.has(extname(file).toLowerCase())) continue;
    const { width, height } = imageSize(readFileSync(join(dir, file)));
    images.push({ file, width, height });
  }
  if (images.length > 0) manifest[slug] = images;
}

mkdirSync(join(root, "content"), { recursive: true });
writeFileSync(outFile, JSON.stringify(manifest, null, 2) + "\n");

const total = Object.values(manifest).reduce((n, imgs) => n + imgs.length, 0);
console.log(`Wrote manifest for ${Object.keys(manifest).length} projects, ${total} images.`);
