"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, MagnifyingGlass, ShoppingBag } from "./icons";
import { comics } from "@/content/comics";
import { categoryLabels, type Category } from "@/types/comic";
import { ComicCard } from "./ComicCard";
import { ComicCover } from "./ComicCover";
import styles from "./Storefront.module.css";

type Cat = Category | "all";
const cats: Cat[] = ["all", "work", "life", "communication"];
const SET_PRICE = 1499;
const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function Storefront() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("all");
  const [sort, setSort] = useState<"featured" | "az">("featured");
  const [bundle, setBundle] = useState<string[]>([]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = comics.filter((c) =>
      (cat === "all" || c.category === cat) &&
      (!needle || c.title.toLowerCase().includes(needle) || c.tags.some((t) => t.toLowerCase().includes(needle)) || c.shortDescription.toLowerCase().includes(needle)));
    return sort === "az" ? [...out].sort((a, b) => a.title.localeCompare(b.title)) : out;
  }, [q, cat, sort]);

  const toggle = (slug: string) => setBundle((b) => (b.includes(slug) ? b.filter((s) => s !== slug) : [...b, slug]));
  const allIn = bundle.length === comics.length;
  const total = allIn ? SET_PRICE : bundle.length * 199;
  const featured = comics[0];

  return (
    <>
      <section className="section wrap" style={{ paddingBottom: 24 }} aria-labelledby="feat-h">
        <div className={styles.feature}>
          <ComicCover comic={featured} className={styles.featureCover} priority />
          <div>
            <h2 id="feat-h">Start here: {featured.title}</h2>
            <p className="lead">{featured.shortDescription}</p>
            <p className={styles.featurePrice}><strong>{featured.priceLabel}</strong> <span className="demo">Sample price</span></p>
            <Link href={`/comics/${featured.slug}`} className="btn btn-primary btn-lg">View comic <ArrowRight size={20} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="wrap" aria-labelledby="all-h" style={{ paddingBottom: 48 }}>
        <div className={styles.toolbar}>
          <h2 id="all-h" style={{ margin: 0 }}>All comics</h2>
          <div className={styles.controls}>
            <label className={styles.search}>
              <span>Search</span>
              <span className={styles.input}><MagnifyingGlass size={18} aria-hidden="true" /><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try negotiation or trust" /></span>
            </label>
            <label className={styles.sort}>
              <span>Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as "featured" | "az")}>
                <option value="featured">Featured</option>
                <option value="az">Title A to Z</option>
              </select>
            </label>
          </div>
        </div>
        <div className={styles.chips} role="group" aria-label="Filter by topic">
          {cats.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} className={styles.chip} onClick={() => setCat(c)}>
              {c === "all" ? "All topics" : categoryLabels[c]}
            </button>
          ))}
        </div>
        <p className={styles.count} aria-live="polite">{list.length} {list.length === 1 ? "comic" : "comics"}</p>
        {list.length > 0 ? (
          <ul className={styles.grid}>
            {list.map((c) => (
              <li key={c.slug}><ComicCard comic={c} inBundle={bundle.includes(c.slug)} onToggle={toggle} /></li>
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>
            <h3>No comics match that search</h3>
            <p>Try a different word or clear the filters</p>
            <button type="button" className="btn" onClick={() => { setQ(""); setCat("all"); }}>Clear filters</button>
          </div>
        )}
      </section>

      <section className={styles.setBand} aria-labelledby="set-h">
        <div className={`wrap ${styles.setInner}`}>
          <div>
            <h2 id="set-h">The complete set</h2>
            <p>All ten launch comics together at a bundle price, so you can read the whole collection</p>
            <p className={styles.featurePrice}><strong>{rupee(SET_PRICE)}</strong> <span className="demo">Sample price</span></p>
          </div>
          <button type="button" className="btn btn-lg" onClick={() => setBundle(allIn ? [] : comics.map((c) => c.slug))}>
            {allIn ? "Remove the set" : "Add all ten to bundle"}
          </button>
        </div>
      </section>

      <AnimatePresence>
        {bundle.length > 0 && (
          <motion.div className={styles.bar} role="region" aria-label="Your bundle" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className={styles.barText}>
              <ShoppingBag size={22} aria-hidden="true" />
              <span><strong>{bundle.length} {bundle.length === 1 ? "comic" : "comics"}</strong> in your bundle, sample total <strong>{rupee(total)}</strong></span>
            </div>
            <p className={styles.barNote}>Checkout arrives in the full build</p>
            <button type="button" className="btn" onClick={() => setBundle([])}>Clear</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
