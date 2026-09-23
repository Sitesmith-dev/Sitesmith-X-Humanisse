"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { RotateCw } from "lucide-react";
import styles from "./vintage.module.css";

// A photograph you can turn over: the front is the aged portrait plate, the back is the index card
// a librarian would have clipped behind it, so a whole character bio fits without leaving the page
export function CastCard({
  id, name, role, bio, quote, pos,
}: { id: string; name: string; role: string; bio: string; quote: string; pos: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      className={styles.castCard}
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      aria-label={`${name}, ${open ? "show portrait" : "show details"}`}
    >
      <motion.div
        className={styles.castCardInner}
        animate={{ rotateY: open ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.castCardFace}>
          <div className={styles.castCardPhoto}>
            <Image src={`/characters/references/${id}.png`} alt={name} fill sizes="300px" style={{ objectFit: "cover", objectPosition: pos }} />
            <span className={styles.duotone} />
          </div>
          <span className={styles.plateName}>{role}</span>
          <span className={styles.plateFull}>{name}</span>
          <span className={styles.castFlipHint}><RotateCw size={13} aria-hidden="true" /> Turn the plate over</span>
        </div>
        <div className={`${styles.castCardFace} ${styles.castCardBack}`}>
          <p className={styles.kicker} style={{ marginBottom: 8 }}>{role}</p>
          <h3 className={styles.castBackName}>{name}</h3>
          <p className={styles.castBackBio}>{bio}</p>
          <p className={styles.castQuote}>&ldquo;{quote}&rdquo;</p>
        </div>
      </motion.div>
    </button>
  );
}
