import { SiteLink as Link } from "@/components/shared/SiteLink";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { BrandPlate } from "./BrandPlate";
import { Parallax } from "@/components/shared/Scroll";
import { copy } from "@/content/preview-copy";
import styles from "./Landing.module.css";

const words = copy.headline.split(" ");
const at = (i: number) => ({ "--i": i }) as CSSProperties;
const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`wrap ${styles.heroGrid}`}>
        <div>
          <h1 className={styles.h1} aria-label={copy.headline}>
            {words.map((w, i) => (
              <span key={w + i} className={styles.wordMask} aria-hidden="true"><span style={at(i)}>{w}</span></span>
            ))}
          </h1>
          <p className={`lead ${styles.fadeUp}`} style={delay(0.55)}>{copy.support}</p>
          <div className={`${styles.actions} ${styles.fadeUp}`} style={delay(0.7)}>
            <Link href="/comics" className="btn btn-primary btn-lg">{copy.primaryCta} <ArrowRight size={20} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className={`${styles.stageBox} ${styles.fadeUp}`} style={delay(0.3)}>
          <Parallax speed={0.1}><BrandPlate /></Parallax>
        </div>
      </div>
    </section>
  );
}
