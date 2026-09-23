"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animate, AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { ArrowLeft, LogIn, ShoppingBag } from "lucide-react";
import type { ConceptDefinition } from "@/concepts/registry";
import { useCart } from "@/components/cart/CartContext";
import { display as vrDisplay, body as vrBody } from "@/concepts/vintage-reading-room/font";
import styles from "./ConceptBar.module.css";

const tabs = [
  { href: "/comics", label: "Comics" },
  { href: "/#how-h", label: "How It Works" },
  { href: "/library", label: "My Library" },
];

// This concept's own site header: transparent over the hero photo like a title card, gains a solid backdrop
// once you scroll past it, and tucks away on the way down the same way Direction A's header does
export function ConceptBar({ concept }: { concept: ConceptDefinition }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useMotionValue("0%");
  const last = useRef(0);
  const hidden = useRef(false);
  const { count } = useCart();
  const headerRef = useRef<HTMLElement>(null);

  // The hero pulls itself up underneath this header (see .hero in vintage.module.css), so the header always
  // needs to report its own real height, wrapped to one row or two, rather than a guessed constant
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty("--vr-header-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const background = useTransform(scrollY, [0, 90], ["rgba(22,56,43,0)", "rgba(22,56,43,.92)"]);
  const blur = useTransform(scrollY, [0, 90], ["blur(0px)", "blur(12px)"]);
  const borderColor = useTransform(scrollY, [0, 90], ["rgba(180,134,58,0)", "rgba(180,134,58,1)"]);

  const setHidden = (h: boolean) => {
    if (hidden.current === h) return;
    hidden.current = h;
    animate(y, h ? "-105%" : "0%", { duration: 0.3, ease: [0.16, 1, 0.3, 1] });
  };
  useMotionValueEvent(scrollY, "change", (now) => {
    if (reduce) return;
    const delta = now - last.current;
    last.current = now;
    if (now < 120) setHidden(false);
    else if (delta > 4) setHidden(true);
    else if (delta < -4) setHidden(false);
  });

  const base = `/concepts/${concept.slug}`;
  const isLanding = pathname === base;
  const solid = "rgba(22,56,43,.94)";
  const solidBorder = "rgba(180,134,58,1)";
  return (
    <motion.header
      ref={headerRef}
      className={`${styles.bar} ${vrDisplay.variable} ${vrBody.variable}`}
      style={{ y, backgroundColor: isLanding ? background : solid, backdropFilter: isLanding ? blur : "blur(12px)", WebkitBackdropFilter: isLanding ? blur : "blur(12px)", borderBottomColor: isLanding ? borderColor : solidBorder }}
      onFocusCapture={() => setHidden(false)}
    >
      <div className={`wrap ${styles.row}`}>
        <Link href={base} className={styles.wordmark}>Humanisse<span className={styles.badge}>Preview</span></Link>
        <nav aria-label={`${concept.name} navigation`} className={styles.tabs}>
          {tabs.map((t) => {
            const href = `${base}${t.href}`;
            const active = pathname === href || (t.href === "/comics" && pathname === `${base}/comics/negotiation`);
            return <Link key={t.href} href={href} aria-current={active ? "page" : undefined} className={styles.tab}>{t.label}</Link>;
          })}
          <Link href={`${base}/cart`} className={styles.cartLink} aria-label={count > 0 ? `Reading list, ${count} ${count === 1 ? "comic" : "comics"}` : "Reading list, empty"}>
            <ShoppingBag size={18} aria-hidden="true" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span key="b" className={styles.cartBadge} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 22 }}>{count}</motion.span>
              )}
            </AnimatePresence>
          </Link>
          <Link href={`${base}/login`} className={styles.loginBtn}><LogIn size={16} aria-hidden="true" /> Log in</Link>
        </nav>
        <Link href="/concepts" className={styles.back}><ArrowLeft size={14} aria-hidden="true" /> All directions</Link>
      </div>
    </motion.header>
  );
}
