"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import styles from "./IntroStage.module.css";

// The cinematic frame an introduction video plays in, shared by the landing page and every comic page. With no
// video it holds its place and says so. Pass `src` and the play button starts it in the same frame
export function IntroStage({ title, subtitle, src, count }: { title: string; subtitle: string; src?: string; count?: string }) {
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const play = () => { setPlaying(true); requestAnimationFrame(() => video.current?.play()); };
  return (
    <div className={styles.stage}>
      {playing && src ? (
        <video ref={video} className={styles.video} src={src} controls playsInline preload="metadata" aria-label={`${title} introduction`} />
      ) : (
        <>
          <Image src="/characters/professor-masterclass.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 700px" className={styles.poster} />
          <span className={styles.shade} aria-hidden="true" />
          {count && <span className={styles.count}>{count}</span>}
          {src ? (
            <button type="button" className={styles.playBtn} onClick={play} aria-label={`Play the ${title} introduction`}><Play size={30} aria-hidden="true" /></button>
          ) : (
            <>
              <span className={styles.soon}>Coming soon</span>
              <span className={styles.playBtn} data-idle="true" aria-hidden="true"><Play size={30} /></span>
            </>
          )}
          <span className={styles.title}><strong>{title}</strong><small>{subtitle}</small></span>
        </>
      )}
    </div>
  );
}
