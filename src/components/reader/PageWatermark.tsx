"use client";
import type { Stamp } from "./stamp";
import styles from "./Reader.module.css";

// The reader's stamp: five quiet marks per page instead of a tiling, so a page reads like the plain comic but a
// screenshot still carries the reader's name and email. Each mark is white text blended with `difference` at low
// opacity, which nudges the artwork's tone (lighter on dark art, darker on light) rather than painting over it.
// Tuned against the client's real pages (October 2026). Every value the marks depend on lives here.

/** Low contrast, never small: size buys legibility with far less noise than opacity does */
export const STAMP_OPACITY = 0.22;
/** Each line's font size as a share of the page width */
const FONT = 0.026;
const LEADING = 1.25;
const ANGLE = -30;
/**
 * Where the marks sit, as shares of the page's width and height, each mark centred on its point: an X of four near
 * the corners and one in the middle, so any crop of about half a page holds a whole one, and every crop that keeps the
 * middle of the page holds the middle one. Pulled in to 28% and 72% so the marks nearest the spine on a two-page spread
 * stay clear of its shadow. The same everywhere, never per page
 */
export const MARKS = [
  { x: 0.28, y: 0.12 },
  { x: 0.72, y: 0.12 },
  { x: 0.5, y: 0.5 },
  { x: 0.28, y: 0.88 },
  { x: 0.72, y: 0.88 },
] as const;
/** The widest a line may be, as a share of the page width, so a corner mark turned to ANGLE stays on the page */
const MAX_LINE = 0.5;

/** User space one unit per thousandth of the page width, and as tall as the page, so marks scale with zoom and keep their shape */
const W = 1000;

/**
 * How wide a character of the stamp font is, as a share of the font size, by kind. Measured from the text face and
 * erring wide at this lighter weight. Anything beyond Latin (Devanagari, CJK and so on) counts as a full em
 */
const charWidth = (c: string) =>
  c.codePointAt(0)! > 0x2ff ? 1 : c === " " ? 0.22 : /[ijlItfr.,'!|:;-]/.test(c) ? 0.31 : /[mwMW@]/.test(c) ? 0.86 : /[A-Z]/.test(c) ? 0.6 : 0.53;
const ems = (text: string) => [...text].reduce((sum, c) => sum + charWidth(c), 0);

/**
 * The five marks over one page. `aspect` is the page's width divided by its height, so the marks sit where they should
 * on any page shape. `data-stamp="tiles"` and `data-stamp-mark` are what the tamper guard looks for.
 */
export function PageWatermark({ stamp, aspect }: { stamp: Stamp; aspect: number }) {
  const height = W / aspect;
  // A long name or email shrinks the whole mark, both lines together, rather than running off the page
  const size = W * FONT * Math.min(1, MAX_LINE / (FONT * Math.max(ems(stamp.lines[0]), ems(stamp.lines[1]))));
  const gap = (size * LEADING) / 2;
  return (
    <svg
      className={styles.watermark}
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      data-stamp="tiles"
    >
      {/* The whole sentence in one piece, for the tamper guard to compare against */}
      <desc>{stamp.text}</desc>
      {MARKS.map((m) => (
        <g key={`${m.x}-${m.y}`} data-stamp-mark="" transform={`translate(${m.x * W} ${m.y * height}) rotate(${ANGLE})`}>
          <text className={styles.stampText} data-stamp-text="" y={-gap} dominantBaseline="central" fontSize={size} fillOpacity={STAMP_OPACITY}>{stamp.lines[0]}</text>
          <text className={styles.stampText} data-stamp-text="" y={gap} dominantBaseline="central" fontSize={size} fillOpacity={STAMP_OPACITY}>{stamp.lines[1]}</text>
        </g>
      ))}
    </svg>
  );
}
