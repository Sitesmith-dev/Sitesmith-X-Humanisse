"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { RotateCw } from "lucide-react";
import styles from "./Landing.module.css";

const artSrc = (id: string) => (id === "cat" ? "/characters/references/cat-illustrated.png" : `/characters/references/${id}.png`);

// A trading card you can turn over: the front is the illustrated panel, the back is the character's
// own file card, built in Direction A's bold ink and pop-shadow language rather than a hover tooltip
export function CastFlipCard({
  id, role, name, text, bio, quote, alt, pos, accent,
}: {
  id: string; role: string; name: string; text: string; bio: string; quote: string; alt: string; pos: string;
  accent: "gold" | "ink" | "plum";
}) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      className={styles.flipCard}
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      aria-label={`${name}, ${open ? "show the panel" : "show the file card"}`}
    >
      <motion.div
        className={styles.flipInner}
        animate={{ rotateY: open ? 180 : 0, scale: [1, 1.07, 1], y: [0, -10, 0] }}
        transition={{
          rotateY: { duration: 0.7, ease: [0.645, 0.045, 0.355, 1] },
          scale: { duration: 0.7, times: [0, 0.5, 1], ease: ["easeOut", "easeIn"] },
          y: { duration: 0.7, times: [0, 0.5, 1], ease: ["easeOut", "easeIn"] },
        }}
      >
        <article className={styles.flipFace}>
          <div className={styles.artImg}>
            <Image src={artSrc(id)} alt={alt} fill sizes="(max-width: 900px) 100vw, 380px" style={{ objectFit: "cover", objectPosition: pos }} />
          </div>
          <div className={styles.artBody}>
            <span className={styles.artRole}>{role}</span>
            <h3>{name}</h3>
            <p>{text}</p>
            <span className={styles.flipHint}><RotateCw size={14} aria-hidden="true" /> Turn the card over</span>
          </div>
        </article>
        <article className={`${styles.flipFace} ${styles.flipBack} ${styles[`flipBack_${accent}`]}`}>
          <span className={styles.artRole}>{role}</span>
          <h3>{name}</h3>
          <p className={styles.flipBio}>{bio}</p>
          <p className={styles.flipQuote}>&ldquo;{quote}&rdquo;</p>
        </article>
      </motion.div>
    </button>
  );
}
