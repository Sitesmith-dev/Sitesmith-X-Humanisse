import { BookOpen } from "lucide-react";
import { comics } from "@/content/comics";
import styles from "./Landing.module.css";

// The page's one endless loop, it pauses on hover and stops for reduced motion
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className={styles.marqueeRow} aria-hidden={hidden || undefined}>
      {comics.map((c) => <li key={c.slug}>{c.title}<BookOpen size={20} aria-hidden="true" /></li>)}
    </ul>
  );
  return (
    <div className={styles.marquee} role="region" aria-label="Comic subjects">
      <div className={styles.marqueeTrack}>{row(false)}{row(true)}</div>
    </div>
  );
}
