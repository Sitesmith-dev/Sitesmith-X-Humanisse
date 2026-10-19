import Image from "next/image";
import { comics } from "@/content/comics";
import styles from "./Storefront.module.css";

// The complete set's backdrop: the ten comics standing side by side like a boxed set on a shelf, spines out,
// each with a sliver of its cover at the top, its title down the spine and its number in the set at the foot
const tints = ["var(--plum)", "var(--ink)", "var(--coral)"];

// The catalogue's band places it with its own cell; other pages (the cart's header) pass theirs
export function SetShelf({ className = styles.shelfCell }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className={styles.shelf}>
        {comics.map((c, i) => (
          <div key={c.slug} className={styles.spine} style={{ background: tints[i % tints.length] }}>
            <div className={styles.spineArt}>
              {c.coverImage && <Image src={c.coverImage} alt="" width={72} height={104} />}
            </div>
            <span className={styles.spineTitle}>{c.title}</span>
            <span className={styles.spineNo}>{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
