import Image from "next/image";
import type { Comic } from "@/types/comic";
import styles from "./Comic.module.css";

export function ComicCover({ comic, priority = false, className = "" }: { comic: Comic; priority?: boolean; className?: string }) {
  const style = { "--accent": comic.mood.accent, "--accent2": comic.mood.secondaryAccent } as React.CSSProperties;
  return (
    <div className={`${styles.cover} ${className}`} style={style} data-texture={comic.mood.texture}>
      {comic.coverImage ? (
        <Image src={comic.coverImage} alt={`Placeholder cover for ${comic.title}`} width={432} height={624} priority={priority} style={{ width: "100%", height: "100%" }} />
      ) : (
        <div className={styles.placeholder} aria-hidden="true">
          <span className={styles.burst} />
          <span className={styles.initial}>{comic.title[0]}</span>
          <span className={styles.ptitle}>{comic.title}</span>
          <span className={styles.soon}>Cover coming soon</span>
        </div>
      )}
    </div>
  );
}
