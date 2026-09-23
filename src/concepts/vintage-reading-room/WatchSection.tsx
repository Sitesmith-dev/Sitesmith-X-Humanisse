"use client";
import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { Reveal } from "./Reveal";
import styles from "./vintage.module.css";

// A darkened backdrop of the same photograph sets the room, the frame in front of it carries the actual moment,
// the video, and stays the one thing in the section that is not quietly aged back into the wallpaper
export function WatchSection() {
  const [note, setNote] = useState(false);
  return (
    <section className={styles.watch} aria-labelledby="watch-h">
      <div className={styles.watchBg} aria-hidden="true">
        <Image src="/characters/references/professor.png" alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "55% 20%" }} />
        <span className={styles.duotone} />
      </div>
      <div className={styles.watchScrim} aria-hidden="true" />
      <div className="wrap">
        <Reveal className={styles.watchIntro}>
          <p className={styles.kickerLight}>Watch</p>
          <h2 id="watch-h" className={styles.h1small} style={{ color: "var(--parch)" }}>A short introduction before every comic</h2>
          <p className={styles.leadLight}>The Professor sets the scene before each story, so you know what to watch for once the pages turn</p>
        </Reveal>
        <Reveal delay={0.14} className={styles.watchFrameWrap}>
          <button type="button" className={styles.watchFrame} onClick={() => setNote(true)} aria-label="Play sample introduction (preview)">
            <Image src="/characters/references/professor.png" alt="The Professor introducing a comic" fill sizes="(max-width: 900px) 100vw, 720px" style={{ objectFit: "cover", objectPosition: "50% 15%" }} />
            <span className={styles.duotone} />
            <span className={styles.watchPlay}><Play size={26} aria-hidden="true" /></span>
          </button>
          <p className={styles.watchCaption} aria-live="polite">
            {note ? "Preview only, introduction videos arrive with the full build" : "Sample frame, every video will carry captions or a transcript"}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
