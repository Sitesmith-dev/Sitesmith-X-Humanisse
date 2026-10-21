"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { RotateCw } from "lucide-react";
import styles from "./Home.module.css";

const cast = [
  { id: "professor", name: "Professor", role: "Introduces the idea", bio: "A warm teacher who opens every story, setting the scene before stepping aside and letting the characters answer the question themselves.", quote: "Every story has a reason", alt: "The Professor, an illustrated portrait of a bearded man with glasses, a black blazer and a mug that reads Curiosity, Empathy, Impact", accent: "gold" },
  { id: "bot", name: "Bot", role: "Connects the dots", bio: "Part companion, part compass, turning a tangled moment into a sequence you can follow, one clear step at a time.", quote: "Let's connect the dots", alt: "The Bot, an illustrated robot dog with a white moustache and beard and a small jetpack", accent: "plum" },
  { id: "cat", name: "Cat", role: "Chief Story Critic", bio: "Unimpressed until a story earns it, with a badge to prove the judgement is official.", quote: "Honestly, the audacity", alt: "The Cat, an illustrated red cat resting her chin on her paw, wearing a Professional Judge tag", accent: "ink" },
] as const;

// A trading card for each guide: the circular portrait up front, and it turns over to the file card on the back.
// A phone shows one card at a time with the three faces beneath to choose from, so nothing scrolls sideways.
// Larger screens show all three. The lift-and-settle makes the turn read as a card being picked up
function Card({ c, active }: { c: (typeof cast)[number]; active: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={styles.cardItem} data-active={active}>
      <button type="button" className={styles.card} onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={`${c.name}, ${open ? "show the portrait" : "read about them"}`}>
        <motion.span
          className={styles.cardInner}
          animate={{ rotateY: open ? 180 : 0, scale: [1, 1.04, 1], y: [0, -8, 0] }}
          transition={{
            rotateY: { duration: 0.7, ease: [0.645, 0.045, 0.355, 1] },
            scale: { duration: 0.7, times: [0, 0.5, 1], ease: ["easeOut", "easeIn"] },
            y: { duration: 0.7, times: [0, 0.5, 1], ease: ["easeOut", "easeIn"] },
          }}
        >
          <span className={styles.face}>
            <span className={styles.portrait}>
              <Image src={`/characters/portraits/${c.id}.webp`} alt={c.alt} width={360} height={360} sizes="(max-width: 900px) 220px, 260px" />
            </span>
            <strong className={styles.faceName}>{c.name}</strong>
            <span className={styles.faceRole}>{c.role}</span>
            <span className={styles.flipHint}><RotateCw size={14} aria-hidden="true" /> Tap to read more</span>
          </span>
          <span className={`${styles.face} ${styles.back} ${styles[`back_${c.accent}`]}`}>
            <span className={styles.backRole}>{c.role}</span>
            <strong className={styles.backName}>{c.name}</strong>
            <span className={styles.backBio}>{c.bio}</span>
            <span className={styles.backQuote}>&ldquo;{c.quote}&rdquo;</span>
          </span>
        </motion.span>
      </button>
    </li>
  );
}

export function Cast() {
  const [active, setActive] = useState(0);
  return (
    <section id="characters" className={`band band-coral ${styles.sec}`} aria-labelledby="cast-h">
      <div className="wrap">
        <div className={styles.head}>
          <h2 id="cast-h" className="capBox capBox-paper">Meet the three who teach every comic</h2>
          <p className={styles.headLead}>Tap a card to turn it over</p>
        </div>
        <ul className={styles.cast}>{cast.map((c, i) => <Card key={c.id} c={c} active={i === active} />)}</ul>
        <div className={styles.picker} role="group" aria-label="Choose a guide">
          {cast.map((c, i) => (
            <button key={c.id} type="button" className={styles.pick} aria-pressed={i === active} onClick={() => setActive(i)}>
              <span className={styles.avatar}><Image src={`/characters/portraits/${c.id}.webp`} alt="" width={120} height={120} sizes="60px" /></span>
              <span className={styles.pickName}>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
