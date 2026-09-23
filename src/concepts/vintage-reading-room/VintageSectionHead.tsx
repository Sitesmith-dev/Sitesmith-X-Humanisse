import { Reveal } from "./Reveal";
import { Ornament } from "./Ornament";
import styles from "./vintage.module.css";

export function VintageSectionHead({ id, kicker, title, lead, light = false }: { id: string; kicker: string; title: string; lead?: string; light?: boolean }) {
  return (
    <Reveal className={`${styles.secHead} ${light ? styles.secHeadLight : ""}`}>
      <p className={styles.kicker}>{kicker}</p>
      <h2 id={id} className={styles.h2}>{title}</h2>
      <Ornament className={styles.secOrnament} />
      {lead && <p className={styles.lead}>{lead}</p>}
    </Reveal>
  );
}
