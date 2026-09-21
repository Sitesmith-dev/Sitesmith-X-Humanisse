import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { comics, getComic } from "@/content/comics";
import { categoryLabels } from "@/types/comic";
import { BuyPanel } from "@/components/comics/BuyPanel";
import { ComicCover } from "@/components/comics/ComicCover";
import { ComicShelf } from "@/components/comics/ComicShelf";
import { VideoPreview } from "@/components/landing/VideoPreview";
import styles from "./comic.module.css";

export function generateStaticParams() {
  return comics.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/comics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getComic(slug)?.title ?? "Comic" };
}

export default async function ComicPage({ params }: PageProps<"/comics/[slug]">) {
  const { slug } = await params;
  const comic = getComic(slug);
  if (!comic) notFound();
  const related = comics.filter((c) => c.slug !== comic.slug && c.category === comic.category).slice(0, 3);
  const more = related.length ? related : comics.filter((c) => c.slug !== comic.slug).slice(0, 3);
  return (
    <>
      <section className={styles.top}>
        <div className={`wrap ${styles.grid}`}>
          <div className={styles.cover}><ComicCover comic={comic} priority /></div>
          <div>
            <p className={styles.crumbs}><Link href="/comics">Comics</Link> / {categoryLabels[comic.category]}</p>
            <h1>{comic.title}</h1>
            <p className="lead">{comic.shortDescription}</p>
            <ul className={styles.tags} aria-label="Concepts">
              {comic.tags.map((t) => <li key={t} className="tag">{t}</li>)}
            </ul>
            <BuyPanel title={comic.title} price={comic.priceLabel} />
          </div>
        </div>
      </section>
      <VideoPreview />
      <section className="section wrap" aria-labelledby="learn-h">
        <h2 id="learn-h">What you will learn</h2>
        <ul className={styles.learn}>
          {comic.outcomes.map((o) => <li key={o}><CheckCircle size={22} aria-hidden="true" /> <span>{o}</span></li>)}
        </ul>
      </section>
      <section className="section wrap" style={{ paddingTop: 0 }} aria-labelledby="rel-h">
        <h2 id="rel-h">You might also like</h2>
        <ComicShelf comics={more} />
        <p style={{ marginTop: 32 }}><Link href="/comics" className="btn">Back to all comics</Link></p>
      </section>
    </>
  );
}
