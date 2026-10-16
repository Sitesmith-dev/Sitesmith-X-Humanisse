"use client";
import { SiteLink as Link } from "@/components/shared/SiteLink";
import { useState } from "react";
import { legalCopy, type LegalDocKey } from "@/content/legal-copy";
import { DocDialog } from "@/components/shared/DocDialog";
import { useSession } from "@/components/auth/useSession";
import { isGroup, primaryNav } from "@/content/navigation";
import styles from "./Shared.module.css";

export function SiteFooter() {
  const [doc, setDoc] = useState<LegalDocKey | null>(null);
  const session = useSession();
  // Every page from the header, the three audience pages flattened in among them
  const pages = primaryNav.flatMap((item) => (isGroup(item) ? item.items : [item]));
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <h2>Humanisse</h2>
        <p>
          A learning company that uses original comics, cinema and literature to make important
          life and professional ideas simple, memorable and enjoyable
        </p>
        <nav aria-label="Footer" className={styles.footNav}>
          {pages.map((p) => <Link key={p.href} href={p.href}>{p.label}</Link>)}
          <Link href="/library">My Library</Link>
          {session?.signedIn === false && <Link href="/login">Log in</Link>}
          <Link href="/#faq">FAQ</Link>
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
