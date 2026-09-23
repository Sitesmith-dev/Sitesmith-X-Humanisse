"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./Reader.module.css";

type Panel = { area: string; tone: "dots" | "hatch" | "flat"; figure: "left" | "right" | "centre" | "none" };
type Variant = { panels: Panel[]; bubbles: { panel: number; x: number; y: number; lines: number }[] };

// Four different page arrangements on a six by six grid, so consecutive pages never look like the same page twice.
// Everything is drawn in CSS, there is no artwork in `public/` and none is expected until the client delivers it
const VARIANTS: Variant[] = [
  {
    panels: [
      { area: "1 / 1 / 4 / 7", tone: "dots", figure: "right" },
      { area: "4 / 1 / 7 / 4", tone: "flat", figure: "left" },
      { area: "4 / 4 / 7 / 7", tone: "hatch", figure: "centre" },
    ],
    bubbles: [{ panel: 0, x: 8, y: 10, lines: 2 }, { panel: 2, x: 12, y: 12, lines: 1 }],
  },
  {
    panels: [
      { area: "1 / 1 / 3 / 4", tone: "flat", figure: "centre" },
      { area: "1 / 4 / 3 / 7", tone: "dots", figure: "left" },
      { area: "3 / 1 / 5 / 7", tone: "hatch", figure: "right" },
      { area: "5 / 1 / 7 / 7", tone: "flat", figure: "none" },
    ],
    bubbles: [{ panel: 1, x: 10, y: 14, lines: 1 }, { panel: 3, x: 6, y: 16, lines: 2 }],
  },
  {
    panels: [
      { area: "1 / 1 / 7 / 4", tone: "hatch", figure: "centre" },
      { area: "1 / 4 / 4 / 7", tone: "flat", figure: "right" },
      { area: "4 / 4 / 7 / 7", tone: "dots", figure: "left" },
    ],
    bubbles: [{ panel: 0, x: 9, y: 8, lines: 2 }],
  },
  {
    panels: [
      { area: "1 / 1 / 4 / 3", tone: "dots", figure: "centre" },
      { area: "1 / 3 / 4 / 7", tone: "flat", figure: "left" },
      { area: "4 / 1 / 7 / 7", tone: "hatch", figure: "right" },
    ],
    bubbles: [{ panel: 1, x: 8, y: 12, lines: 1 }, { panel: 2, x: 62, y: 14, lines: 2 }],
  },
];

/** A drawn stand-in for one comic page, varied by page index and sized entirely in container units so one component serves both the spread and the thumbnails. */
export function ReaderPagePlaceholder({ index, number }: { index: number; number: number }) {
  const variant = VARIANTS[index % VARIANTS.length];
  return (
    <div className={styles.art} data-variant={index % VARIANTS.length}>
      <span className={styles.pageNumber} aria-hidden="true">{number}</span>
      {variant.panels.map((panel, i) => (
        <div key={i} className={styles.panel} data-tone={panel.tone} style={{ gridArea: panel.area }} aria-hidden="true">
          {panel.figure !== "none" && <span className={styles.figure} data-at={panel.figure} />}
          <span className={styles.horizon} />
          {variant.bubbles.filter((b) => b.panel === i).map((b, j) => (
            <span key={j} className={styles.bubble} style={{ left: `${b.x}%`, top: `${b.y}%` }}>
              {Array.from({ length: b.lines }, (_, k) => <span key={k} className={styles.bubbleLine} />)}
            </span>
          ))}
        </div>
      ))}
      <span className={styles.placeholderLabel}>Placeholder page</span>
    </div>
  );
}

/** One page of the reader: the real artwork when the content has it, the drawn placeholder until then and if the file fails to load. */
export function ReaderPage({ src, index, number, title, sizes }: { src?: string; index: number; number: number; title: string; sizes: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <ReaderPagePlaceholder index={index} number={number} />;
  return (
    <Image
      src={src}
      alt={`${title}, page ${number}`}
      fill
      sizes={sizes}
      draggable={false}
      style={{ objectFit: "contain" }}
      onError={() => setFailed(true)}
      priority={index < 2}
    />
  );
}
