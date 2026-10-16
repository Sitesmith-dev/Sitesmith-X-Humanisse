"use client";
import { useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LogOut, UserRound } from "lucide-react";
import { useMenu } from "./useMenu";
import styles from "./Shared.module.css";

type Props = { name: string | null; open: boolean; onOpenChange: (open: boolean) => void };

// "Hi {name}" in the header, opening a small menu with Log out. The header owns `open` so it can close the menu
// when it slides away on scroll, on every page change, and when another header menu opens
export function AccountMenu({ name, open, onOpenChange }: Props) {
  const reduce = useReducedMotion();
  const menuId = useId();
  const { trigger, rootProps } = useMenu(open, onOpenChange);

  return (
    <div {...rootProps} className={styles.account}>
      <button
        ref={trigger}
        type="button"
        className={`btn ${styles.accountBtn}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={name ? `Account menu, signed in as ${name}` : "Account menu"}
        onClick={() => onOpenChange(!open)}
      >
        <span className={`${styles.hi} ${styles.hideSm}`}>Hi {name || "there"}</span>
        <span className={styles.avatar}><UserRound size={18} aria-hidden="true" /></span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            id={menuId}
            role="menu"
            aria-label="Account"
            className={styles.menu}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: reduce ? 0 : 0.15, ease: "easeOut" }}
          >
            {/* A full-page post, not a Server Action: see src/app/auth/signout/route.ts */}
            <form method="post" action="/auth/signout">
              <button type="submit" role="menuitem" tabIndex={-1} className={styles.menuItem}><LogOut size={18} aria-hidden="true" /> Log out</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
