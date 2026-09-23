"use client";
import { SiteLink as Link } from "@/components/shared/SiteLink";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { comics, getComic } from "@/content/comics";
import { ComicCover } from "@/components/comics/ComicCover";
import { SET_PRICE, rupee, useCart } from "./CartContext";
import styles from "./Cart.module.css";

// Line items on the left, a sticky order summary on the right, and a checkout that only ever shows a preview notice
export function CartView() {
  const { items, ready, remove, count, subtotal, total, isFullSet, saving, addAll } = useCart();
  const [note, setNote] = useState(false);
  const lines = items.map(getComic).filter((c) => c !== undefined);

  if (!ready) return <section className="section wrap" aria-busy="true" aria-label="Loading your cart" />;

  if (lines.length === 0) {
    return (
      <section className="section wrap" aria-labelledby="cart-h">
        <h2 id="cart-h" className="sr-only">Cart contents</h2>
        <div className={styles.empty}>
          <ShoppingBag size={48} aria-hidden="true" />
          <h3>Your cart is empty</h3>
          <p>Pick a comic, watch its short introduction, then come back here</p>
          <Link href="/comics" className="btn btn-primary btn-lg">Browse Comics <ArrowRight size={20} aria-hidden="true" /></Link>
        </div>
      </section>
    );
  }

  return (
    <section className={`section wrap ${styles.layout}`} aria-labelledby="cart-h">
      <div>
        <h2 id="cart-h" className={styles.heading} aria-live="polite">{count} {count === 1 ? "comic" : "comics"} in your cart</h2>
        <ul className={styles.list}>
          <AnimatePresence initial={false}>
            {lines.map((c) => (
              <motion.li key={c.slug} className={styles.item} layout
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
                <div className={styles.thumb}><ComicCover comic={c} /></div>
                <div className={styles.itemBody}>
                  <h3><Link href={`/comics/${c.slug}`}>{c.title}</Link></h3>
                  <ul className={styles.tags} aria-label="Themes">
                    {c.tags.slice(0, 2).map((t) => <li key={t} className="tag">{t}</li>)}
                  </ul>
                </div>
                <div className={styles.itemSide}>
                  <strong className={styles.price}>{c.priceLabel}</strong>
                  <button type="button" className={styles.remove} onClick={() => remove(c.slug)} aria-label={`Remove ${c.title} from cart`}><X size={18} aria-hidden="true" /> Remove</button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {!isFullSet && (
          <p className={styles.setNudge}>
            Add all {comics.length} comics and the set price of {rupee(SET_PRICE)} applies instead
            <button type="button" className="btn" onClick={addAll}>Add the complete set</button>
          </p>
        )}
      </div>
      <aside className={styles.summary} aria-labelledby="sum-h">
        <h2 id="sum-h">Order summary</h2>
        <dl className={styles.rows} aria-live="polite">
          <div className={styles.row}><dt>Subtotal</dt><dd>{rupee(subtotal)}</dd></div>
          {isFullSet && <div className={`${styles.row} ${styles.saving}`}><dt>Complete set saving</dt><dd>&minus;{rupee(saving)}</dd></div>}
          <div className={`${styles.row} ${styles.total}`}><dt>Total</dt><dd>{rupee(total)}</dd></div>
        </dl>
        <button type="button" className="btn btn-primary btn-lg" onClick={() => setNote(true)} aria-describedby="checkout-note">Checkout</button>
        <p id="checkout-note" className={styles.checkNote} aria-live="polite">
          {note && <span className="notice"><span className="demo">Preview</span> Payments arrive in the production build, nothing has been charged</span>}
        </p>
        <p className={styles.small}><span className="demo">Sample prices</span> Saved on this device only</p>
      </aside>
    </section>
  );
}
