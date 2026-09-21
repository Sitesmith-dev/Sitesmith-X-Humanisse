"use client";
import Link from "next/link";
import { useRef } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { LogIn } from "lucide-react";
import { CartButton } from "@/components/cart/CartButton";
import styles from "./Shared.module.css";

// Seamless header: clear at the top of the page, a soft frosted bar once you scroll,
// tucks away when you scroll down and slides back the moment you scroll up
export function SiteHeader() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useMotionValue("0%");
  const last = useRef(0);
  const hidden = useRef(false);

  const background = useTransform(scrollY, [0, 80], ["rgba(255,247,227,0)", "rgba(255,247,227,0.88)"]);
  const blur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(14px)"]);
  const borderColor = useTransform(scrollY, [0, 80], ["rgba(21,16,20,0)", "rgba(21,16,20,0.9)"]);

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

  return (
    <motion.header
      className={styles.header}
      style={{ y, backgroundColor: background, backdropFilter: blur, WebkitBackdropFilter: blur, borderBottomColor: borderColor }}
      onFocusCapture={() => setHidden(false)}
    >
      <div className={`wrap ${styles.bar}`}>
        <Link href="/" className={styles.logo} aria-label="Humanisse home">Humanisse</Link>
        <nav aria-label="Main" className={styles.nav}>
          <Link href="/comics" className={styles.link}>Comics</Link>
          <Link href="/#how-it-works" className={`${styles.link} ${styles.hideSm}`}>How It Works</Link>
          <Link href="/library" className={styles.link}>My Library</Link>
          <CartButton />
          <Link href="/login" className="btn"><LogIn size={18} aria-hidden="true" /> Log in</Link>
        </nav>
      </div>
    </motion.header>
  );
}
