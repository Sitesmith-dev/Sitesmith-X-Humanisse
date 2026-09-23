import type { Metadata } from "next";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import { concepts } from "@/concepts/registry";
import styles from "./concepts.module.css";

export const metadata: Metadata = { title: "Select a design", robots: { index: false, follow: false } };

// A neutral font pairing, used only on this picker so neither direction's own faces leak in
const heading = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-picker-heading" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-picker-body" });

// A neutral, unbranded gallery so neither concept borrows the other's chrome, this page belongs to no direction
export default function ConceptSelectPage() {
  return (
    <main className={`${styles.page} ${heading.variable} ${body.variable}`}>
      <div className={styles.wrap}>
        <p className={styles.eyebrow}>Humanisse preview, internal review</p>
        <h1>Select your design</h1>
        <p className={styles.lead}>
          Two directions built from the same brand, comics and characters. Open either one to explore the landing
          page, a catalogue sample, the Negotiation comic and a first look at My Library.
        </p>
        <ul className={styles.grid}>
          {concepts.map((c) => (
            <li key={c.slug}>
              <Link href={`/concepts/${c.slug}`} className={styles.card} style={{ "--card-bg": c.card.bg, "--card-fg": c.card.fg, "--card-accent": c.accent } as React.CSSProperties}>
                <span className={styles.direction}>{c.direction}</span>
                <h2>{c.name}</h2>
                <p>{c.tagline}</p>
                <ul className={styles.vibe} aria-label="Style keywords">
                  {c.vibe.map((v) => <li key={v}>{v}</li>)}
                </ul>
                <div className={styles.swatchStrip} aria-hidden="true">
                  {c.swatches.map((s) => <span key={s.label} style={{ background: s.value }} title={s.label} />)}
                </div>
                <span className={styles.open}>Open this direction <ArrowUpRight size={18} aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          Design preview, every screen uses the same sample comics, prices and characters, nothing here is a real
          purchase or account.
        </p>
      </div>
    </main>
  );
}
