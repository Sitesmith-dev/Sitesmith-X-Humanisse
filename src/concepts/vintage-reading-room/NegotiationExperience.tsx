"use client";
import Link from "next/link";
import { ArrowLeft, Check, Plus } from "lucide-react";
import { comics, getComic } from "@/content/comics";
import { useCart } from "@/components/cart/CartContext";
import { Bookshelf } from "./Bookshelf";
import { personality } from "./comic-personality";
import { VintageComicCover as ComicCover } from "./VintageComicCover";
import { Ornament } from "./Ornament";
import { Reveal } from "./Reveal";
import { VintageRoot } from "./VintageRoot";
import { VintageSectionHead } from "./VintageSectionHead";
import { base } from "./definition";
import styles from "./vintage.module.css";

const comic = getComic("negotiation")!;
const related = comics.filter((c) => c.category === comic.category && c.slug !== comic.slug);

export function NegotiationExperience() {
  const { has, toggle } = useCart();
  const inList = has(comic.slug);
  return (
    <VintageRoot className={styles.root}>
      <section className={styles.chapterHero}>
        <div className={`wrap ${styles.chapterGrid}`}>
          <Reveal className={styles.chapterCover}>
            <Link href={`${base}/comics`} className={styles.btnGhost}><ArrowLeft size={16} aria-hidden="true" /> Back to the catalogue</Link>
            <div className={styles.plateFrame}>
              <ComicCover comic={comic} priority />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.kicker}>Chapter One</p>
            <h1 className={styles.h1small}>{comic.title}</h1>
            <Ornament className={styles.heroOrnament} />
            <p className={styles.lead}>{comic.shortDescription}</p>
            {personality[comic.slug] && (
              <p className={styles.chapterVoice} style={{ margin: "0 0 16px" }}>&ldquo;{personality[comic.slug].line}&rdquo; <span>{personality[comic.slug].voice}</span></p>
            )}
            <ul className={styles.chapterTags}>{comic.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            <div className={styles.buyCard}>
              <span className={styles.wax}>{comic.priceLabel}</span>
              <p className={styles.buyNote}>Sample price</p>
              <button type="button" className={styles.btnPrimary} style={{ width: "100%", justifyContent: "center" }} onClick={() => toggle(comic.slug)}>
                {inList ? <><Check size={18} aria-hidden="true" /> In your cart</> : <><Plus size={18} aria-hidden="true" /> Add to Cart</>}
              </button>
              {inList && <Link href={`${base}/cart`} className={styles.btnGhost} style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>View cart</Link>}
              <p className={styles.buyDisclosure}>No payment is taken and nothing has been purchased</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.pageHead} style={{ borderTop: "none" }}>
        <div className="wrap">
          <p className={styles.kicker}>What You Will Learn</p>
          <ol className={styles.learnList}>
            {comic.outcomes.map((o, i) => (
              <Reveal as="li" key={o} delay={i * 0.06} className={styles.learnRow}>
                <span className={styles.learnNum}>{i + 1}</span>
                <span>{o}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {related.length > 0 && (
        <section className={styles.shelfSection} aria-labelledby="related-h">
          <div className="wrap">
            <VintageSectionHead id="related-h" kicker="From the Same Shelf" title="You might also like" />
          </div>
          <div className="wrap">
            <Bookshelf comics={related} label="You might also like" />
          </div>
        </section>
      )}
    </VintageRoot>
  );
}
