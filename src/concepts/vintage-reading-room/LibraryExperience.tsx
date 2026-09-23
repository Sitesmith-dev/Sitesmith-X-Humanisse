import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookMarked, BookOpen, CheckCircle2, Hourglass } from "lucide-react";
import { comics } from "@/content/comics";
import { BrassFrame } from "./BrassFrame";
import { clothFor, personality } from "./comic-personality";
import { Ornament } from "./Ornament";
import { Reveal } from "./Reveal";
import { VintageRoot } from "./VintageRoot";
import { base } from "./definition";
import styles from "./vintage.module.css";

const demoOwned = [
  { slug: "negotiation", progress: 60 },
  { slug: "ethics", progress: 100 },
  { slug: "resilience", progress: 15 },
];

export function LibraryExperience({ searchParams }: { searchParams?: { state?: string } }) {
  const isEmptyDemo = searchParams?.state === "empty";
  const owned = isEmptyDemo ? [] : demoOwned;
  const finished = owned.filter((o) => o.progress === 100).length;
  const inProgress = owned.filter((o) => o.progress > 0 && o.progress < 100).length;

  return (
    <VintageRoot className={styles.root}>
      <section className={`${styles.pageHead} ${styles.vaultHead}`}>
        <div className="wrap">
          <div className={styles.vaultHeadRow}>
            <div>
              <p className={styles.kicker}>Preview Data</p>
              <h1 className={styles.h1small}>My Library</h1>
              <Ornament className={styles.heroOrnament} />
              <p className={styles.lead}>A small reading log, every comic you own kept in one place</p>
              <Link href={isEmptyDemo ? `${base}/library` : `${base}/library?state=empty`} className={styles.demoToggle}>
                {isEmptyDemo ? "See a populated shelf" : "See an empty shelf"}
              </Link>
            </div>
            <BookMarked size={96} strokeWidth={1} className={styles.vaultWatermark} aria-hidden="true" />
          </div>
        </div>
      </section>

      {owned.length > 0 && (
        <section className={styles.statSection}>
          <div className="wrap">
            <ul className={styles.statGrid}>
              <Reveal as="li" className={styles.statTile}>
                <BrassFrame />
                <BookOpen size={26} className={styles.statIcon} aria-hidden="true" />
                <span className={styles.statNum}>{owned.length}</span>
                <span className={styles.statLabel}>Comics Owned</span>
              </Reveal>
              <Reveal as="li" delay={0.06} className={styles.statTile}>
                <BrassFrame />
                <CheckCircle2 size={26} className={styles.statIcon} aria-hidden="true" />
                <span className={styles.statNum}>{finished}</span>
                <span className={styles.statLabel}>Finished</span>
              </Reveal>
              <Reveal as="li" delay={0.12} className={styles.statTile}>
                <BrassFrame />
                <Hourglass size={26} className={styles.statIcon} aria-hidden="true" />
                <span className={styles.statNum}>{inProgress}</span>
                <span className={styles.statLabel}>In Progress</span>
              </Reveal>
            </ul>
          </div>
        </section>
      )}

      <section className={styles.catBody}>
        <div className="wrap">
          {owned.length === 0 ? (
            <Reveal className={styles.emptyList}>
              <BookOpen size={40} aria-hidden="true" />
              <h2 className={styles.h2}>Your library is empty</h2>
              <p className={styles.lead}>Add a comic to your library and it will show up here, ready whenever you want to keep reading</p>
              <Link href={`${base}/comics`} className={styles.btnPrimary}>Browse Comics <ArrowRight size={18} aria-hidden="true" /></Link>
            </Reveal>
          ) : (
            <ul className={styles.ledgerList}>
              {owned.map((o, i) => {
                const c = comics.find((x) => x.slug === o.slug)!;
                return (
                  <Reveal as="li" key={o.slug} delay={i * 0.06} className={styles.ledgerRow}>
                    <div className={styles.ledgerCover} style={{ borderLeftColor: clothFor(c.slug), background: c.coverImage ? undefined : clothFor(c.slug) }}>
                      {c.coverImage ? <Image src={c.coverImage} alt="" fill sizes="72px" style={{ objectFit: "cover" }} /> : <span>{c.title[0]}</span>}
                    </div>
                    <div className={styles.ledgerInfo}>
                      <h3>{c.title}</h3>
                      <ul className={styles.ledgerTags}>{c.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                      {personality[c.slug] && <p className={styles.ledgerVoice}>&ldquo;{personality[c.slug].line}&rdquo;</p>}
                      <div className={styles.ledgerProgress}>
                        <div className={styles.ledgerRibbon}><span style={{ width: `${o.progress}%` }} /></div>
                        <span className={styles.ledgerPct}>{o.progress}%</span>
                      </div>
                    </div>
                    <div className={styles.ledgerAction}>
                      {o.slug === "negotiation" ? (
                        <Link href={`${base}/comics/negotiation`} className={styles.ledgerCta}>
                          {o.progress === 100 ? "Read again" : "Continue reading"} <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      ) : (
                        <span className={styles.ledgerCtaDisabled} aria-disabled="true">Preview only</span>
                      )}
                    </div>
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
