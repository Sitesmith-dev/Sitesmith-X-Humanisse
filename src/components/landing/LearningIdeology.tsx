"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/shared/Motion";
import styles from "./Landing.module.css";

const journey = ["Story", "Reflect", "Apply"];

const principles = [
  { title: "Simple", text: "Complex ideas, told as a scene you can picture in one read" },
  { title: "Memorable", text: "A story stays with you long after a slide deck is forgotten" },
  { title: "Human", text: "Built on emotions and choices, not frameworks and jargon" },
  { title: "Useful", text: "Every page leaves you with something to try the same day" },
] as const;

export function LearningIdeology() {
  const [active, setActive] = useState(0);
  return (
    <section id="learning-ideology" className="band band-paper" aria-labelledby="ideology-h">
      <div className="wrap">
        <Reveal className={styles.ideologyCenter}>
          <h2 id="ideology-h" className="capBox">One idea, told the way it sticks</h2>
          <p className="lead">The same shelf, every time: story first, reflection second, a habit by the end</p>
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
        </Reveal>
      </div>
    </section>
  );
}
