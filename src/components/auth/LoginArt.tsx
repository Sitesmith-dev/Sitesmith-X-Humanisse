"use client";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./LoginArt.module.css";

gsap.registerPlugin(useGSAP);

// GSAP drives the endless sun-ray spin, the panel entrance and the gentle float, all skipped for reduced motion
export function LoginArt({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to("[data-rays]", { rotation: 360, duration: 70, ease: "none", repeat: -1 });
      gsap.timeline({ defaults: { ease: "back.out(1.5)" } })
        .from("[data-panel]", { y: 46, opacity: 0, scale: 0.92, duration: 0.7, stagger: 0.12 })
        .from("[data-pop]", { scale: 0, opacity: 0, rotate: -12, duration: 0.5, stagger: 0.12, ease: "back.out(2.4)" }, "-=0.3")
        .from("[data-card]", { x: 40, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.1);
      gsap.to("[data-float]", { y: -9, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: { each: 0.5, from: "random" } });
    });
  }, { scope: root });

  return (
    <section className={styles.page} ref={root}>
      <div className={styles.rays} data-rays aria-hidden="true" />
      <div className={styles.dots} aria-hidden="true" />
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.brand}>
          <p className="pill" data-pop>Your reading room</p>
          <h2 className={styles.h}>Every comic you own, waiting where you left it</h2>
          <p className="lead">Log in to pick up your story, track your progress and find what to read next</p>
          <div className={styles.comic} aria-hidden="true">
            <span className={styles.caption} data-pop>Meanwhile, in your library</span>
            <div className={styles.panels}>
              <figure className={`${styles.panel} ${styles.big}`} data-panel data-float>
                <Image src="/characters/posters/bot.jpg" alt="" fill sizes="260px" style={{ objectFit: "cover", objectPosition: "50% 30%" }} />
                <span className={`${styles.bubble} ${styles.bA}`} data-pop>Welcome back</span>
              </figure>
              <figure className={styles.panel} data-panel data-float>
                <Image src="/characters/posters/professor.jpg" alt="" fill sizes="200px" style={{ objectFit: "cover", objectPosition: "50% 20%" }} />
                <span className={`${styles.bubble} ${styles.bB}`} data-pop>Where were we</span>
              </figure>
              <figure className={styles.panel} data-panel data-float>
                <Image src="/characters/posters/cat.jpg" alt="" fill sizes="200px" style={{ objectFit: "cover", objectPosition: "50% 25%" }} />
                <span className={`${styles.bubble} ${styles.bC}`} data-pop>Read on</span>
              </figure>
            </div>
            <span className={styles.burst} data-pop><span>Hello again</span></span>
          </div>
        </div>
        <div data-card>{children}</div>
      </div>
    </section>
  );
}
