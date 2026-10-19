"use client";
import { SiteLink as Link } from "@/components/shared/SiteLink";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { legalCopy, type LegalDocKey } from "@/content/legal-copy";
import { DocDialog } from "@/components/shared/DocDialog";
import { useSession } from "@/components/auth/useSession";
import { SHOW_HEADER } from "@/components/shared/SiteHeader";
import { isGroup, primaryNav } from "@/content/navigation";
import styles from "./Shared.module.css";

export function SiteFooter() {
  const [doc, setDoc] = useState<LegalDocKey | null>(null);
  const session = useSession();
  // Every page from the header, the three audience pages flattened in among them
  const pages = primaryNav.flatMap((item) => (isGroup(item) ? item.items : [item]));

  // Next's own scroll would align the top of the new page's content with the viewport, leaving the sticky
  // header scrolled past, so the footer's links skip it and scroll themselves once the new page has rendered,
  // with the site's usual smooth scroll. Same-page clicks scroll at once.
  // Page links go to the very top; the FAQ link puts its section directly beneath the header, which stays shown.
  const pathname = usePathname();
  const pending = useRef<(() => void) | null>(null);
  useLayoutEffect(() => {
    pending.current?.();
    pending.current = null;
  }, [pathname]);

  const toTop = () => window.scrollTo({ top: 0 });
  function toFaq() {
    const faq = document.getElementById("faq");
    if (!faq) return;
    // The section's own ink top border tucks under the header's, so its cream panel starts right at the header
    const cover = (document.querySelector("header")?.offsetHeight ?? 0) - parseFloat(getComputedStyle(faq).borderTopWidth);
    window.dispatchEvent(new Event(SHOW_HEADER));
    window.scrollTo({ top: faq.getBoundingClientRect().top + window.scrollY - cover });
  }
  function jumpTo(e: MouseEvent<HTMLAnchorElement>, land: () => void) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = new URL(e.currentTarget.href);
    if (url.pathname !== window.location.pathname) { pending.current = land; return; }
    e.preventDefault();
    if (url.hash !== window.location.hash) window.history.pushState(null, "", url.href);
    land();
  }
  const pageLink = (href: string, label: string) => <Link key={href} href={href} scroll={false} onClick={(e) => jumpTo(e, toTop)}>{label}</Link>;

  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <h2>Humanisse</h2>
        <p>
          A learning company that uses original comics, cinema and literature to make important
          life and professional ideas simple, memorable and enjoyable
        </p>
        <nav aria-label="Footer" className={styles.footNav}>
          {pages.map((p) => pageLink(p.href, p.label))}
          {pageLink("/library", "My Library")}
          {session?.signedIn === false && pageLink("/login", "Log in")}
          <Link href="/#faq" scroll={false} onClick={(e) => jumpTo(e, toFaq)}>FAQ</Link>
          <button type="button" onClick={() => setDoc("terms")} aria-haspopup="dialog">T&amp;C</button>
          <button type="button" onClick={() => setDoc("legal")} aria-haspopup="dialog">Legal</button>
        </nav>
        <p className={styles.note}>Design preview, all comics, prices and actions are demonstration content</p>
      </div>
      <DocDialog open={doc === "terms"} doc={legalCopy.terms} onClose={() => setDoc(null)} />
      <DocDialog open={doc === "legal"} doc={legalCopy.legal} onClose={() => setDoc(null)} />
    </footer>
  );
}
