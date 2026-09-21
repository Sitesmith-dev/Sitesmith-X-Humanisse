"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Comic } from "@/types/comic";
import { ComicCard } from "./ComicCard";
import styles from "./Comic.module.css";

export function ComicCarousel({ comics, label, bleed = false }: { comics: Comic[]; label: string; bleed?: boolean }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const progress = useMotionValue(0);
  const onScroll = () => {
    const t = track.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    progress.set(max > 0 ? t.scrollLeft / max : 0);
    setEdge({ start: t.scrollLeft < 4, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 4 });
  };
  const go = (dir: 1 | -1) => {
    const t = track.current;
    if (t) t.scrollBy({ left: dir * t.clientWidth * 0.7, behavior: "smooth" });
  };
  return (
    <div className={`${styles.carousel} ${bleed ? styles.bleed : ""}`}>
      <div className={`${bleed ? "wrap " : ""}${styles.carouselNav}`}>
        <div className={styles.progress} aria-hidden="true"><motion.span style={{ scaleX: progress }} /></div>
        <button type="button" className="btn" onClick={() => go(-1)} disabled={edge.start} aria-label={`Previous ${label}`}><ChevronLeft aria-hidden="true" /></button>
        <button type="button" className="btn" onClick={() => go(1)} disabled={edge.end} aria-label={`Next ${label}`}><ChevronRight aria-hidden="true" /></button>
      </div>
      <ul ref={track} className={styles.track} onScroll={onScroll} tabIndex={0} aria-label={label}>
        {comics.map((c) => <li key={c.slug} className={styles.slide}><ComicCard comic={c} tilt /></li>)}
      </ul>
    </div>
  );
}
