"use client";
import { useState } from "react";
import { SiteLink as Link } from "@/components/shared/SiteLink";
import { ArrowRight } from "lucide-react";
import { ideology } from "@/content/ideology";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/shared/Motion";
import styles from "./Landing.module.css";

const journey = ideology.philosophy;
const principles = ideology.principles;

export function LearningIdeology() {
  const [active, setActive] = useState(0);
  return (
    <section id="learning-ideology" className="band band-paper" aria-labelledby="ideology-h">
      <div className="wrap">
        <Reveal className={styles.ideologyCenter}>
          <h2 id="ideology-h" className="capBox">{ideology.philosophyTitle}</h2>
          <p className="lead">{ideology.belief}</p>
          <ol className={styles.journey}>
            {journey.map((step, i) => (
              <li key={step}>
                <span className={styles.journeyStep}>{step}</span>
                {i < journey.length - 1 && <ArrowRight size={18} aria-hidden="true" className={styles.journeyArrow} />}
              </li>
            ))}
          </ol>
          <div className={styles.principleShelf}>
            <div className={styles.principleTabs} role="tablist" aria-label="What every Humanisse comic is built on">
              {principles.map((p, i) => (
                <button key={p.title} type="button" role="tab" aria-selected={active === i} className={styles.principleTab} onClick={() => setActive(i)}>
                  {p.title}
                </button>
              ))}
            </div>
            <div className={styles.principlePanel}>
              {/* Every text stacked invisibly in the same cell, so the panel is always as tall as the longest and never jumps */}
              <div className={styles.principleSizer} aria-hidden="true">
                {principles.map((p) => <p key={p.title}>{p.text}</p>)}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={principles[active].title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  {principles[active].text}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <Link href="/learning-ideology" className="btn" style={{ marginTop: 32 }}>Read the full learning ideology <ArrowRight size={18} aria-hidden="true" /></Link>
        </Reveal>
      </div>
    </section>
  );
}
