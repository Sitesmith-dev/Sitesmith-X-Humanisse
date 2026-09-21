"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Comic } from "@/types/comic";
import { ComicCover } from "@/components/comics/ComicCover";
import { SectionHead } from "@/components/shared/SectionHead";
import styles from "./Landing.module.css";

// A compact shelf: just the covers with a title and price, like spines on a comic shop wall
export function PopularShelf({ comics }: { comics: Comic[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false, scrolls: false });
  const measure = () => {
    const t = track.current;
    if (!t) return;
    setEdge({ start: t.scrollLeft < 4, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 4, scrolls: t.scrollWidth > t.clientWidth + 4 });
  };
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    return () => ro.disconnect();
  }, []);
  const go = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.7, behavior: "smooth" });

  return (
    <div className="wrap">
      <SectionHead id="feat-h" title="Popular comics" lead="Fresh off the shelf, pick a cover and step into the story">
        <div className={styles.shelfTools}>
          {edge.scrolls && (
            <>
              <button type="button" className="btn" onClick={() => go(-1)} disabled={edge.start} aria-label="Previous comics"><ChevronLeft aria-hidden="true" /></button>
              <button type="button" className="btn" onClick={() => go(1)} disabled={edge.end} aria-label="Next comics"><ChevronRight aria-hidden="true" /></button>
            </>
          )}
          <Link href="/comics" className="btn btn-primary">See all <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </SectionHead>
      <ul ref={track} className={styles.shelf} onScroll={measure} tabIndex={0} aria-label="Popular comics">
        {comics.map((c) => (
          <li key={c.slug} className={styles.shelfItem}>
            <Link href={`/comics/${c.slug}`} aria-label={`${c.title}, ${c.priceLabel}`}>
              <ComicCover comic={c} className={styles.shelfCover} />
              <span className={styles.shelfTitle}>{c.title}</span>
              <span className={styles.shelfPrice}>{c.priceLabel}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
