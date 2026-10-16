"use client";
import { useEffect, useId, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { SiteLink as Link } from "@/components/shared/SiteLink";
import { isActive, isGroup, primaryNav } from "@/content/navigation";
import styles from "./Shared.module.css";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; signedIn: boolean | null };

// Below 1024px the page links fold into one panel under the header. Cart and the account control stay outside it,
// so the basket is never more than one tap away. The page behind is locked while the panel is open
export function MobileMenu({ open, onOpenChange, signedIn }: Props) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const panelId = useId();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      onOpenChange(false);
      button.current?.focus();
    };
    // Widening past the breakpoint swaps in the desktop links, so the panel has nothing left to do
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => { if (wide.matches) onOpenChange(false); };
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      html.style.overflow = before;
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open, onOpenChange]);

  const link = (href: string, label: string, indent = false) => (
    <li key={href}>
      <Link href={href} className={`${styles.mLink} ${indent ? styles.mIndent : ""}`} aria-current={isActive(pathname, href) ? "page" : undefined}
        onClick={() => onOpenChange(false)}>
        {label}
      </Link>
    </li>
  );

  return (
    <>
      <button ref={button} type="button" className={`btn ${styles.burger}`} aria-expanded={open} aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close menu" : "Open menu"} onClick={() => onOpenChange(!open)}>
        {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            key="panel"
            id={panelId}
            className={styles.mPanel}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.15, ease: "easeOut" }}
          >
            <nav aria-label="Main" className="wrap">
              <ul className={styles.mList}>
                {primaryNav.map((item) => isGroup(item) ? (
                  <li key={item.label}>
                    <span id={`${panelId}-group`} className={styles.mGroup}>{item.label}</span>
                    <ul className={styles.mList} aria-labelledby={`${panelId}-group`}>
                      {item.items.map((i) => link(i.href, i.label, true))}
                    </ul>
                  </li>
                ) : link(item.href, item.label))}
              </ul>
              <hr className={styles.mRule} />
              <ul className={styles.mList}>
                {link("/library", "My Library")}
                {signedIn === false && link("/login", "Log in")}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
