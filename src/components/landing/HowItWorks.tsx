import Image from "next/image";
import { Play } from "lucide-react";
import { getComic } from "@/content/comics";
import { copy } from "@/content/preview-copy";
import { ComicCover } from "@/components/comics/ComicCover";
import { Reveal } from "@/components/shared/Motion";
import { SectionHead } from "@/components/shared/SectionHead";
import styles from "./Landing.module.css";

const shelf = ["negotiation", "ethics", "resilience"].map((s) => getComic(s)!);
const featured = getComic("negotiation")!;

// Each preview shows exactly what its step says, built from the site's real covers, art and controls
function Preview({ i }: { i: number }) {
  if (i === 0) {
    return (
      <div className={styles.pvShelf}>
        <div className={styles.pvCovers}>
          {shelf.map((c) => <div key={c.slug} className={styles.pvCover}><ComicCover comic={c} /></div>)}
        </div>
        <ul className={styles.pvChips}>{shelf.map((c) => <li key={c.slug} className="tag">{c.theme}</li>)}</ul>
      </div>
    );
  }
  if (i === 1) {
    return (
      <div className={styles.pvVideo}>
        <Image src="/characters/references/professor.png" alt="The Professor introducing a comic" fill sizes="(max-width: 900px) 100vw, 280px" style={{ objectFit: "cover", objectPosition: "50% 30%" }} />
        <span className={styles.pvPlay} aria-hidden="true"><Play size={22} /></span>
      </div>
    );
  }
  if (i === 2) {
    return (
      <div className={styles.pvCard} aria-hidden="true">
        <div className={styles.pvRow}>
          <div className={styles.pvThumb}><ComicCover comic={featured} /></div>
          <div>
            <strong>{featured.title}</strong>
            <span className={styles.pvSub}>Choose how to buy</span>
          </div>
        </div>
        <span className={`${styles.pvOption} ${styles.pvOn}`}><span>Single comic</span><strong>₹199</strong></span>
        <span className={styles.pvOption}><span>Complete set</span><strong>₹1,499</strong></span>
      </div>
    );
  }
  return (
    <div className={styles.pvCard} aria-hidden="true">
      <div className={styles.pvRow}>
        <div className={styles.pvThumb}><ComicCover comic={featured} /></div>
        <div>
          <strong>{featured.title}</strong>
          <span className={styles.pvSub}>60% read</span>
        </div>
      </div>
      <span className={styles.pvBar}><span /></span>
      <span className={styles.pvBtn}>Continue Reading</span>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="band band-paper" id="how-it-works" aria-labelledby="how-h">
      <div className="wrap">
        <SectionHead id="how-h" title="How it works" lead="Four simple steps from curiosity to a story you can keep" />
        <ol className={styles.hwGrid}>
          {copy.steps.map((s, i) => (
            <li key={s.title} className={styles.hwItem}>
              <Reveal delay={i * 0.07} className={styles.fill}>
                <article className={styles.hwCard}>
                  <div className={styles.hwMedia}><Preview i={i} /></div>
                  <div className={styles.hwBody}>
                    <h3><span className={styles.hwNum} aria-hidden="true">{i + 1}</span>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
