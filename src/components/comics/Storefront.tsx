"use client";
import { SiteLink as Link } from "@/components/shared/SiteLink";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Plus, Search, ShoppingBag } from "lucide-react";
import { comics } from "@/content/comics";
import { categoryLabels, type Category } from "@/types/comic";
import { SET_PRICE, rupee, useCart } from "@/components/cart/CartContext";
import { ComicCover } from "./ComicCover";
import styles from "./Catalogue.module.css";

type Cat = Category | "all";
const cats: Cat[] = ["all", "work", "life", "communication"];
const short: Record<Cat, string> = { all: "All", work: "Work", life: "Life", communication: "Communication" };

// The whole catalogue in about two screens on a phone: three covers across, a price and an Add button under each,
// and the full story one tap away on the comic's own page. The set offer is one slim bar, not a section
export function Storefront() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("all");
  const { has, toggle, count, total, saving, isFullSet, clear, addAll } = useCart();

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return comics.filter((c) =>
      (cat === "all" || c.category === cat) &&
      (!needle || [c.title, c.tagline, c.strapline, ...c.tags].some((t) => t.toLowerCase().includes(needle))));
  }, [q, cat]);
  const full = comics.reduce((s, c) => s + c.price, 0);

  return (
    <>
      <section className={`wrap ${styles.shop}`} aria-labelledby="all-h">
        <h2 id="all-h" className="sr-only">All comics</h2>
        <div className={styles.tools}>
          <label className={styles.search}>
            <span className="sr-only">Search comics</span>
            <Search size={18} aria-hidden="true" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search comics" />
          </label>
          <div className={styles.chips} role="group" aria-label="Filter by topic">
            {cats.map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} aria-label={c === "all" ? "All topics" : categoryLabels[c]} className={styles.chip} onClick={() => setCat(c)}>{short[c]}</button>
            ))}
          </div>
        </div>
        <p className="sr-only" aria-live="polite">{list.length} {list.length === 1 ? "comic" : "comics"}</p>

        {list.length > 0 ? (
          <ul className={styles.grid}>
            {list.map((c, i) => {
              const inCart = has(c.slug);
              return (
                <li key={c.slug} className={styles.item} style={{ "--i": i } as React.CSSProperties}>
                  <Link href={`/comics/${c.slug}`} className={styles.cardLink} aria-label={`${c.title}, ${c.priceLabel}`}>
                    <span className={styles.frame}><ComicCover comic={c} priority={i < 3} className={styles.cover} /></span>
                    <span className={styles.title}>{c.title}</span>
                    <span className={styles.tagline}>{c.tagline}</span>
                  </Link>
                  <button
                    type="button"
                    className={styles.add}
                    data-in={inCart}
                    aria-pressed={inCart}
                    aria-label={`${inCart ? "Remove" : "Add"} ${c.title} ${inCart ? "from" : "to"} cart`}
                    onClick={() => toggle(c.slug)}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={inCart ? "in" : "out"}
                        className={styles.addInner}
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(3px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(3px)" }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {inCart ? <><Check size={16} aria-hidden="true" /> Added</> : <><Plus size={16} aria-hidden="true" /> {c.priceLabel}</>}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={styles.empty}>
            <h3>No comics match that search</h3>
            <p>Try a different word or clear the filters</p>
            <button type="button" className="btn" onClick={() => { setQ(""); setCat("all"); }}>Clear filters</button>
          </div>
        )}

        <div className={styles.setBar} id="complete-set">
          <div className={styles.setText}>
            <strong>The complete set</strong>
            <span>{rupee(SET_PRICE)} <s>{rupee(full)}</s> <em>save {rupee(full - SET_PRICE)}</em></span>
          </div>
          <button type="button" className={`btn btn-primary ${styles.setBtn}`} onClick={() => (isFullSet ? clear() : addAll())}>
            {isFullSet ? "Remove the set" : "Add all ten"}
          </button>
        </div>
      </section>

      <AnimatePresence>
        {count > 0 && (
          <motion.div className={styles.bar} role="region" aria-label="Your cart" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className={styles.barText} aria-live="polite">
              <ShoppingBag size={22} aria-hidden="true" />
              <span><strong>{count} {count === 1 ? "comic" : "comics"}</strong>, sample total <strong>{rupee(total)}</strong>{saving > 0 && <>, saves {rupee(saving)}</>}</span>
            </div>
            <Link href="/cart" className="btn" prefetch={false}>View cart</Link>
            <button type="button" className="btn" onClick={clear}>Clear</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
