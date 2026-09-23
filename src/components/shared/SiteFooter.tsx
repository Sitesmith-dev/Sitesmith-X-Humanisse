import { SiteLink as Link } from "@/components/shared/SiteLink";
import styles from "./Shared.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <h2>Humanisse</h2>
        <p>
          A learning company that uses original comics, cinema and literature to make important
          life and professional ideas simple, memorable and enjoyable
        </p>
        <nav aria-label="Footer" className={styles.footNav}>
          <Link href="/comics">Comics</Link>
          <Link href="/library">My Library</Link>
          <Link href="/login">Log in</Link>
        </nav>
        <p className={styles.note}>Design preview, all comics, prices and actions are demonstration content</p>
      </div>
    </footer>
  );
}
