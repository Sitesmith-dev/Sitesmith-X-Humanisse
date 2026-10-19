"use client";
import { AnimatePresence, motion } from "motion/react";
import { getComic } from "@/content/comics";
import { ComicCover } from "@/components/comics/ComicCover";
import { SetShelf } from "@/components/comics/SetShelf";
import { useCart } from "./CartContext";
import styles from "./CartCovers.module.css";

// The cart header's display: the covers in the cart, fanned on the right of the gold band like the Comic Collection
// hero, or the complete set's shelf once all ten are in. Every count has one fixed arrangement, so the same number
// of comics always lands the same way.
const W = 132; // cover width in px, matching .cover in the stylesheet

type Spot = { x: number; y: number; r: number; s: number; z: number };

// Small fixed nudges that loosen the larger, two-row hands so they look dealt rather than ruled
const NUDGE_R = [2, -3, 1, -2, 3, -1, 2, -3, 1];
const NUDGE_Y = [4, -3, 5, -2, 3, -4, 2, -5, 3];

function arrange(n: number): Spot[] {
  let spots: Spot[];
  if (n <= 6) {
    // One fan: the middle cover tallest and upright, each step out smaller, lower and turned further
    const mid = (n - 1) / 2;
    const step = W * (n <= 2 ? 0.72 : n <= 4 ? 0.54 : 0.45);
    spots = Array.from({ length: n }, (_, i) => {
      const o = i - mid, a = Math.abs(o);
      return { x: o * step, y: a * a * 5 + a * 6, r: o * 8, s: 1 - 0.07 * a, z: 20 - Math.round(a * 2) };
    });
  } else {
    // Seven or more: a front row of the first picks over a smaller back row, offset between them
    const front = Math.ceil(n / 2), back = n - front;
    spots = Array.from({ length: n }, (_, i) => {
      const inFront = i < front;
      const o = inFront ? i - (front - 1) / 2 : i - front - (back - 1) / 2, a = Math.abs(o);
      return inFront
        ? { x: o * W * 0.5, y: 12 + a * 6 + NUDGE_Y[i], r: o * 6 + NUDGE_R[i], s: 0.92, z: 20 - Math.round(a * 2) }
        : { x: o * W * 0.56, y: -46 + a * 5 + NUDGE_Y[i], r: o * 5 + NUDGE_R[i], s: 0.8, z: 8 - Math.round(a * 2) };
    });
  }
  // Centre the arrangement vertically on the band
  const ys = spots.map((p) => p.y);
  const shift = (Math.min(...ys) + Math.max(...ys)) / 2;
  return spots.map((p) => ({ ...p, y: p.y - shift }));
}

export function CartCovers() {
  const { items, ready, isFullSet } = useCart();
  if (!ready) return null;
  const picked = items.map(getComic).filter((c) => c !== undefined);
  const spots = arrange(picked.length);

  return (
    <div className={styles.stage} aria-hidden="true">
      <AnimatePresence>
        {isFullSet ? (
          <motion.div key="set" className={styles.set} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <SetShelf className={styles.shelf} />
          </motion.div>
        ) : (
          picked.map((c, i) => {
            const p = spots[i];
            return (
              <motion.div
                key={c.slug}
                className={styles.cover}
                style={{ zIndex: p.z }}
                initial={{ opacity: 0, x: p.x, y: p.y + 28, rotate: p.r, scale: p.s * 0.9 }}
                animate={{ opacity: 1, x: p.x, y: p.y, rotate: p.r, scale: p.s }}
                exit={{ opacity: 0, scale: p.s * 0.85, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
              >
                <ComicCover comic={c} />
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
}
