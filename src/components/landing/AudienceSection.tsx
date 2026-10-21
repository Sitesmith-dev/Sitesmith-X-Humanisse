"use client";
import { SiteLink as Link } from "@/components/shared/SiteLink";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { audiences } from "@/content/audiences";
import { SectionHead } from "@/components/shared/SectionHead";
import styles from "./Landing.module.css";

// One proposition, three rooms it shows up in, switched with a tab rather than three repeated cards.
// The right rail turns the switch into something you can see change, not just read, a small preview
// of what that audience actually gets rather than another paragraph.
export function AudienceSection() {
  const [active, setActive] = useState(0);
  const a = audiences[active];
  return (
    <section id="audiences" className="band band-ink" aria-labelledby="audiences-h">
      <div className="wrap">
        <SectionHead id="audiences-h" title="Built for every room you learn in" lead="Tap a room, the same stories meet you differently in each one" paper />
        <div className={styles.audTabs} role="tablist" aria-label="Choose an audience">
          {audiences.map((item, i) => (
            <button key={item.slug} type="button" role="tab" aria-selected={active === i} className={styles.audTab} onClick={() => setActive(i)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className={styles.audGrid}>
          <AnimatePresence mode="wait">
            <motion.div
              key={a.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={styles.audPanel}
            >
              <span className={styles.audKicker}>{a.kicker}</span>
              <h3 className={styles.audProp}>{a.proposition}</h3>
              <Link href={`/${a.slug}`} className="btn btn-primary btn-lg">
                Explore {a.label.toLowerCase()} <ArrowRight size={20} aria-hidden="true" />
              </Link>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${a.slug}-card`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={styles.audCard}
            >
              <span className={styles.audCardLabel}>Where it shows up</span>
              <ol className={styles.audCardList}>
                {a.interventions.slice(0, 3).map((it, i) => (
                  <li key={it.title}>
                    <span className={styles.audCardNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span>{it.title}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
