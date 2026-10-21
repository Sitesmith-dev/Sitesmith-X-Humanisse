import { SiteLink as Link } from "@/components/shared/SiteLink";
import type { ReactNode } from "react";
import { BookOpen, Check } from "lucide-react";
import { introVideos } from "@/content/intro-videos";
import type { Comic } from "@/types/comic";
import { IntroStage } from "@/components/shared/IntroStage";
import { BuyPanel } from "./BuyPanel";
import { ComicCover } from "./ComicCover";
import styles from "./ComicPanel.module.css";

// The one copy of the comic view, shared by the pop-up and the standalone page, kept to a single short scroll:
// who it is and how to buy it, then what it is about, what you will learn and the introduction video.
// `topbar` is the row above the cover, the standalone page puts its Back link there
export function ComicPanel({ comic, topbar }: { comic: Comic; topbar?: ReactNode }) {
  return (
    <>
      <section className={styles.top}>
        <div className="wrap">
          <div className={styles.topbar}>{topbar}</div>
          <div className={styles.head}>
            <div className={styles.cover}><ComicCover comic={comic} priority /></div>
            <div className={styles.title}>
              <h1 id="comic-h">{comic.title}</h1>
              <p className={styles.tagline}>{comic.tagline}</p>
              <ul className={styles.tags} aria-label="Concepts">
                {comic.tags.map((t) => <li key={t} className="tag">{t}</li>)}
              </ul>
            </div>
            <div className={styles.buy}>
              <BuyPanel slug={comic.slug} title={comic.title} price={comic.priceLabel} />
              {comic.pages.length > 0 && (
                <Link href={`/read/${comic.slug}`} className={styles.previewLink}><BookOpen size={18} aria-hidden="true" /> Read a free preview</Link>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className={`wrap ${styles.body}`} aria-labelledby="about-h">
        <div className={styles.text}>
          <h2 id="about-h">About this comic</h2>
          <p>{comic.description}</p>
          {comic.closing && <p className={styles.closing}>{comic.closing}</p>}
          <h2 id="learn-h" className={styles.learnHead}>What you will learn</h2>
          <ul className={styles.learn} aria-labelledby="learn-h">
            {comic.outcomes.map((o) => <li key={o}><Check size={18} aria-hidden="true" /> <span>{o}</span></li>)}
          </ul>
        </div>
        <div className={styles.video}>
          <IntroStage title={comic.title} subtitle="An introduction with Prof. Rao" src={introVideos[comic.slug]} />
        </div>
      </section>
    </>
  );
}
