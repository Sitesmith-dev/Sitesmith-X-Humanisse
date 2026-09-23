"use client";
import { useId } from "react";
import styles from "./Reader.module.css";

// Every value the mark's appearance depends on lives here. They are tuned against four clean CSS placeholder pages,
// so expect to re-tune them the day real artwork arrives: dense or dark pages will want a different balance
const WATERMARK_TEXT = "Humanisse";
const ANGLE = -30;
/** User space shaped like a page, so every number below is page-relative and the mark scales with the page at any zoom */
const PAGE = { width: 300, height: 400 };
/** Roughly four marks across the page width, and denser than that once the tile is rotated */
const TILE = { width: 74, height: 52 };
const FONT_SIZE = 11;
/** The word is stretched to fill the tile less this padding, which is what letter-spaces it */
const TEXT_INSET = 4;
const FILL_OPACITY = 0.07;
const STROKE_OPACITY = 0.05;
const STROKE_WIDTH = 1.1;

/**
 * The repeating Humanisse mark laid over a reader page. `text` is the seam the security layer will use to carry a
 * reader reference instead of the brand, so nothing here assumes the word is the same for everyone.
 */
export function PageWatermark({ text = WATERMARK_TEXT }: { text?: string }) {
  // One pattern per page, and the id has to survive being written into url(...), which React's own ids do not
  const patternId = `wm-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg
      className={styles.watermark}
      viewBox={`0 0 ${PAGE.width} ${PAGE.height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id={patternId}
          width={TILE.width}
          height={TILE.height}
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${ANGLE})`}
        >
          <text
            className={styles.watermarkText}
            x={TEXT_INSET}
            y={TILE.height / 2}
            fontSize={FONT_SIZE}
            textLength={TILE.width - TEXT_INSET * 2}
            lengthAdjust="spacing"
            dominantBaseline="middle"
            fillOpacity={FILL_OPACITY}
            strokeOpacity={STROKE_OPACITY}
            strokeWidth={STROKE_WIDTH}
          >
            {text}
          </text>
        </pattern>
      </defs>
      <rect width={PAGE.width} height={PAGE.height} fill={`url(#${patternId})`} />
    </svg>
  );
}
