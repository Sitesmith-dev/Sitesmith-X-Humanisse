"use client";
import { useId } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { SiteLink as Link } from "@/components/shared/SiteLink";
import { isActive, type NavGroup } from "@/content/navigation";
import { useMenu } from "./useMenu";
import styles from "./Shared.module.css";

type Props = { group: NavGroup; open: boolean; onOpenChange: (open: boolean) => void };

// A group of page links in the desktop header ("Who It's For"). Opens on click, Enter, Space or Arrow Down
export function NavDropdown({ group, open, onOpenChange }: Props) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const menuId = useId();
  const { trigger, rootProps } = useMenu(open, onOpenChange);
  const active = group.items.some((i) => isActive(pathname, i.href));

  return (
    <div {...rootProps} className={styles.dropdown}>
      <button
        ref={trigger}
        type="button"
        className={styles.link}
        data-active={active || undefined}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => onOpenChange(!open)}
      >
        {group.label} <ChevronDown size={16} aria-hidden="true" className={styles.chevron} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            key="menu"
            id={menuId}
            role="menu"
            aria-label={group.label}
            className={`${styles.menu} ${styles.menuLeft}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: reduce ? 0 : 0.15, ease: "easeOut" }}
          >
            {group.items.map((item) => (
              <li key={item.href} role="none">
                <Link href={item.href} role="menuitem" tabIndex={-1} className={styles.menuItem}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined} onClick={() => onOpenChange(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
