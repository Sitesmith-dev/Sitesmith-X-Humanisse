"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, LogIn, ShoppingBag, X } from "lucide-react";
import { getComic } from "@/content/comics";
import { useCart } from "@/components/cart/CartContext";
import { rupee } from "@/components/cart/pricing";
import { BrassFrame } from "./BrassFrame";
import { clothFor, personality } from "./comic-personality";
import { Ornament } from "./Ornament";
import { Reveal } from "./Reveal";
import { VintageRoot } from "./VintageRoot";
import { base } from "./definition";
import styles from "./vintage.module.css";

export function CartExperience() {
  const { items, ready, remove, count, subtotal, total, saving } = useCart();
  const [note, setNote] = useState(false);
  const lines = items.map(getComic).filter((c) => c !== undefined);

  return (
    <VintageRoot className={styles.root}>
      <section className={`${styles.pageHead} ${styles.vaultHead}`}>
        <div className="wrap">
          <div className={styles.vaultHeadRow}>
            <div>
              <p className={styles.kicker}>Preview Data</p>
              <h1 className={styles.h1small}>Your Cart</h1>
              <Ornament className={styles.heroOrnament} />
              <p className={styles.lead}>Comics you have set aside, kept here until you are ready to begin</p>
            </div>
            <ShoppingBag size={92} strokeWidth={1} className={styles.vaultWatermark} aria-hidden="true" />
          </div>
        </div>
      </section>

      {!ready ? null : lines.length === 0 ? (
        <section className={styles.catBody}>
          <div className="wrap">
            <Reveal className={styles.emptyList}>
              <ShoppingBag size={40} aria-hidden="true" />
              <h2 className={styles.h2}>Your cart is empty</h2>
              <p className={styles.lead}>Open a comic and add it here, then come back when you are ready to read</p>
              <Link href={`${base}/comics`} className={styles.btnPrimary}>Browse Comics <ArrowRight size={18} aria-hidden="true" /></Link>
            </Reveal>
          </div>
        </section>
      ) : (
        <section className={styles.catBody}>
          <div className={`wrap ${styles.cartGrid}`}>
            <ul className={styles.cartList}>
              {lines.map((c, i) => (
                <Reveal as="li" key={c.slug} delay={i * 0.05} className={styles.cartRow}>
                  <div className={styles.ledgerCover} style={{ borderLeftColor: clothFor(c.slug), background: c.coverImage ? undefined : clothFor(c.slug) }}>
                    {c.coverImage ? <Image src={c.coverImage} alt="" fill sizes="60px" style={{ objectFit: "cover" }} /> : <span>{c.title[0]}</span>}
                  </div>
                  <div className={styles.cartRowInfo}>
                    <h3>{c.title}</h3>
                    <p>{c.priceLabel}</p>
                    {personality[c.slug] && <p className={styles.cartRowVoice}>&ldquo;{personality[c.slug].line}&rdquo;</p>}
                  </div>
                  <button type="button" className={styles.cartRemove} onClick={() => remove(c.slug)} aria-label={`Remove ${c.title} from your cart`}><X size={16} aria-hidden="true" /></button>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.1} className={styles.buyCard}>
              <BrassFrame />
              <dl className={styles.summary}>
                <div className={styles.summaryRow}><dt>{count} {count === 1 ? "comic" : "comics"}</dt><dd>{rupee(subtotal)}</dd></div>
                {saving > 0 && <div className={styles.summaryRow}><dt>Set saving</dt><dd>&minus;{rupee(saving)}</dd></div>}
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}><dt>Total</dt><dd>{rupee(total)}</dd></div>
              </dl>
              <button type="button" className={styles.btnPrimary} style={{ width: "100%", justifyContent: "center", marginTop: 20 }} onClick={() => setNote(true)}>Begin Checkout (preview)</button>
              {note && <p className={styles.buyDisclosure}>Preview only, no payment is taken and nothing has been purchased</p>}
              <Link href={`${base}/login`} className={styles.btnGhost} style={{ width: "100%", justifyContent: "center", marginTop: 12 }}><LogIn size={16} aria-hidden="true" /> Log in to save this list</Link>
            </Reveal>
          </div>
        </section>
      )}
    </VintageRoot>
  );
}
