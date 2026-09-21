import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { CharacterHero } from "@/components/characters/CharacterHero";
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
            <Link href="/#how-it-works" className="btn btn-lg">{copy.secondaryCta}</Link>
          </div>
        </div>
        <div className={`${styles.stageBox} ${styles.fadeUp}`} style={delay(0.3)}>
          <span className={`${styles.bubble} ${styles.b1}`}>Facts inform</span>
          <span className={`${styles.bubble} ${styles.b2}`}>Stories transform</span>
          <Parallax speed={0.1}><CharacterHero /></Parallax>
        </div>
      </div>
    </section>
  );
}
