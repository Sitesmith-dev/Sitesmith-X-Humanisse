import { SiteLink as Link } from "@/components/shared/SiteLink";
import type { ReactNode } from "react";
import { BookOpen, CheckCircle } from "lucide-react";
import { comics } from "@/content/comics";
import { categoryLabels, type Comic } from "@/types/comic";
import { BuyPanel } from "./BuyPanel";
import { ComicCover } from "./ComicCover";
import { ComicShelf } from "./ComicShelf";
import { VideoPreview } from "@/components/landing/VideoPreview";
import styles from "./ComicPanel.module.css";

// The one copy of the comic view, shared by the pop-up and the standalone page. `topbar` is the row above the cover,
// the standalone page puts its Back link there and the pop-up overlays its own chrome on the same spot
export function ComicPanel({ comic, topbar }: { comic: Comic; topbar?: ReactNode }) {
  const related = comics.filter((c) => c.slug !== comic.slug && c.category === comic.category).slice(0, 3);
  const more = related.length ? related : comics.filter((c) => c.slug !== comic.slug).slice(0, 3);
  return (
    <>
      <section className={styles.top}>
        <div className="wrap">
          <div className={styles.topbar}>{topbar}</div>
          <div className={styles.grid}>
            <div className={styles.cover}><ComicCover comic={comic} priority /></div>
            <div>
              <p className={styles.crumbs}><Link href="/comics">Comics</Link> / {categoryLabels[comic.category]}</p>
              <h1 id="comic-h">{comic.title}</h1>
              <p className="lead">{comic.shortDescription}</p>
              <ul className={styles.tags} aria-label="Concepts">
                {comic.tags.map((t) => <li key={t} className="tag">{t}</li>)}
              </ul>
              <BuyPanel slug={comic.slug} title={comic.title} price={comic.priceLabel} />
              {comic.pages.length > 0 && (
                <div className={styles.preview}>
                  <Link href={`/read/${comic.slug}`} className="btn"><BookOpen size={18} aria-hidden="true" /> Preview</Link>
                  <p className={styles.previewNote}>Read the first pages in the full screen reader</p>
                </div>
              )}
            </div>
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
