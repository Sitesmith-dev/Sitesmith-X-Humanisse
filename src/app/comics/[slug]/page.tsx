import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { comics, getComic } from "@/content/comics";
import { ComicPanel } from "@/components/comics/ComicPanel";

export function generateStaticParams() {
  return comics.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/comics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getComic(slug)?.title ?? "Comic" };
}

// The standalone page, reached by a hard load or a shared link. Soft navigation from the catalogue is intercepted by @modal instead
export default async function ComicPage({ params }: PageProps<"/comics/[slug]">) {
  const { slug } = await params;
  const comic = getComic(slug);
  if (!comic) notFound();
  return <ComicPanel comic={comic} topbar={<Link href="/comics" className="btn"><ArrowLeft size={18} aria-hidden="true" /> Back to comics</Link>} />;
}
