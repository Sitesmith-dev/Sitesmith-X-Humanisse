"use client";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown, PanelLeft } from "lucide-react";
import styles from "./Reader.module.css";

export type MenuItem = {
  id: string;
  label: string;
  /** `action` runs and closes, `check` is an independent tick, `radio` belongs to a single-choice group */
  kind: "action" | "check" | "radio";
  checked?: boolean;
  disabled?: boolean;
  /** Shown under a disabled item to explain why it cannot be chosen */
  note?: string;
  onSelect: () => void;
};

const EASE = [0.16, 1, 0.3, 1] as const;

// The view menu, built by hand rather than with a <select> so it can carry ticks, two groups and a disabled item with a note.
// Keyboard contract: arrows roam the items, Home and End jump, Enter and Space choose, Escape closes and hands focus back to the trigger
export function ViewMenu({ groups }: { groups: MenuItem[][] }) {
  const reduce = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const items = groups.flat();
  // Which item takes focus when the menu opens, and where the arrow keys move from
  const [active, setActive] = useState(0);

  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  };

  // Focus follows the active item while the menu is open
  useEffect(() => {
    if (!open) return;
    list.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]')[active]?.focus();
  }, [open, active]);

  // A press anywhere outside the menu closes it, without stealing focus back
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!list.current?.contains(target) && !trigger.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const choose = (item: MenuItem) => {
    if (item.disabled) return;
    item.onSelect();
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = items.length - 1;
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => (i >= last ? 0 : i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (i <= 0 ? last : i - 1)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(last); }
    else if (e.key === "Tab") close(false);
  };

  const openWith = (index: number) => { setActive(index); setOpen(true); };

  return (
    <div className={styles.menuRoot}>
      <button
        ref={trigger}
        type="button"
        className={`btn ${styles.toolBtn}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (open ? close(false) : openWith(0))}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); openWith(0); }
          if (e.key === "ArrowUp") { e.preventDefault(); openWith(items.length - 1); }
        }}
      >
        <PanelLeft size={20} aria-hidden="true" />
        <span className={styles.toolLabel}>View</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={list}
            id={id}
            role="menu"
            aria-label="View options"
            className={styles.menu}
            onKeyDown={onKeyDown}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.16, ease: EASE }}
          >
            {groups.map((group, g) => (
              <div key={g} className={styles.menuGroup} role="group">
                {group.map((item) => {
                  const index = items.indexOf(item);
                  const role = item.kind === "action" ? "menuitem" : item.kind === "check" ? "menuitemcheckbox" : "menuitemradio";
                  return (
                    <div key={item.id} className={styles.menuRow}>
                      <button
                        type="button"
                        role={role}
                        tabIndex={-1}
                        className={styles.menuItem}
                        aria-checked={item.kind === "action" ? undefined : !!item.checked}
                        aria-disabled={item.disabled || undefined}
                        aria-describedby={item.note ? `${id}-${item.id}-note` : undefined}
                        onClick={() => choose(item)}
                        onFocus={() => setActive(index)}
                      >
                        <span className={styles.menuCheck} aria-hidden="true">
                          {item.checked && <Check size={16} strokeWidth={3} />}
                        </span>
                        {item.label}
                      </button>
                      {item.note && <p id={`${id}-${item.id}-note`} className={styles.menuNote}>{item.note}</p>}
                    </div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
