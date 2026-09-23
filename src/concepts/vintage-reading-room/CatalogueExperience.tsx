"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Lock, Search, X } from "lucide-react";
import { comics } from "@/content/comics";
import { categoryLabels, type Category, type Comic } from "@/types/comic";
import { clothFor, personality } from "./comic-personality";
import { VintageComicCover as ComicCover } from "./VintageComicCover";
import { Reveal } from "./Reveal";
import { VintageRoot } from "./VintageRoot";
import { base } from "./definition";
import styles from "./vintage.module.css";

const categories = Object.entries(categoryLabels) as [Category, string][];

export function CatalogueExperience() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return comics.filter((c) => {
      const matchesCategory = category === "all" || c.category === category;
      const matchesQuery = !q || c.title.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const clear = () => { setQuery(""); setCategory("all"); };

  return (
    <VintageRoot className={styles.root}>
      <section className={styles.pageHead}>
        <div className="wrap">
          <p className={styles.kicker}>The Card Catalogue</p>
          <h1 className={styles.h1small}>Comics</h1>
          <p className={styles.lead}>Ten stories, ten ideas worth keeping, filed away for whenever you would like to read one</p>
        </div>
      </section>

      <section className={styles.catFilterBar}>
        <div className="wrap">
          <label className={styles.catSearch}>
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the catalogue"
              aria-label="Search the catalogue"
            />
            {query && (
              <button type="button" className={styles.catSearchClear} onClick={() => setQuery("")} aria-label="Clear search">
                <X size={15} aria-hidden="true" />
              </button>
            )}
          </label>
          <ul className={styles.catFilterChips} role="group" aria-label="Filter by category">
            <li>
              <button type="button" className={styles.catChip} aria-pressed={category === "all"} onClick={() => setCategory("all")}>All Stories</button>
            </li>
            {categories.map(([key, label]) => (
              <li key={key}>
                <button type="button" className={styles.catChip} aria-pressed={category === key} onClick={() => setCategory(key)}>{label}</button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.catBody}>
        <div className="wrap">
          {filtered.length === 0 ? (
            <Reveal className={styles.emptyList}>
              <Search size={40} aria-hidden="true" />
              <h2 className={styles.h2}>No comics match</h2>
              <p className={styles.lead}>Try another word or drop the category filter to see the whole catalogue</p>
              <button type="button" className={styles.btnPrimary} onClick={clear}>Clear filters</button>
            </Reveal>
          ) : (
            <ul className={styles.catGrid}>
              {filtered.map((c, i) => {
                const index = comics.indexOf(c);
                const tilt = index % 2 === 0 ? "-0.6deg" : "0.6deg";
                return (
                  <Reveal as="li" key={c.slug} delay={(i % 5) * 0.05} className={styles.catCardWrap}>
                    {c.slug === "negotiation" ? (
                      <Link href={`${base}/comics/negotiation`} className={styles.catCard} style={{ borderTopColor: clothFor(c.slug), "--cat-tilt": tilt } as React.CSSProperties}>
                        <CardBody comic={c} index={index} />
                      </Link>
                    ) : (
                      <div className={styles.catCard} style={{ borderTopColor: clothFor(c.slug), "--cat-tilt": tilt } as React.CSSProperties} aria-disabled="true">
                        <CardBody comic={c} index={index} locked />
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </VintageRoot>
  );
}

function CardBody({ comic, index, locked = false }: { comic: Comic; index: number; locked?: boolean }) {
  const voice = personality[comic.slug];
  return (
    <>
      <span className={styles.catPunch} aria-hidden="true" />
      <div className={styles.catCover}>
        <span className={styles.catBand} aria-hidden="true" />
        <ComicCover comic={comic} />
        <span className={styles.catNo}>{String(index + 1).padStart(2, "0")}</span>
        {locked && <span className={styles.catLockBadge} aria-hidden="true"><Lock size={12} aria-hidden="true" /></span>}
        <span className={styles.catDogEar} aria-hidden="true" />
        <div className={styles.catSlip} aria-hidden="true">
          <p className={styles.catSlipTagline}>{comic.tagline}</p>
          {voice && <p className={styles.catSlipVoice}>&ldquo;{voice.line}&rdquo; <span>{voice.voice}</span></p>}
          <ul className={styles.catSlipTags}>{comic.tags.map((t) => <li key={t}>{t}</li>)}</ul>
          {locked && <p className={styles.catSlipLocked}>Binding in progress</p>}
        </div>
      </div>
      <div className={styles.catBodyText}>
        <p className={styles.catCat}>{categoryLabels[comic.category]}</p>
        <div className={styles.catTitleRow}>
          <h3>{comic.title}</h3>
          <span className={styles.catPriceSm}>{comic.priceLabel}</span>
        </div>
      </div>
    </>
  );
}
