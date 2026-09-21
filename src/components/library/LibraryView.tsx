"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, BookOpen, CheckCircle2, LogIn } from "lucide-react";
import { comics, getComic } from "@/content/comics";
import type { LibraryItem } from "@/types/library";
import { ComicCarousel } from "@/components/comics/ComicCarousel";
import { ComicCover } from "@/components/comics/ComicCover";
import { Reveal } from "@/components/shared/Motion";
import styles from "./Library.module.css";

type Filter = "all" | "progress" | "done";
const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "progress", label: "In progress" },
  { id: "done", label: "Completed" },
];

function Ring({ value }: { value: number }) {
  const r = 22, c = 2 * Math.PI * r;
  return (
    <svg className={styles.ring} viewBox="0 0 56 56" role="img" aria-label={`${value} percent read (demo)`}>
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(21,16,20,.15)" strokeWidth="6" />
      <motion.circle cx="28" cy="28" r={r} fill="none" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} rotate={-90} style={{ transformOrigin: "28px 28px" }}
        initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: c * (1 - value / 100) }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
      <text x="28" y="33" textAnchor="middle" fontSize="14" fontWeight="800" fill="currentColor">{value}</text>
    </svg>
  );
}

export function LibraryView({ items }: { items: LibraryItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [note, setNote] = useState(false);
  const owned = items.map((i) => ({ ...i, comic: getComic(i.slug)! }));
  const current = owned.find((o) => o.progress > 0 && o.progress < 100) ?? owned[0];
  const shown = owned.filter((o) => filter === "all" || (filter === "done" ? o.progress === 100 : o.progress < 100));
  const ownedSlugs = new Set(items.map((i) => i.slug));
  const discover = comics.filter((c) => !ownedSlugs.has(c.slug));
  const completed = owned.filter((o) => o.progress === 100).length;

  return (
    <>
      <section className={styles.hero}>
                <div className={`wrap ${styles.heroGrid}`}>
          <Reveal>
            <p><span className="demo">Preview data</span></p>
            <h1 className={styles.h1}>Welcome back to your library</h1>
            <p className="lead">Pick up where you left off, revisit a favourite or find your next story</p>
            <Link href="/login" className="btn"><LogIn size={18} aria-hidden="true" /> Log in (preview)</Link>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className={styles.stats}>
              <div><dt>Owned</dt><dd>{owned.length}</dd></div>
              <div><dt>In progress</dt><dd>{owned.length - completed}</dd></div>
              <div><dt>Completed</dt><dd>{completed}</dd></div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="cont-h">
        <Reveal><h2 id="cont-h">Continue Reading</h2></Reveal>
        <Reveal delay={0.1}>
          <div className={styles.continue}>
            <ComicCover comic={current.comic} className={styles.contCover} />
            <div className={styles.contBody}>
                            <h3>{current.comic.title}</h3>
              <div className={styles.bar} role="progressbar" aria-valuenow={current.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Demonstration progress">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${current.progress}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
              </div>
              <p className={styles.small}>{current.progress}% read (demo)</p>
              <button type="button" className="btn btn-primary btn-lg" onClick={() => setNote(true)}><BookOpen size={20} aria-hidden="true" /> Continue Reading</button>
              <p className={styles.small} aria-live="polite">{note ? "Preview only, the protected reader arrives in the production build" : "The reader opens right here in the website"}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section wrap" style={{ paddingTop: 0 }} aria-labelledby="own-h">
        <div className={styles.head}>
          <Reveal><h2 id="own-h">Owned Comics</h2></Reveal>
          <div className={styles.filters} role="group" aria-label="Filter owned comics">
            {filters.map((f) => (
              <button key={f.id} type="button" aria-pressed={filter === f.id} className={styles.filter} onClick={() => setFilter(f.id)}>
                {filter === f.id && <motion.span layoutId="flt" className={styles.filterBg} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className={styles.filterText}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
        <motion.ul layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {shown.map((o) => (
              <motion.li key={o.slug} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.3 }}>
                <motion.article className={styles.owned} whileHover={{ y: -6 }} style={{ "--accent": o.comic.mood.accent } as React.CSSProperties}>
                  <ComicCover comic={o.comic} className={styles.ownedCover} />
                  <div className={styles.ownedBody}>
                    <div>
                      <h3>{o.comic.title}</h3>
                      <p className={styles.small}>{o.progress === 100 ? <><CheckCircle2 size={16} aria-hidden="true" /> Completed</> : "In progress"}</p>
                    </div>
                    <Ring value={o.progress} />
                  </div>
                  <Link href={o.slug === "negotiation" ? "/comics/negotiation" : "/comics"} className="btn">{o.progress === 100 ? "Read again" : "View comic"}</Link>
                </motion.article>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        {shown.length === 0 && <p>Nothing here yet</p>}
      </section>

      <section className={styles.discover} aria-labelledby="disc-h">
        <div className="wrap">
          <Reveal>
            <h2 id="disc-h">Related titles you might enjoy</h2>
          </Reveal>
          <ComicCarousel comics={discover} label="related comics" />
          <Link href="/comics" className="btn">Return to the store <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
