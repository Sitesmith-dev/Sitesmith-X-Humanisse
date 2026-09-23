import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { comics, getComic } from "@/content/comics";
import { Reader } from "@/components/reader/Reader";
import styles from "@/components/reader/Reader.module.css";

export function generateStaticParams() {
  return comics.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/read/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const comic = getComic(slug);
  return { title: comic ? `Reading ${comic.title}` : "Reader" };
}

export default async function ReadPage({ params }: PageProps<"/read/[slug]">) {
  const { slug } = await params;
  const comic = getComic(slug);
  if (!comic) notFound();
  // A comic can exist without artwork. Reaching its reader URL directly is a dead end rather than an error, so say so and point back
  if (comic.pages.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyCard}>
          <h1>{comic.title} is not available to read yet</h1>
          <p>The pages for this comic have not been added. Everything else about it is on the comic page.</p>
          <Link href={`/comics/${comic.slug}`} className="btn btn-primary btn-lg"><ArrowLeft size={18} aria-hidden="true" /> Back to {comic.title}</Link>
        </div>
      </div>
    );
  }
  return <Reader comic={comic} />;
}
