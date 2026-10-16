"use client";
import { useEffect, useRef, type FocusEvent, type KeyboardEvent } from "react";

// The behaviour shared by the header's dropdowns (the account menu and "Who It's For"): opening moves focus to the
// first item, arrow keys move between items, Escape closes and returns focus to the button, and a click outside or
// focus leaving the menu closes it. Items take tabIndex={-1}, so Tab leaves the menu instead of walking through it
export function useMenu(open: boolean, onOpenChange: (open: boolean) => void) {
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = () => [...(wrap.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];

  useEffect(() => { if (open) wrap.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus(); }, [open]);

  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) onOpenChange(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, onOpenChange]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" && e.target === trigger.current) { e.preventDefault(); onOpenChange(true); }
      return;
    }
    if (e.key === "Escape") {
      onOpenChange(false);
      trigger.current?.focus();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const list = items();
      const at = list.indexOf(document.activeElement as HTMLElement);
      const next = e.key === "ArrowDown" ? (at + 1) % list.length : (at - 1 + list.length) % list.length;
      list[at === -1 ? 0 : next]?.focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const list = items();
      list[e.key === "Home" ? 0 : list.length - 1]?.focus();
    }
  };

  // Some browsers don't focus a button on click, so only a move to somewhere known and outside closes it here
  const onBlur = (e: FocusEvent) => {
    if (open && e.relatedTarget && !wrap.current?.contains(e.relatedTarget as Node)) onOpenChange(false);
  };

  return { wrap, trigger, rootProps: { ref: wrap, onKeyDown, onBlur } };
}
