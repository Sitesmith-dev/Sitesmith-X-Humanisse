"use client";
import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { Reveal } from "@/components/shared/Motion";
import { Parallax, ScrollFrame } from "@/components/shared/Scroll";
import styles from "./Landing.module.css";

// The backdrop is the Professor's frame, blurred and darkened to plain black so the video is the only thing that glows
export function VideoPreview() {
  const [note, setNote] = useState(false);
  return (
    <section id="video-intro" className={`band band-ink ${styles.video}`} aria-labelledby="watch-h">
      <div className={styles.videoBg} aria-hidden="true">
        <Image src="/characters/references/professor.png" alt="" fill sizes="100vw" className={styles.bgImg} />
      </div>
      <div className={`wrap ${styles.watch}`}>
        <Reveal>
          <div className={styles.glass}>
            <h2 id="watch-h">A short introduction before every comic</h2>
            <p className="lead" style={{ marginBottom: 0 }}>The Professor explains the idea and why it matters, so you know what to look for when you start reading</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ScrollFrame className={styles.frame}>
            <Parallax speed={0.18} className={styles.frameImg}>
              <Image src="/characters/references/professor.png" alt="The Professor introducing a comic" width={900} height={755} />
            </Parallax>
            <button type="button" className={`btn btn-primary btn-lg ${styles.play}`} onClick={() => setNote(true)} aria-label="Play sample introduction (preview)">
              <Play size={22} aria-hidden="true" /> Watch the Introduction
            </button>
          </ScrollFrame>
          <p aria-live="polite" className={styles.caption}>
            {note ? "Preview only, introduction videos arrive with the full build" : "Sample frame, every video will have captions or a transcript"}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
