import Image from "next/image";
import styles from "./Characters.module.css";

export function CharacterFallback() {
  return (
    <div className={styles.fallback}>
      {(["professor", "bot", "cat"] as const).map((id) => (
        <Image key={id} src={`/characters/posters/${id}.jpg`} alt="" width={300} height={420} className={styles.poster} priority={id === "bot"} />
      ))}
    </div>
  );
}
