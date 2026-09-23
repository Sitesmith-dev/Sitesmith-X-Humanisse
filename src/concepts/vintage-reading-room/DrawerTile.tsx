"use client";
import { useState } from "react";
import { motion } from "motion/react";
import styles from "./vintage.module.css";

// A card catalogue drawer front: press it and it slides open on its runners, the way the real thing would,
// revealing the description that a flat list would have shown all the time and lost its charm doing so
export function DrawerTile({ index, title, text }: { index: number; title: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      className={styles.drawer}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-expanded={open}
    >
      <span className={styles.drawerFace}>
        <span className={styles.drawerHandle} aria-hidden="true" />
        <span className={styles.drawerPlate}>
          <span className={styles.drawerNo}>No. {String(index + 1).padStart(2, "0")}</span>
          <span className={styles.drawerTitle}>{title}</span>
        </span>
      </span>
      <motion.span
        className={styles.drawerInner}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <span className={styles.drawerText}>{text}</span>
      </motion.span>
    </button>
  );
}
