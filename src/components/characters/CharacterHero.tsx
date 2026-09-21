"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { hasWebGL } from "@/lib/webgl";
import { CharacterFallback } from "./CharacterFallback";
import type { CharId } from "./CharacterScene";
import styles from "./Characters.module.css";

const CharacterScene = dynamic(() => import("./CharacterScene"), { ssr: false });

const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

// Whether 3D is unavailable is decided once, so the still poster only ever appears for visitors who cannot see the scene
let no3d: boolean | null = null;
const cannot3d = () => {
  if (no3d === null) {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    no3d = !hasWebGL() || !!saveData;
  }
  return no3d;
};
const noop = () => () => {};

const info: Record<CharId, { name: string; line: string }> = {
  professor: { name: "The Professor", line: "Introduces the idea and connects the story to meaning" },
  bot: { name: "The Bot", line: "Makes the learning steps clear and connected" },
  cat: { name: "The Cat, Chief Story Critic", line: "Asks whether the story truly works" },
};

export function CharacterHero() {
  const box = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [tabOn, setTabOn] = useState(true);
  const [active, setActive] = useState<CharId | null>(null);
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
  const unsupported = useSyncExternalStore(noop, cannot3d, () => false);
  const showPoster = unsupported || reduced;

  useEffect(() => {
    // The scene loads just after the page's critical content
    const t = setTimeout(() => setReady(true), 400);
    const onVis = () => setTabOn(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    // Cursor is tracked across the whole window and mapped to the stage, so the characters keep following it outside the canvas too
    const onMove = (e: PointerEvent) => {
      const r = box.current?.getBoundingClientRect();
      if (!r) return;
      pointer.current.x = Math.max(-1.4, Math.min(1.4, ((e.clientX - r.left) / r.width) * 2 - 1));
      pointer.current.y = Math.max(-1, Math.min(1, -(((e.clientY - r.top) / r.height) * 2 - 1)));
    };
    const onLeave = (e: MouseEvent) => { if (!e.relatedTarget) { pointer.current.x = 0; pointer.current.y = 0; } };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onLeave);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (box.current) io.observe(box.current);
    return () => { clearTimeout(t); document.removeEventListener("visibilitychange", onVis); window.removeEventListener("pointermove", onMove); document.removeEventListener("mouseout", onLeave); io.disconnect(); };
  }, []);

  return (
    <div className={styles.wrap}>
      <div ref={box} className={styles.stage} role="img" aria-label="The Humanisse characters: the Professor, the Bot and the Cat, Chief Story Critic">
        {showPoster && <CharacterFallback />}
        {ready && !showPoster && (
          <div className={styles.canvas}>
            <CharacterScene active={active} reduced={reduced} running={visible && tabOn} pointer={pointer} />
          </div>
        )}
      </div>
      <div className={styles.controls} role="group" aria-label="Meet the characters">
        {(Object.keys(info) as CharId[]).map((id) => (
          <button key={id} type="button" className="btn" aria-pressed={active === id}
            onClick={() => setActive(active === id ? null : id)} onMouseEnter={() => setActive(id)} onFocus={() => setActive(id)}>
            {id === "cat" ? "Cat" : id === "bot" ? "Bot" : "Professor"}
          </button>
        ))}
      </div>
      <p className={styles.label} aria-live="polite">
        {active ? <><strong>{info[active].name}:</strong> {info[active].line}</> : "Select a character to meet them"}
      </p>
    </div>
  );
}
