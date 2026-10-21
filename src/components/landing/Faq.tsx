"use client";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { copy } from "@/content/preview-copy";
import { Reveal } from "@/components/shared/Motion";
import { SectionHead } from "@/components/shared/SectionHead";
import styles from "./Landing.module.css";

// One question open at a time, the answer eases open so the list never jumps
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="band band-paper" id="faq" aria-labelledby="faq-h">
      <div className={`wrap ${styles.faqGrid}`}>
        <div className={styles.faqSide}>
          <SectionHead id="faq-h" title="Frequently asked questions" lead="Quick answers about reading, buying and who Humanisse is for" />
          <div className={styles.faqImg}>
            <Image src="/characters/posters/bot.jpg" alt="The Bot, smiling" width={420} height={572} />
          </div>
        </div>
        <ul className={styles.faqList}>
          {copy.faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <Reveal delay={i * 0.04}>
                  <div className={styles.faqItem} data-open={isOpen}>
                    <button type="button" className={styles.faqQ} aria-expanded={isOpen} aria-controls={`faq-a-${i}`} id={`faq-q-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                      <span>{f.q}</span>
                      <Plus aria-hidden="true" />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: "hidden" }}>
                          <p className={styles.faqA}>{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
