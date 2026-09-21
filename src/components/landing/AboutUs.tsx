"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { legalCopy, type LegalDocKey } from "@/content/legal-copy";
import { DocDialog } from "@/components/shared/DocDialog";
import { Reveal } from "@/components/shared/Motion";
import { WordReveal } from "@/components/shared/Scroll";
import styles from "./Landing.module.css";

// Each stat card is a link to the thing it counts: the catalogue, the video section or the character trio
const stats = [
  { n: "10", label: "launch comics", hint: "Browse every comic", href: "/comics" },
  { n: "10", label: "video introductions", hint: "See a sample introduction", href: "/#video-intro" },
  { n: "3", label: "recurring characters", hint: "Meet the cast", href: "/#characters" },
] as const;

export function AboutUs() {
  const [doc, setDoc] = useState<LegalDocKey | null>(null);
  return (
    <section id="about" className="band band-paper" aria-labelledby="about-h">
      <div className={`wrap ${styles.about}`}>
        <h2 id="about-h" className={styles.kicker}>About us</h2>
        <WordReveal className={styles.big} text="Ideas are easier to keep when they happen to someone, so we put every idea inside a story" />
        <div className={styles.aboutGrid}>
          <Reveal className={styles.aboutCopy}>
            <p>Humanisse is a learning company. We teach life and professional skills through original comics, cinema and literature, because a lesson that arrives inside a story is one you remember long after the page is closed</p>
            <p>Every story is built around three recurring characters. The Professor introduces the idea, the Bot connects the dots and the Cat, our Chief Story Critic, asks whether it truly works. Together they turn negotiation, ethics, resilience and more into scenes you can picture and reuse</p>
            <p>The comics are written for readers from about ten years old through to teams in training rooms, so the same story can open a classroom discussion, a leadership workshop or a quiet evening read</p>
            <p className="notice"><span className="demo">Placeholder</span> This copy is sample text, final wording comes from Humanisse</p>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className={styles.stats}>
              {stats.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className={styles.statCard}>
                    <span className={styles.statNum}>{s.n}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                    <span className={styles.statHint}>{s.hint} <ArrowUpRight size={18} aria-hidden="true" /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <nav className={styles.legalRow} aria-label="Terms, legal and help">
          <button type="button" onClick={() => setDoc("terms")} aria-haspopup="dialog">T&amp;C</button>
          <button type="button" onClick={() => setDoc("legal")} aria-haspopup="dialog">Legal</button>
          <Link href="/#faq">FAQ</Link>
        </nav>
      </div>
      <DocDialog open={doc === "terms"} doc={legalCopy.terms} onClose={() => setDoc(null)} />
      <DocDialog open={doc === "legal"} doc={legalCopy.legal} onClose={() => setDoc(null)} />
    </section>
  );
}
