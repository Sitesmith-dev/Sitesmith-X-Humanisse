import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { getComic } from "@/content/comics";
import { ComicCover } from "./ComicCover";
import { Parallax } from "@/components/shared/Scroll";
import styles from "./ComicsHero.module.css";

// Five covers fanned on a lit podium, Negotiation centre and forward since it is the one finished cover, the rest carry the styled placeholder
const fan = [
  { slug: "resilience", pos: styles.farLeft, d: 0.2 },
  { slug: "ethics", pos: styles.left, d: 0.1 },
  { slug: "negotiation", pos: styles.centre, d: 0 },
  { slug: "leadership", pos: styles.right, d: 0.1 },
  { slug: "communication", pos: styles.farRight, d: 0.2 },
].map((c) => ({ ...c, comic: getComic(c.slug)! }));

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function ComicsHero() {
  return (
    <section className={styles.hero} aria-labelledby="comics-h">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <div className={styles.plaque}>
            <h1 id="comics-h" className={styles.h1}>
              <span className={styles.over}>The complete</span>{" "}
              <span className={styles.title}>Comic Collection</span>
            </h1>
            <p className={styles.sub}>Ten stories, ten ideas worth keeping</p>
          </div>
          <p className="lead">Ten stories, ten ideas worth keeping, so pick one, watch its short introduction, then read it in your library</p>
          <p className="notice"><span className="demo">Preview</span> Titles, descriptions, covers and prices are samples</p>
          <div className={styles.actions}>
            <Link href="#all-h" className="btn btn-primary btn-lg">Browse all ten <ArrowRight size={20} aria-hidden="true" /></Link>
            <Link href="#complete-set" className="btn btn-lg">The complete set</Link>
          </div>
        </div>

        <div className={styles.stage}>
          <div className={styles.raysBox} aria-hidden="true">
            <Parallax speed={0.12} className={styles.raysDrift}><div className={styles.rays} /></Parallax>
          </div>
          <span className={`${styles.bubble} ${styles.b1}`} aria-hidden="true">Ten ideas</span>
          <span className={`${styles.bubble} ${styles.b2}`} aria-hidden="true">One story each</span>
          <span className={styles.burst} aria-hidden="true"><span>Launch set</span></span>
          <ul className={styles.fan} aria-label="A selection of the launch comics">
            {fan.map((c) => (
              <li key={c.slug} className={`${styles.cover} ${c.pos}`} style={delay(c.d)}>
                <ComicCover comic={c.comic} priority={c.slug === "negotiation"} />
              </li>
            ))}
          </ul>
          <div className={styles.podium} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
