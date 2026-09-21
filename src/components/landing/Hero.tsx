"use client";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { CharacterHero } from "@/components/characters/CharacterHero";
import { Parallax } from "@/components/shared/Scroll";
import { copy } from "@/content/preview-copy";
import styles from "./Landing.module.css";

const words = copy.headline.split(" ");

export function Hero() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from("[data-word]", { yPercent: 110, duration: 0.8, stagger: 0.06 })
        .from("[data-hero]", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, "-=0.45")
        .from("[data-stage]", { opacity: 0, y: 30, duration: 0.9 }, "-=0.9");
    });
  }, { scope: root });

  return (
    <section className={styles.hero} ref={root}>
      <Parallax speed={0.5} className={styles.glowA}><span /></Parallax>
      <Parallax speed={0.3} className={styles.glowB}><span /></Parallax>
      <div className={`wrap ${styles.heroGrid}`}>
        <div>
          <h1 className={styles.h1} aria-label={copy.headline}>
            {words.map((w, i) => (
              <span key={w + i} className={styles.wordMask} aria-hidden="true"><span data-word>{w}</span></span>
            ))}
          </h1>
          <p className="lead" data-hero>{copy.support}</p>
          <div className={styles.actions} data-hero>
            <Link href="/comics" className="btn btn-primary btn-lg">{copy.primaryCta} <ArrowRight size={20} aria-hidden="true" /></Link>
            <Link href="/#how-it-works" className="btn btn-lg">{copy.secondaryCta}</Link>
          </div>
        </div>
        <div data-stage className={styles.stageBox}>
          <span className={`${styles.bubble} ${styles.b1}`}>Facts inform</span>
          <span className={`${styles.bubble} ${styles.b2}`}>Stories transform</span>
          <Parallax speed={0.1}><CharacterHero /></Parallax>
        </div>
      </div>
    </section>
  );
}
