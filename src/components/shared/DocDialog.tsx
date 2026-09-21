"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { LegalDoc } from "@/content/legal-copy";
import styles from "./Shared.module.css";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const noop = () => () => {};
const yes = () => true;
const no = () => false;

// One reusable document dialog: portalled over the whole page so section clip paths and transforms cannot trap it,
// focus moves in on open and back to whatever opened it on close, Tab is trapped and the page behind stays put
export function DocDialog({ open, doc, onClose }: { open: boolean; doc: LegalDoc; onClose: () => void }) {
  const mounted = useSyncExternalStore(noop, yes, no);
  const panel = useRef<HTMLDivElement>(null);
  const titleId = `doc-${doc.title.toLowerCase().replace(/[^a-z]+/g, "-")}`;

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panel.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const nodes = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) { e.preventDefault(); return; }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === first || current === panel.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && current === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className={styles.dlgBack} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <motion.div ref={panel} className={styles.dlg} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
            <div className={styles.dlgHead}>
              <h2 id={titleId}>{doc.title}</h2>
              <button type="button" className={`btn ${styles.dlgClose}`} onClick={onClose} aria-label={`Close ${doc.title}`}><X size={18} aria-hidden="true" /> Close</button>
            </div>
            <p className={styles.dlgMeta}>{doc.updated}</p>
            <p className="notice"><span className="demo">Placeholder</span> Sample document awaiting client approval, final wording comes from Humanisse</p>
            <div className={styles.dlgBody}>
              {doc.body.map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
