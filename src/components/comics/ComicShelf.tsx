import type { Comic } from "@/types/comic";
import { ComicCard } from "./ComicCard";
import styles from "./Comic.module.css";

export function ComicShelf({ comics }: { comics: Comic[] }) {
  return (
    <ul className={styles.grid}>
      {comics.map((c) => <li key={c.slug}><ComicCard comic={c} /></li>)}
    </ul>
  );
}
