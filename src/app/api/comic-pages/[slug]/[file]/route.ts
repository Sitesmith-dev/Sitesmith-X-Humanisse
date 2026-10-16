// The reader's pages, served only to signed-in readers. They live in comic-pages/ at the project root, not in
// public/, because anything in public/ is a plain URL anyone can fetch, clean and unstamped, without logging in.
//
// This is the seam for later: when the full comics move to S3/CloudFront, only the line that reads the bytes changes.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getComic } from "@/content/comics";
import { createClient } from "@/lib/supabase/server";

const FILE = /^([1-9]\d{0,2})(-thumb)?\.webp$/;

const notFound = () => new Response(null, { status: 404 });

export async function GET(request: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params;
  const match = FILE.exec(file);
  const comic = getComic(slug);
  // Only a real comic and one of its own pages. Nothing from the URL reaches the file system until both are known good
  if (!match || !comic || Number(match[1]) > comic.pages.length) return notFound();

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return new Response(null, { status: 401 });

  // Opening the image on its own in a tab gets nothing. Only a speed bump: the browser's Network tab still shows the
  // request, and a determined reader can save the response from there. The stamp, not this, is the real protection
  if (request.headers.get("sec-fetch-dest") === "document") return notFound();

  let bytes: Buffer;
  try {
    bytes = await readFile(path.join(process.cwd(), "comic-pages", comic.slug, `${match[1]}${match[2] ?? ""}.webp`));
  } catch {
    return notFound();
  }
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
      "Cross-Origin-Resource-Policy": "same-origin",
    },
  });
}
