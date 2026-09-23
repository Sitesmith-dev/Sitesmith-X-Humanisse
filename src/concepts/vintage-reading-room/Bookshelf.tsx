"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Comic } from "@/types/comic";
import { clothFor, personality } from "./comic-personality";
import { VintageComicCover as ComicCover } from "./VintageComicCover";
import { base } from "./definition";
import styles from "./vintage.module.css";

// Comics standing on a shelf ledge, only the one built page can be pulled from the shelf, the rest are there to browse
export function Bookshelf({ comics, label }: { comics: Comic[]; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const measure = () => {
    const t = track.current;
    if (!t) return;
    setEdge({ start: t.scrollLeft < 4, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 4 });
  };
  const go = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.7, behavior: "smooth" });
  return (
    <div className={styles.shelfWrap}>
      <ul ref={track} className={styles.shelfTrack} onScroll={measure} tabIndex={0} aria-label={label}>
        {comics.map((c) => {
          const voice = personality[c.slug];
          const inner = (
            <>
              <span className={styles.shelfSpine} style={{ background: clothFor(c.slug) }} aria-hidden="true" />
              <ComicCover comic={c} className={styles.shelfCover} />
              <span className={styles.shelfLabel}>{c.title}</span>
              {voice && <span className={styles.shelfVoice}>&ldquo;{voice.line}&rdquo;</span>}
            </>
          );
          return (
            <li key={c.slug} className={styles.shelfBook}>
              {c.slug === "negotiation" ? (
                <Link href={`${base}/comics/negotiation`} className={styles.shelfLink}>{inner}</Link>
              ) : (
                <div className={styles.shelfLink} aria-disabled="true">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
      <div className={styles.shelfLedge} aria-hidden="true" />
      <div className={styles.shelfNav}>
        <button type="button" onClick={() => go(-1)} disabled={edge.start} aria-label={`Previous, ${label}`}><ChevronLeft size={18} aria-hidden="true" /></button>
        <button type="button" onClick={() => go(1)} disabled={edge.end} aria-label={`Next, ${label}`}><ChevronRight size={18} aria-hidden="true" /></button>
      </div>
    </div>
  );
}
