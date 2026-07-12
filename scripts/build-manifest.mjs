// Build content/manifest.json (exhibition galleries) and content/logos.json
// (event logos): for every image under public/exhibitions and public/logos,
// record its intrinsic width and height so next/image can render it without
// layout shift. Runs after fetch-images.py in the prebuild step.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { imageSize } from "image-size";
import sharp from "sharp";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const exhibitionsDir = join(root, "public", "exhibitions");
const logosDir = join(root, "public", "logos");
const outFile = join(root, "content", "manifest.json");
const logosOutFile = join(root, "content", "logos.json");

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

const logos = {};
if (existsSync(logosDir)) {
  for (const file of readdirSync(logosDir).sort()) {
    if (!IMAGE_EXTENSIONS.has(extname(file).toLowerCase())) continue;
    const path = join(logosDir, file);
    // Trim the uniform padding/letterboxing baked into the source files so
    // every logo sits tight around its artwork - otherwise a shared CSS
    // height renders heavily padded logos much smaller than the rest.
    const original = readFileSync(path);
    // Two passes: letterboxed files (dark bars around a light canvas) only
    // reveal their real padding colour after the first trim.
    const firstPass = await sharp(original).trim({ threshold: 25 }).toBuffer();
    const trimmed = await sharp(firstPass).trim({ threshold: 25 }).toBuffer();
    const originalSize = imageSize(original);
    let { width, height } = imageSize(trimmed);
    if (width !== originalSize.width || height !== originalSize.height) {
      writeFileSync(path, trimmed);
    } else {
      ({ width, height } = originalSize);
    }
    logos[file] = { width, height };
  }
}

mkdirSync(join(root, "content"), { recursive: true });
writeFileSync(outFile, JSON.stringify(manifest, null, 2) + "\n");
writeFileSync(logosOutFile, JSON.stringify(logos, null, 2) + "\n");

const total = Object.values(manifest).reduce((n, imgs) => n + imgs.length, 0);
console.log(
  `Wrote manifest for ${Object.keys(manifest).length} projects, ${total} images, ` +
    `${Object.keys(logos).length} logos.`,
);
