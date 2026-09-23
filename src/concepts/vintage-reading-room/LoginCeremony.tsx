"use client";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./vintage.module.css";

// The login card arriving like an index card pulled from a catalogue drawer: the drawer face slides back,
// the card rises into place with a little settle, brass corners draw themselves on, a wax seal stamps down,
// then the desk lamp above it keeps a faint, irregular flicker and the card leans very slightly toward the cursor
export function LoginCeremony({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduceMotion = useRef(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(`.${styles.ceremonyDrawer}`, { scaleY: 0.3, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.5, transformOrigin: "top center" })
        .fromTo(`.${styles.ceremonyCard}`, { y: 70, opacity: 0, rotate: -2.5 }, { y: 0, opacity: 1, rotate: 0, duration: 0.75, ease: "back.out(1.5)" }, "-=0.2")
        .fromTo(`.${styles.ceremonyCorner}`, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.08, ease: "power2.out" }, "-=0.25")
        .fromTo(`.${styles.ceremonySeal}`, { scale: 0, rotate: -18 }, { scale: 1, rotate: -8, duration: 0.5, ease: "back.out(3)" }, "-=0.1");

      gsap.to(`.${styles.ceremonyMote}`, {
        y: "-=16", x: "+=6", opacity: 0.75, duration: 3.2, ease: "sine.inOut", stagger: { each: 0.45, from: "random" }, yoyo: true, repeat: -1,
      });

      // An old gas lamp never holds perfectly steady, so the glow behind the card wavers on its own loose loop
      const flicker = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
      flicker
        .to(`.${styles.ceremonyLamp}`, { opacity: 0.55, scale: 0.97, duration: 2.6 })
        .to(`.${styles.ceremonyLamp}`, { opacity: 0.9, scale: 1.02, duration: 1.8 })
        .to(`.${styles.ceremonyLamp}`, { opacity: 0.62, scale: 0.99, duration: 2.2 });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      reduceMotion.current = true;
      gsap.set([`.${styles.ceremonyDrawer}`, `.${styles.ceremonyCard}`, `.${styles.ceremonyCorner}`, `.${styles.ceremonySeal}`], { opacity: 1, scale: 1, y: 0, rotate: 0 });
    });
  }, { scope });

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion.current) return;
    const box = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - box.left) / box.width - 0.5;
    const py = (e.clientY - box.top) / box.height - 0.5;
    setTilt({ x: px * -6, y: py * 6 });
  };
  const onPointerLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div ref={scope} className={styles.ceremonyStage} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <span className={styles.ceremonyLamp} aria-hidden="true" />
      <div className={styles.ceremonyDrawer} aria-hidden="true">
        <span className={styles.ceremonyHandle} />
      </div>
      <span className={`${styles.ceremonyMote} ${styles.ceremonyMote1}`} aria-hidden="true" />
      <span className={`${styles.ceremonyMote} ${styles.ceremonyMote2}`} aria-hidden="true" />
      <span className={`${styles.ceremonyMote} ${styles.ceremonyMote3}`} aria-hidden="true" />
      <span className={`${styles.ceremonyMote} ${styles.ceremonyMote4}`} aria-hidden="true" />
      <span className={`${styles.ceremonyMote} ${styles.ceremonyMote5}`} aria-hidden="true" />
      <div className={styles.ceremonyCard}>
        <div
          className={styles.ceremonyCardTilt}
          style={{ transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`, transition: "transform .35s ease-out" }}
        >
          <span className={`${styles.ceremonyCorner} ${styles.ceremonyCornerTl}`} aria-hidden="true" />
          <span className={`${styles.ceremonyCorner} ${styles.ceremonyCornerTr}`} aria-hidden="true" />
          <span className={`${styles.ceremonyCorner} ${styles.ceremonyCornerBl}`} aria-hidden="true" />
          <span className={`${styles.ceremonyCorner} ${styles.ceremonyCornerBr}`} aria-hidden="true" />
          <span className={styles.ceremonySeal} aria-hidden="true">EST</span>
          {children}
        </div>
      </div>
    </div>
  );
}
