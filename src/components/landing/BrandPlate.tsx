"use client";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Landing.module.css";

const cast = [
  { id: "cat", pos: "50% 32%" },
  { id: "professor", pos: "35% 18%" },
  { id: "bot", pos: "50% 15%" },
] as const;

const artSrc = (id: string) => (id === "cat" ? "/characters/references/cat-illustrated.png" : `/characters/references/${id}.png`);

// The art stays its real colour throughout, a warm light drifts behind it and follows the
// cursor instead, the way a lamp picks out a page without changing the ink on it, replacing the old 3D stage
export function BrandPlate() {
  const ref = useRef<HTMLDivElement>(null);
  const spot = useRef({ x: 62, y: 42 });

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const setX = gsap.quickSetter(el, "--spot-x", "") as (v: number) => void;
      const setY = gsap.quickSetter(el, "--spot-y", "") as (v: number) => void;
      const move = (x: number, y: number) => {
        gsap.to(spot.current, {
          x, y, duration: 0.7, ease: "power3.out",
          onUpdate: () => { setX(spot.current.x); setY(spot.current.y); },
        });
      };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        move(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
      };
      const onLeave = () => move(62, 42);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); };
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={styles.plate} style={{ "--spot-x": 62, "--spot-y": 42 } as React.CSSProperties}>
      <span className={styles.plateGlow} aria-hidden="true" />
      {cast.map((c) => (
        <figure key={c.id} className={`${styles.plateFigure} ${styles[`plate_${c.id}`]}`}>
          <div className={styles.fill}>
            <Image src={artSrc(c.id)} alt="" fill priority={c.id === "professor"} sizes="(max-width: 900px) 46vw, 230px" style={{ objectFit: "cover", objectPosition: c.pos }} />
          </div>
        </figure>
      ))}
      <span className={styles.plateBadge}>Facts inform, stories transform</span>
    </div>
  );
}
