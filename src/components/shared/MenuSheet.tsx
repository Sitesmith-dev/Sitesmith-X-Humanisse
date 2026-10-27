"use client";
import { SiteLink as Link } from "@/components/shared/SiteLink";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, LogIn, LogOut, Menu, X } from "lucide-react";
import { useSession } from "@/components/auth/useSession";
import { isGroup, primaryNav, type NavGroup } from "@/content/navigation";
import styles from "./Menu.module.css";

// The three-lines button and the sheet it opens: every page in one plain list, "Who it's for" opening to its three
// audiences, and the account action at the foot. Rendered into <body>, because the header's blur would otherwise
// trap a fixed sheet inside the header's own box
export function MenuSheet() {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const session = useSession();
  const opener = useRef<HTMLButtonElement>(null);
  const closer = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const client = useSyncExternalStore(() => () => {}, () => true, () => false);

  // Any navigation closes the sheet
  const [seen, setSeen] = useState(pathname);
  if (seen !== pathname) { setSeen(pathname); setOpen(false); setGroup(null); }

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closer.current?.focus();
    const behind = ["main", "footer"].map((q) => document.querySelector<HTMLElement>(q === "main" ? "#main" : q)).filter((el): el is HTMLElement => !!el);
    const back = opener.current;
    behind.forEach((el) => el.setAttribute("inert", ""));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab" || !sheet.current) return;
      const nodes = Array.from(sheet.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; behind.forEach((el) => el.removeAttribute("inert")); back?.focus({ preventScroll: true }); };
  }, [open]);

  const t = reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };
  const sheetEl = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={sheet}
          className={styles.sheet}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          initial={{ opacity: 0, y: reduce ? 0 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -6, transition: reduce ? { duration: 0 } : { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
          transition={t}
        >
          <div className={styles.panel}>
          <div className={styles.top}>
            <Link href="/" className={styles.logo} aria-label="Humanisse home">Humanisse</Link>
            <button ref={closer} type="button" className={styles.icon} onClick={() => setOpen(false)} aria-label="Close menu"><X size={26} aria-hidden="true" /></button>
          </div>
          <nav className={styles.list} aria-label="Menu">
            <ul>
              {primaryNav.map((item) => isGroup(item) ? (
                <li key={item.label}>
                  <Group g={item} open={group === item.label} onToggle={() => setGroup(group === item.label ? null : item.label)} />
                </li>
              ) : (
                <li key={item.href}><Link href={item.href} className={styles.row}>{item.label}</Link></li>
              ))}
              <li><Link href="/library" prefetch={false} className={styles.row}>My Library</Link></li>
            </ul>
            {session?.signedIn ? (
              <form method="post" action="/auth/signout"><button type="submit" className={`btn ${styles.cta}`}><LogOut size={20} aria-hidden="true" /> Log out</button></form>
            ) : (
              <Link href="/login" prefetch={false} className={`btn btn-primary ${styles.cta}`}><LogIn size={20} aria-hidden="true" /> Log in or create account</Link>
            )}
          </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button ref={opener} type="button" className={styles.icon} onClick={() => setOpen((v) => !v)} aria-label="Menu" aria-expanded={open} aria-haspopup="dialog">{open ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}</button>
      {client ? createPortal(sheetEl, document.body) : null}
    </>
  );
}

function Group({ g, open, onToggle }: { g: NavGroup; open: boolean; onToggle: () => void }) {
  return (
    <>
      <button type="button" className={`${styles.row} ${styles.groupBtn}`} aria-expanded={open} onClick={onToggle}>
        {g.label}
        <ChevronDown size={22} aria-hidden="true" className={styles.chev} />
      </button>
      <div className={styles.sub} data-open={open}>
        <ul>{g.items.map((i) => <li key={i.href}><Link href={i.href} className={styles.subRow} tabIndex={open ? 0 : -1}>{i.label}</Link></li>)}</ul>
      </div>
    </>
  );
}
