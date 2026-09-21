"use client";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowRight, Check, Plus, Video } from "lucide-react";
import type { Comic } from "@/types/comic";
import { ComicCover } from "./ComicCover";
import styles from "./Comic.module.css";

type Props = { comic: Comic; inBundle?: boolean; onToggle?: (slug: string) => void; tilt?: boolean };

export function ComicCard({ comic, inBundle = false, onToggle, tilt = false }: Props) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 180, damping: 20 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 180, damping: 20 });
  const canTilt = tilt && !reduce;
  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (!canTilt || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => { mx.set(0); my.set(0); };
  const style = { "--accent": comic.mood.accent, "--accent2": comic.mood.secondaryAccent } as React.CSSProperties;
  return (
    <motion.article className={styles.card} style={canTilt ? { ...style, rotateX, rotateY, transformPerspective: 900 } : style} whileHover={{ y: -4 }} transition={{ duration: 0.2 }} onPointerMove={move} onPointerLeave={leave}>
      <Link href={`/comics/${comic.slug}`} className={styles.coverLink} aria-label={`Open ${comic.title}`} tabIndex={-1}>
        <ComicCover comic={comic} />
      </Link>
      <div className={styles.body}>
        <h3><Link href={`/comics/${comic.slug}`}>{comic.title}</Link></h3>
        <ul className={styles.tags} aria-label="Themes">
          {comic.tags.slice(0, 2).map((t) => <li key={t} className="tag">{t}</li>)}
        </ul>
        <p className={styles.desc}>{comic.shortDescription}</p>
        <p className={styles.meta}>
          <strong className={styles.price}>{comic.priceLabel}</strong>
          {comic.videoAvailable && <span className={styles.video}><Video size={18} aria-hidden="true" /> Video intro</span>}
        </p>
        <div className={styles.actions}>
          <Link href={`/comics/${comic.slug}`} className="btn btn-primary" aria-label={`View comic: ${comic.title}`}>View comic <ArrowRight size={18} aria-hidden="true" /></Link>
          {onToggle && (
            <button type="button" className="btn" aria-pressed={inBundle} onClick={() => onToggle(comic.slug)} aria-label={`${inBundle ? "Remove" : "Add"} ${comic.title} ${inBundle ? "from" : "to"} bundle`}>
              {inBundle ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
              {inBundle ? "In bundle" : "Add"}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
