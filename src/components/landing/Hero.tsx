import { SiteLink as Link } from "@/components/shared/SiteLink";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { copy } from "@/content/preview-copy";
import styles from "./Home.module.css";

const at = (i: number) => ({ "--i": i }) as CSSProperties;

// The brand in one frame: the three characters as panels of a comic page, each in its own illustrated world.
// Everything plays once on load, then holds still. Hover lifts a panel, nothing moves with scroll
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-h">
      <div className={`wrap ${styles.heroGrid}`}>
        <div className={styles.heroText}>
          <h1 id="hero-h" className={styles.h1}>
            <span className={styles.rise} style={at(0)}>Learning should be experienced,</span>{" "}
            <span className={`${styles.rise} ${styles.accent}`} style={at(1)}>not just explained</span>
          </h1>
          <p className={`${styles.sub} ${styles.rise}`} style={at(2)}>{copy.support}</p>
          <div className={`${styles.cta} ${styles.rise}`} style={at(3)}>
            <Link href="/comics" className="btn btn-primary btn-lg">Browse comics <ArrowRight size={20} aria-hidden="true" /></Link>
          </div>
        </div>

        <div className={styles.collage} role="group" aria-label="The three characters of Humanisse">
          <figure className={`${styles.shot} ${styles.s1}`} style={at(0)}>
            <Image src="/characters/hero/professor.webp" alt="The Professor in a purple Future is Human sweater, relaxing in an armchair at a leadership summit" fill priority sizes="(max-width: 900px) 92vw, 300px" />
            <figcaption>Professor</figcaption>
          </figure>
          <figure className={`${styles.shot} ${styles.s2}`} style={at(1)}>
            <Image src="/characters/hero/bot.webp" alt="The Bot in a Learn Lead Humanise cap and a Future is Human hoodie, raising a finger" fill priority sizes="(max-width: 900px) 46vw, 230px" />
            <figcaption>Bot</figcaption>
          </figure>
          <figure className={`${styles.shot} ${styles.s3}`} style={at(2)}>
            <Image src="/characters/hero/cat.webp" alt="The Cat, a white fluffy cat with pigtails at a desk, the Chief Judgment Officer" fill priority sizes="(max-width: 900px) 46vw, 230px" />
            <figcaption>Cat</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
