"use client";
import { useEffect, useState, type RefObject } from "react";
import type { Stamp } from "./stamp";

// What this is, honestly: a tripwire for casual tampering. Someone who deletes or hides the stamp in their
// browser's developer tools, or nudges its opacity down, gets a paused reader instead of a clean page to screenshot.
// It does not make removal impossible. A determined person can switch this check off, or edit the page before it
// runs, and nothing in a browser can stop a screenshot. The stronger fix is stamping the artwork on the server.
// It deliberately does nothing to fight the browser itself: no devtools detection, no debugger traps.

const INTERVAL_MS = 1500;
/** A failure has to still be there this long after it was first seen, which rides out page turns, layout changes
 * and the sidebar opening, all of which briefly fade or rebuild the pages */
const CONFIRM_MS = 700;
/** A stamp element counts as hidden below this share of the opacity its own CSS gives it (1 for every stamp element) */
const MIN_OPACITY = 0.5;
/** The marks and the foot strip are drawn at a low opacity on purpose (STAMP_OPACITY), so they are compared with
 * that: still accepted at half of it, caught once someone fades them further */
const MIN_STAMP_SHARE = 0.5;
/** Every page carries exactly this many marks */
const MARK_COUNT = 5;

// On screen at a real size and not faded out, counting the opacity of everything between it and the reader, since
// fading a parent hides it just as well
function seen(el: Element | null, root: HTMLElement) {
  if (!el) return false;
  const box = el.getBoundingClientRect();
  if (box.width < 1 || box.height < 1) return false;
  const style = getComputedStyle(el);
  if (style.display === "none" || style.visibility !== "visible") return false;
  let opacity = 1;
  for (let node: Element | null = el; node && node !== root.parentElement; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
  return opacity >= MIN_OPACITY;
}

// The alpha of a computed colour such as rgba(255, 255, 255, 0.16), so text painted transparent counts as hidden
const alpha = (colour: string) => {
  const parts = colour.match(/[\d.]+/g);
  return parts && parts.length === 4 ? Number(parts[3]) : colour === "transparent" ? 0 : 1;
};

// One mark: both lines present, word for word, on screen at a real size and not faded or emptied of colour
function markIntact(mark: Element, root: HTMLElement, stamp: Stamp, minAlpha: number) {
  if (!seen(mark, root)) return false;
  const lines = mark.querySelectorAll("[data-stamp-text]");
  if (lines.length !== 2) return false;
  return [...lines].every((t, i) => {
    const style = getComputedStyle(t);
    return t.textContent === stamp.lines[i] && seen(t, root) && style.fill !== "none" && alpha(style.fill) >= MIN_OPACITY && Number(style.fillOpacity) >= minAlpha;
  });
}

function intact(root: HTMLElement, stamp: Stamp, stampAlpha: number) {
  const minAlpha = stampAlpha * MIN_STAMP_SHARE;
  // Only the pages in the reading area. Thumbnails sit in a sidebar that comes and goes, and are too small to matter
  const leaves = root.querySelectorAll("[data-stage] [data-leaf]");
  if (!leaves.length) return false;
  for (const leaf of leaves) {
    const tiles = leaf.querySelector('[data-stamp="tiles"]');
    const line = leaf.querySelector<HTMLElement>('[data-stamp="line"]');
    if (!seen(tiles, root) || !seen(line, root)) return false;
    if (line!.textContent !== stamp.text || alpha(getComputedStyle(line!).color) < minAlpha) return false;
    if (!(tiles!.textContent ?? "").includes(stamp.text)) return false;
    const marks = tiles!.querySelectorAll("[data-stamp-mark]");
    if (marks.length !== MARK_COUNT || ![...marks].every((m) => markIntact(m, root, stamp, minAlpha))) return false;
  }
  const foot = root.querySelector<HTMLElement>('[data-stamp="foot"]');
  return seen(foot, root) && foot!.textContent === stamp.text && alpha(getComputedStyle(foot!).color) >= MIN_OPACITY;
}

/**
 * Watches the reader's stamp and reports when it has been removed, hidden or changed. `resume` clears the state so
 * the reader can rebuild a clean page tree.
 */
export function useStampGuard(root: RefObject<HTMLElement | null>, stamp: Stamp, stampAlpha: number) {
  const [tampered, setTampered] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (tampered || !el) return;
    let suspectSince: number | null = null;
    let confirmTimer: number | null = null;

    const check = () => {
      if (document.hidden) return;
      if (intact(el, stamp, stampAlpha)) { suspectSince = null; return; }
      const now = performance.now();
      if (suspectSince === null) {
        suspectSince = now;
        if (confirmTimer) window.clearTimeout(confirmTimer);
        confirmTimer = window.setTimeout(check, CONFIRM_MS);
      } else if (now - suspectSince >= CONFIRM_MS) {
        setTampered(true);
      }
    };

    let frame = 0;
    const soon = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(check); };
    const observer = new MutationObserver(soon);
    observer.observe(el, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["style", "class", "hidden", "fill-opacity", "opacity"] });
    const interval = window.setInterval(check, INTERVAL_MS);
    soon();
    return () => {
      observer.disconnect();
      window.clearInterval(interval);
      cancelAnimationFrame(frame);
      if (confirmTimer) window.clearTimeout(confirmTimer);
    };
  }, [root, stamp, stampAlpha, tampered]);

  return { tampered, resume: () => setTampered(false) };
}
