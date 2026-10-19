"use client";
import { SiteLink as Link } from "@/components/shared/SiteLink";
import { useCallback, useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { LogIn, LogOut } from "lucide-react";
import { CartButton } from "@/components/cart/CartButton";
import { useSession } from "@/components/auth/useSession";
import styles from "./Shared.module.css";

export const SHOW_HEADER = "humanisse:show-header";

// Seamless header: clear at the top of the page, a soft frosted bar once you scroll,
// tucks away when you scroll down and slides back the moment you scroll up.
export function SiteHeader() {
  const reduce = useReducedMotion();
  const session = useSession();
  const { scrollY } = useScroll();
  const y = useMotionValue("0%");
  const last = useRef(0);
  const hidden = useRef(false);

  const background = useTransform(scrollY, [0, 80], ["rgba(255,247,227,0)", "rgba(255,247,227,0.88)"]);
  const blur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(14px)"]);
  const borderColor = useTransform(scrollY, [0, 80], ["rgba(21,16,20,0)", "rgba(21,16,20,0.9)"]);

  const setHidden = useCallback((h: boolean) => {
    if (hidden.current === h) return;
    hidden.current = h;
    animate(y, h ? "-105%" : "0%", { duration: 0.3, ease: [0.16, 1, 0.3, 1] });
  }, [y]);

  // A scroll that should land just below the header (the footer's FAQ link) asks it to stay in view until that
  // scroll has finished, so scrolling down to the section does not tuck the header away
  const pinned = useRef(false);
  useEffect(() => {
    let release: ReturnType<typeof setTimeout>;
    const unpin = () => { pinned.current = false; last.current = window.scrollY; clearTimeout(release); };
    const show = () => {
      pinned.current = true;
      setHidden(false);
      window.addEventListener("scrollend", unpin, { once: true });
      clearTimeout(release);
      release = setTimeout(unpin, 1500); // browsers without scrollend, or a scroll of zero distance
    };
    window.addEventListener(SHOW_HEADER, show);
    return () => { window.removeEventListener(SHOW_HEADER, show); window.removeEventListener("scrollend", unpin); clearTimeout(release); };
  }, [setHidden]);

  useMotionValueEvent(scrollY, "change", (now) => {
    if (reduce || pinned.current) return;
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
          <Link href="/library" className={styles.link}>My Library</Link>
          <CartButton />
          {session?.signedIn ? (
            <form method="post" action="/auth/signout">
              <button type="submit" className="btn"><LogOut size={18} aria-hidden="true" /> Log out</button>
            </form>
          ) : (
            <Link href="/login" className="btn"><LogIn size={18} aria-hidden="true" /> Log in</Link>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
