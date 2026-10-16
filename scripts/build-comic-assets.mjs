// Builds the comic images the site uses from the client's PDFs: each comic's cover, and the reader's preview pages
// (the cover and the next two pages). Re-run it when the client revises a comic or sends more pages:
//
//   node scripts/build-comic-assets.mjs
//
// Reads    Comics PDFS/*.pdf                      (never committed or deployed, see .gitignore)
// Writes   public/comics/<slug>/cover.webp         public: the cover is marketing
//          comic-pages/<slug>/<n>.webp, <n>-thumb.webp   not public: served only to signed-in readers by
//                                                  src/app/api/comic-pages/[slug]/[file]/route.ts
//          src/content/comic-assets.ts             generated, do not edit by hand
//
// Rendering uses macOS's own PDF engine through scripts/render-pdf-pages.swift (compiled on the fly with swiftc),
// because poppler was not available. On a machine with poppler, `pdftoppm -r <dpi> -f 1 -l 3 -png` does the same job.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PDFS = path.join(ROOT, "Comics PDFS");
const WORK = path.join(ROOT, ".comic-build");
const PUBLIC_DIR = path.join(ROOT, "public", "comics");
const PAGES_DIR = path.join(ROOT, "comic-pages");
const ASSETS_TS = path.join(ROOT, "src", "content", "comic-assets.ts");

/** Only these pages ever leave the PDFs: the cover, then the first spread */
const PREVIEW_PAGES = 3;
const COVER = { width: 1000, quality: 82 };
const PAGE = { width: 1600, quality: 80, maxBytes: 700 * 1024 };
const THUMB = { width: 240, quality: 70 };
/** Rendered at least this sharp, and sharper when that is what it takes to reach the page width without upscaling */
const MIN_DPI = 150;
const BUDGET_BYTES = 20 * 1024 * 1024;

const COMICS = [
  { pdf: "PDF File-Negotiation.pdf", slug: "negotiation" },
  { pdf: "PDF FIle- Resillence.pdf", slug: "resilience" },
  { pdf: "PDF File- Storytelling.pdf", slug: "storytelling" },
  { pdf: "PDF File- Problem Solving.pdf", slug: "problem-solving" },
  { pdf: "PDF file- Ethics & Sustainability.pdf", slug: "ethics-sustainability" },
  { pdf: "PDF File- Decision Sciences.pdf", slug: "decision-sciences" },
  { pdf: "PDF File- Active Listening.pdf", slug: "active-listening" },
  { pdf: "PDF File- Art of Difficult Conversation.pdf", slug: "difficult-conversations" },
  { pdf: "PDF File- Emotional Intelligence.pdf", slug: "emotional-intelligence" },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

function renderer() {
  const bin = path.join(WORK, "render-pdf-pages");
  const src = path.join(ROOT, "scripts", "render-pdf-pages.swift");
  if (!fs.existsSync(bin) || fs.statSync(bin).mtimeMs < fs.statSync(src).mtimeMs) {
    fs.mkdirSync(WORK, { recursive: true });
    execFileSync("swiftc", ["-O", "-o", bin, src], { stdio: "inherit" });
  }
  return bin;
}

// No cropping, stretching or sharpening, and sharp drops metadata unless told to keep it
async function webp(input, file, { width, quality, maxBytes = Infinity }) {
  let q = quality;
  for (;;) {
    const buf = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: q }).toBuffer();
    if (buf.length <= maxBytes || q <= 50) {
      fs.writeFileSync(file, buf);
      return { bytes: buf.length, quality: q };
    }
    q -= 4;
  }
}

const render = renderer();
const assets = {};
let total = 0;
const rows = [];

for (const { pdf, slug } of COMICS) {
  const file = path.join(PDFS, pdf);
  if (!fs.existsSync(file)) throw new Error(`Missing ${pdf}`);
  const [count, widthPt] = execFileSync(render, [file, "--info"], { encoding: "utf8" }).trim().split(" ").map(Number);
  const dpi = Math.max(MIN_DPI, Math.ceil((PAGE.width / widthPt) * 72));
  const work = path.join(WORK, slug);
  fs.rmSync(work, { recursive: true, force: true });
  execFileSync(render, [file, work, "1", String(PREVIEW_PAGES), String(dpi)], { stdio: "inherit" });

  const pagesOut = path.join(PAGES_DIR, slug);
  const coverOut = path.join(PUBLIC_DIR, slug);
  fs.rmSync(pagesOut, { recursive: true, force: true });
  fs.rmSync(coverOut, { recursive: true, force: true });
  fs.mkdirSync(pagesOut, { recursive: true });
  fs.mkdirSync(coverOut, { recursive: true });

  const sizes = [];
  const files = [];
  for (let n = 1; n <= PREVIEW_PAGES; n++) {
    const png = path.join(work, `page-${n}.png`);
    const { width, height } = await sharp(png).metadata();
    sizes.push({ width, height });
    const page = await webp(png, path.join(pagesOut, `${n}.webp`), PAGE);
    const thumb = await webp(png, path.join(pagesOut, `${n}-thumb.webp`), THUMB);
    files.push(`${n}: ${kb(page.bytes)}${page.quality < PAGE.quality ? ` (q${page.quality})` : ""}`, `${n}-thumb: ${kb(thumb.bytes)}`);
    total += page.bytes + thumb.bytes;
  }
  const cover = await webp(path.join(work, "page-1.png"), path.join(coverOut, "cover.webp"), COVER);
  total += cover.bytes;

  const aspect = Number((sizes[0].width / sizes[0].height).toFixed(3));
  const inner = Number((sizes[1].width / sizes[1].height).toFixed(3));
  assets[slug] = { cover: `/comics/${slug}/cover.webp`, aspect, previewPages: PREVIEW_PAGES };
  rows.push(`${slug.padEnd(24)} ${String(count).padStart(3)} pages  ${dpi} dpi  page 1 ${sizes[0].width}x${sizes[0].height} (${aspect})  page 2 ${sizes[1].width}x${sizes[1].height} (${inner})  cover ${kb(cover.bytes)}  ${files.join("  ")}`);
}

const body = Object.entries(assets)
  .map(([slug, a]) => `  ${/^[a-z]+$/.test(slug) ? slug : JSON.stringify(slug)}: { cover: ${JSON.stringify(a.cover)}, aspect: ${a.aspect}, previewPages: ${a.previewPages} },`)
  .join("\n");
fs.writeFileSync(
  ASSETS_TS,
  `// GENERATED by scripts/build-comic-assets.mjs from the client's PDFs in "Comics PDFS/". Do not edit by hand:
// re-run \`node scripts/build-comic-assets.mjs\` instead.
// \`aspect\` is page 1's width divided by its height. \`previewPages\` is how many pages the reader serves.
export const comicAssets: Record<string, { cover: string; aspect: number; previewPages: number }> = {
${body}
};
`,
);

console.log(rows.join("\n"));
console.log(`\nTotal ${(total / 1024 / 1024).toFixed(2)} MB of ${(BUDGET_BYTES / 1024 / 1024).toFixed(0)} MB budget`);
if (total > BUDGET_BYTES) process.exitCode = 1;
