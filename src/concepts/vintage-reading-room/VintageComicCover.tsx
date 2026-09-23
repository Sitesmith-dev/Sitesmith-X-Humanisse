import Image from "next/image";
import type { Comic } from "@/types/comic";
import { clothFor } from "./comic-personality";
import styles from "./vintage.module.css";

export function VintageComicCover({ comic, priority = false, className = "" }: { comic: Comic; priority?: boolean; className?: string }) {
  return (
    <div className={`${styles.vcover} ${className}`}>
      {comic.coverImage ? (
        <>
          <Image src={comic.coverImage} alt={`Cover for ${comic.title}`} width={432} height={624} priority={priority} className={styles.vcoverImg} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <span className={styles.duotone} />
          <span className={styles.vcoverFrame} aria-hidden="true" />
        </>
      ) : (
        <div className={styles.vcoverCloth} style={{ background: clothFor(comic.slug) }} aria-hidden="true">
          <span className={styles.vcoverRule} />
          <span className={styles.vcoverEmblem} />
          <span className={styles.vcoverTitle}>{comic.title}</span>
          <span className={styles.vcoverNote}>Binding in progress</span>
          <span className={styles.vcoverRule} />
        </div>
      )}
    </div>
  );
}
