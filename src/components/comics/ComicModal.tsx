"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Maximize2, X } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ComicModal.module.css";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const EASE = [0.16, 1, 0.3, 1] as const;

// The comic pop-up. The URL is already /comics/[slug] by the time this mounts, so Expand is only a visual state change:
// the same panel grows to fill the viewport through a Motion layout animation, and a refresh renders the standalone page
export function ComicModal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const wentBack = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [closing, setClosing] = useState(false);
  const [moving, setMoving] = useState(false);
  // Next keeps a parallel slot's page mounted across soft navigation, so once the URL leaves /comics/[slug]
  // (Buy now to /cart, the breadcrumb to /comics) the pop-up hides itself and lets go of the page
  const active = pathname.startsWith("/comics/");
  const modal = active && !expanded;

  const close = () => setClosing(true);
  // Motion can report the close animation complete more than once before the route unmounts, and a second back would overshoot
  const goBack = () => { if (wentBack.current) return; wentBack.current = true; router.back(); };

  // Whatever had focus when the pop-up opened gets it back once the route unmounts. Captured here, before the page turns inert and blurs it
  useEffect(() => { opener.current = document.activeElement as HTMLElement | null; }, []);

  // While the pop-up floats over the page: lock body scroll, make the background inert, trap Tab and close on Escape
  useEffect(() => {
    if (!modal) return;
    const { overflow } = document.body.style;
    const behind = [document.querySelector("header"), document.getElementById("main")].filter((el): el is HTMLElement => !!el);
    document.body.style.overflow = "hidden";
    behind.forEach((el) => el.setAttribute("inert", ""));
    panel.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); setClosing(true); return; }
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
      behind.forEach((el) => el.removeAttribute("inert"));
    };
  }, [modal]);

  // Declared after the inert effect so this cleanup runs once inert has been lifted, otherwise the trigger would refuse focus
  useEffect(() => () => opener.current?.focus({ preventScroll: true }), []);

  // Expanded: the panel covers the page, so only Escape stays wired
  useEffect(() => {
    if (modal || !active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); setClosing(true); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal, active]);

  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 300, damping: 34 };
  const fade = reduce ? { duration: 0.1 } : { duration: 0.22, ease: EASE };

  if (!active) return null;
  return (
    <div className={styles.root} data-expanded={expanded}>
      <motion.div className={styles.backdrop} onClick={close} aria-hidden="true"
        initial={{ opacity: 0 }} animate={{ opacity: closing || expanded ? 0 : 1 }} transition={fade} />
      <motion.div ref={panel} className={styles.panel} role="dialog" aria-modal={modal} aria-labelledby="comic-h" tabIndex={-1}
        layout={!reduce} transition={spring}
        style={{ inset: expanded ? 0 : "15vh 15vw", borderRadius: expanded ? 0 : 16, willChange: moving ? "transform" : "auto" }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
        animate={closing ? { opacity: 0, scale: reduce ? 1 : 0.98, y: 0 } : { opacity: 1, scale: 1, y: 0, borderWidth: expanded ? 0 : 2.5 }}
        onAnimationComplete={() => { if (closing) goBack(); }}
        onLayoutAnimationStart={() => setMoving(true)}
        onLayoutAnimationComplete={() => { setMoving(false); ScrollTrigger.refresh(); }}>
        <motion.div layout="position" transition={spring} className={styles.scroll} data-scroller>
          <div className={styles.chrome}>
            <div className={styles.chromeRow}>
              {expanded ? (
                <button type="button" className="btn" onClick={close}><ArrowLeft size={18} aria-hidden="true" /> Back to comics</button>
              ) : (
                <>
                  <button type="button" className="btn" onClick={() => setExpanded(true)}><Maximize2 size={18} aria-hidden="true" /> Expand</button>
                  <button type="button" className={`btn ${styles.close}`} onClick={close} aria-label="Close">
                    <X size={22} aria-hidden="true" /><span className={styles.closeText}>Close</span>
                  </button>
                </>
              )}
            </div>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
