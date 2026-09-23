"use client";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Scan, X, ZoomIn, ZoomOut } from "lucide-react";
import type { Comic } from "@/types/comic";
import { PageWatermark } from "./PageWatermark";
import { ReaderPage, ReaderPagePlaceholder } from "./ReaderPagePlaceholder";
import { ViewMenu, type MenuItem } from "./ViewMenu";
import styles from "./Reader.module.css";

type LayoutMode = "single" | "spread" | "scroll";
type SidebarView = "thumbnails" | "contact";

const ZOOMS = [0.5, 0.65, 0.8, 1, 1.25, 1.5, 2, 2.5, 3];
const FIT = ZOOMS.indexOf(1);
const EASE = [0.16, 1, 0.3, 1] as const;
const TURN = 0.2;
const NOTICE_MS = 2500;
const CANNOT_PRINT = "Humanisse comics are read online and cannot be printed";
const CANNOT_SAVE = "Humanisse comics are read online and cannot be saved";
// Blur the pages when the tab loses focus. Off by default: it deters capture tooling
// but interrupts readers who switch away briefly. Flip to true if the client asks for it.
const BLUR_ON_BLUR: boolean = false;

// Fullscreen is the browser's state, not the reader's, so it is read straight from the document rather than mirrored into an effect
const subscribeFullscreen = (notify: () => void) => {
  document.addEventListener("fullscreenchange", notify);
  return () => document.removeEventListener("fullscreenchange", notify);
};
const neverChanges = () => () => {};

function useMedia(query: string) {
  const subscribe = useCallback((notify: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", notify);
    return () => mql.removeEventListener("change", notify);
  }, [query]);
  // The server has no viewport, so it renders the wide layout and the client corrects it on hydration
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

export function Reader({ comic }: { comic: Comic }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const pages = comic.pages;
  const total = pages.length;

  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const pageEls = useRef<(HTMLDivElement | null)[]>([]);
  const thumbEls = useRef<(HTMLButtonElement | null)[]>([]);
  const backTimer = useRef<number | null>(null);
  const noticeTimer = useRef<number | null>(null);
  const press = useRef<{ x: number; y: number } | null>(null);

  const compact = useMedia("(max-width: 1099.98px)");
  const narrow = useMedia("(max-width: 819.98px)");

  const [layout, setLayout] = useState<LayoutMode>("spread");
  const [sidebarView, setSidebarView] = useState<SidebarView>("thumbnails");
  // Null until the reader is told otherwise, and then it follows the viewport: open above 1100px, closed below it
  const [sidebarOpen, setSidebarOpen] = useState<boolean | null>(null);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [zoom, setZoom] = useState(FIT);
  const [away, setAway] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const isFull = useSyncExternalStore(subscribeFullscreen, () => !!document.fullscreenElement, () => false);
  const canFull = useSyncExternalStore(neverChanges, () => document.fullscreenEnabled, () => false);

  // Two pages on a phone is unreadable, so the layout drops to one page under 820px whatever the menu says
  const mode: LayoutMode = narrow && layout === "spread" ? "single" : layout;
  const sidebar = (sidebarOpen ?? !compact) ? sidebarView : "hidden";

  // A book opens on its cover: page one sits alone, then pages pair up, and a trailing odd page ends up alone as well
  const spreads = useMemo(() => {
    const out: number[][] = [];
    if (total) out.push([0]);
    for (let i = 1; i < total; i += 2) out.push(i + 1 < total ? [i, i + 1] : [i]);
    return out;
  }, [total]);

  // What one press of next or previous moves by: a spread in two-page mode, a single page otherwise
  const units = useMemo(
    () => (mode === "spread" ? spreads : pages.map((_, i) => [i])),
    [mode, spreads, pages],
  );
  const unitIndex = Math.max(0, units.findIndex((u) => u.includes(page)));
  const unit = units[unitIndex] ?? [0];
  const atFirst = unitIndex <= 0;
  const atLast = unitIndex >= units.length - 1;
  const counter = unit.length > 1
    ? `Pages ${unit[0] + 1}–${unit[unit.length - 1] + 1} of ${total}`
    : `Page ${unit[0] + 1} of ${total}`;

  const jumpTo = useCallback((target: number) => {
    setDir(target >= page ? 1 : -1);
    if (mode === "scroll") { pageEls.current[target]?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); return; }
    setPage(target);
  }, [mode, page, reduce]);

  const step = useCallback((delta: number) => {
    const next = unitIndex + delta;
    if (next < 0 || next >= units.length) return;
    const target = units[next][0];
    setDir(delta);
    if (mode === "scroll") { pageEls.current[target]?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); return; }
    setPage(target);
  }, [mode, reduce, unitIndex, units]);

  const edge = useCallback((end: "first" | "last") => {
    const target = end === "first" ? 0 : units[units.length - 1][0];
    setDir(end === "first" ? -1 : 1);
    if (mode === "scroll") { pageEls.current[target]?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); return; }
    setPage(target);
  }, [mode, reduce, units]);

  // A swallowed shortcut that says nothing reads as a broken page, so each one explains itself briefly
  const showNotice = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), NOTICE_MS);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void root.current?.requestFullscreen().catch(() => {});
  }, []);

  // Back to wherever the reader was opened from. A reader URL opened cold has nothing to go back to, so it lands on the comic instead
  const close = useCallback(() => {
    const fallback = `/comics/${comic.slug}`;
    if (window.history.length <= 1) { router.replace(fallback); return; }
    // If the history entry belongs to another site or does not exist, nothing unmounts us and this takes over
    backTimer.current = window.setTimeout(() => router.replace(fallback), 400);
    router.back();
  }, [comic.slug, router]);

  useEffect(() => () => {
    if (backTimer.current) window.clearTimeout(backTimer.current);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
  }, []);

  // The reader owns the whole viewport while it is open
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    root.current?.focus({ preventScroll: true });
    return () => { document.body.style.overflow = overflow; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // The view menu handles its own arrows and Escape, and marks them handled
      if (e.defaultPrevented) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      // Print and Save Page As are the two one-keystroke rips. Saving matters here because these pages are markup,
      // not images: "Webpage, Complete" walks off with a working copy. This catches the keyboard only. The same two
      // entries in the browser's File menu fire no key event and cannot be intercepted, which is what the print
      // stylesheet backstops, and there is no equivalent backstop for saving
      if (e.metaKey || e.ctrlKey) {
        const key = e.key.toLowerCase();
        if (key === "p" || key === "s") { e.preventDefault(); showNotice(key === "p" ? CANNOT_PRINT : CANNOT_SAVE); return; }
      }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      else if (e.key === "Home") { e.preventDefault(); edge("first"); }
      else if (e.key === "End") { e.preventDefault(); edge("last"); }
      else if ((e.key === "f" || e.key === "F") && !e.metaKey && !e.ctrlKey) { e.preventDefault(); toggleFullscreen(); }
      // In fullscreen the browser exits on Escape by itself, and the reader must not close underneath it
      else if (e.key === "Escape") { if (!document.fullscreenElement) { e.preventDefault(); close(); } }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, edge, showNotice, step, toggleFullscreen]);

  useEffect(() => {
    if (!BLUR_ON_BLUR) return;
    const check = () => setAway(document.hidden || !document.hasFocus());
    document.addEventListener("visibilitychange", check);
    window.addEventListener("blur", check);
    window.addEventListener("focus", check);
    return () => {
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("blur", check);
      window.removeEventListener("focus", check);
    };
  }, []);

  // Continuous scroll: the counter follows whichever page covers most of the reading area
  useEffect(() => {
    if (mode !== "scroll" || !scroller.current) return;
    const seen = new Map<number, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => seen.set(Number((entry.target as HTMLElement).dataset.page), entry.intersectionRatio));
        let best = -1;
        let bestRatio = 0;
        seen.forEach((ratio, index) => { if (ratio > bestRatio) { bestRatio = ratio; best = index; } });
        if (best >= 0) setPage(best);
      },
      { root: scroller.current, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    pageEls.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [mode, total]);

  // Keep the current page visible in the strip as the spread moves
  useEffect(() => {
    if (sidebar === "hidden") return;
    thumbEls.current[page]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [page, sidebar, reduce]);

  const onPointerDown = (e: React.PointerEvent) => { press.current = { x: e.clientX, y: e.clientY }; };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = press.current;
    press.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) { step(dx < 0 ? 1 : -1); return; }
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) return;
    // A tap: the outer thirds turn the page, the middle third is left free for tap to zoom later
    const rect = e.currentTarget.getBoundingClientRect();
    const across = (e.clientX - rect.left) / rect.width;
    if (across < 1 / 3) step(-1);
    else if (across > 2 / 3) step(1);
  };

  const menu: MenuItem[][] = [
    [
      { id: "hide", kind: "action", label: "Hide sidebar", onSelect: () => setSidebarOpen(false) },
      { id: "thumbs", kind: "check", label: "Thumbnails", checked: sidebar === "thumbnails", onSelect: () => { setSidebarView("thumbnails"); setSidebarOpen(true); } },
      { id: "contact", kind: "check", label: "Contact sheet", checked: sidebar === "contact", onSelect: () => { setSidebarView("contact"); setSidebarOpen(true); } },
    ],
    [
      { id: "single", kind: "radio", label: "Single page", checked: mode === "single", onSelect: () => setLayout("single") },
      {
        id: "spread", kind: "radio", label: "Two pages", checked: mode === "spread", disabled: narrow,
        note: narrow ? "Needs a window at least 820px wide, two pages are unreadable on a narrow screen" : undefined,
        onSelect: () => setLayout("spread"),
      },
      { id: "scroll", kind: "radio", label: "Continuous scroll", checked: mode === "scroll", onSelect: () => setLayout("scroll") },
    ],
  ];

  const scale = ZOOMS[zoom];
  const sizes = mode === "spread" ? "(max-width: 1100px) 45vw, 38vw" : "(max-width: 820px) 90vw, 60vw";
  const surface = { "--accent": comic.mood.accent, "--accent2": comic.mood.secondaryAccent, "--zoom": scale } as React.CSSProperties;

  return (
    <div
      ref={root}
      className={styles.reader}
      style={surface}
      tabIndex={-1}
      aria-label={`${comic.title}, comic reader`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className={styles.toolbar}>
        <div className={styles.toolGroup}>
          <ViewMenu groups={menu} />
        </div>

        <div className={styles.centre}>
          <div className={styles.position}>
            <p className={styles.comicTitle}>{comic.title}</p>
            <p className={styles.counter} aria-live="polite">{counter}</p>
          </div>
          <div className={styles.zoom} role="group" aria-label="Zoom">
            <button type="button" className={`btn ${styles.toolBtn}`} onClick={() => setZoom((z) => Math.max(0, z - 1))} disabled={zoom === 0} aria-label="Zoom out">
              <ZoomOut size={20} aria-hidden="true" />
            </button>
            <button type="button" className={`btn ${styles.toolBtn}`} onClick={() => setZoom(FIT)} aria-label="Zoom to fit">
              <Scan size={20} aria-hidden="true" /><span className={styles.toolLabel}>Fit</span>
            </button>
            <button type="button" className={`btn ${styles.toolBtn}`} onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))} disabled={zoom === ZOOMS.length - 1} aria-label="Zoom in">
              <ZoomIn size={20} aria-hidden="true" />
            </button>
            <p className={styles.zoomLevel} aria-live="polite">{Math.round(scale * 100)}%</p>
          </div>
        </div>

        <div className={styles.toolGroup}>
          {canFull && (
            <button type="button" className={`btn ${styles.toolBtn}`} onClick={toggleFullscreen} aria-pressed={isFull}>
              {isFull ? <Minimize size={20} aria-hidden="true" /> : <Maximize size={20} aria-hidden="true" />}
              <span className={styles.toolLabel}>{isFull ? "Exit full screen" : "Full screen"}</span>
            </button>
          )}
          <button type="button" className={`btn btn-primary ${styles.close}`} onClick={close}>
            <X size={22} aria-hidden="true" /> Close
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {sidebar !== "hidden" && (
          <aside className={styles.sidebar} data-view={sidebar} aria-label={sidebar === "thumbnails" ? "Page thumbnails" : "Contact sheet"}>
            <p className={styles.sidebarHead}>{sidebar === "thumbnails" ? "Pages" : "All pages"}</p>
            <ul className={styles.thumbs} data-view={sidebar}>
              {pages.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    ref={(el) => { thumbEls.current[i] = el; }}
                    className={styles.thumb}
                    aria-current={unit.includes(i) ? "true" : undefined}
                    aria-label={`Page ${i + 1}`}
                    onClick={() => jumpTo(i)}
                  >
                    <span className={styles.thumbArt}>
                      <ReaderPagePlaceholder index={i} number={i + 1} />
                      <PageWatermark />
                    </span>
                    <span className={styles.thumbNumber}>{i + 1}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className={styles.stageWrap}>
          <button type="button" className={`${styles.edge} ${styles.edgePrev}`} onClick={() => step(-1)} disabled={atFirst} aria-label="Previous page">
            <ChevronLeft size={30} aria-hidden="true" />
          </button>

          {mode === "scroll" ? (
            <div ref={scroller} className={styles.scrollStage} data-away={away || undefined}>
              {pages.map((p, i) => (
                <div
                  key={p.id}
                  ref={(el) => { pageEls.current[i] = el; }}
                  data-page={i}
                  className={styles.scrollPage}
                >
                  <div className={styles.leaf} data-side="solo">
                    <ReaderPage src={p.src} index={i} number={i + 1} title={comic.title} sizes={sizes} />
                    <PageWatermark />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.stage} data-away={away || undefined}>
              <motion.div
                key={unitIndex}
                className={styles.spread}
                style={{ "--ar": mode === "spread" ? 1.5 : 0.75 } as React.CSSProperties}
                data-zoomed={scale > 1 || undefined}
                initial={reduce ? false : { opacity: 0, x: dir * 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduce ? 0 : TURN, ease: EASE }}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
              >
                {/* The blank half of an opening or closing spread, so a lone page keeps its side of the book */}
                {mode === "spread" && unit.length === 1 && unit[0] === 0 && <div className={styles.blank} aria-hidden="true" />}
                {unit.map((i) => (
                  <div
                    key={pages[i].id}
                    className={styles.leaf}
                    data-side={mode === "single" ? "solo" : unit.length === 1 ? (unit[0] === 0 ? "right" : "left") : i === unit[0] ? "left" : "right"}
                  >
                    <ReaderPage src={pages[i].src} index={i} number={i + 1} title={comic.title} sizes={sizes} />
                    <PageWatermark />
                  </div>
                ))}
                {mode === "spread" && unit.length === 1 && unit[0] !== 0 && <div className={styles.blank} aria-hidden="true" />}
              </motion.div>
            </div>
          )}

          <button type="button" className={`${styles.edge} ${styles.edgeNext}`} onClick={() => step(1)} disabled={atLast} aria-label="Next page">
            <ChevronRight size={30} aria-hidden="true" />
          </button>

          {away && (
            <div className={styles.awayNote}>
              <span>Paused while you are away, come back to this tab to keep reading</span>
            </div>
          )}

          <AnimatePresence>
            {notice && (
              <motion.div
                className={styles.shortcutNote}
                role="status"
                aria-live="polite"
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
                transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
              >
                <span>{notice}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className={styles.printNotice}>{CANNOT_PRINT}</p>
    </div>
  );
}
