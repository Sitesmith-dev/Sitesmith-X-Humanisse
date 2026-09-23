import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { comics } from "@/content/comics";
import { copy } from "@/content/preview-copy";
import { Bookshelf } from "./Bookshelf";
import { CastCard } from "./CastCard";
import { DrawerTile } from "./DrawerTile";
import { Ornament } from "./Ornament";
import { WatchSection } from "./WatchSection";
import { Parallax } from "./Parallax";
import { Reveal } from "./Reveal";
import { VintageRoot } from "./VintageRoot";
import { VintageSectionHead } from "./VintageSectionHead";
import { base } from "./definition";
import styles from "./vintage.module.css";

const gallery = [
  {
    id: "professor", name: "The Professor", role: "Narrator", pos: "35% 18%",
    bio: "A warm teacher who opens every story, the Professor sets the scene and asks the question each comic is really about, before stepping aside and letting the characters answer it themselves",
    quote: "Every story has a purpose",
  },
  {
    id: "bot", name: "The Bot", role: "Guide", pos: "50% 15%",
    bio: "Part companion, part compass, the Bot turns a tangled situation into a clear sequence you can follow, pointing out the moment a choice was made and what it led to",
    quote: "Listen, then connect the dots",
  },
  {
    id: "cat", name: "The Cat", role: "Chief Story Critic", pos: "50% 15%",
    bio: "Unimpressed until proven otherwise, the Cat asks the question every reader is quietly asking too, whether the story actually earns its ending, with a badge to prove the title is official",
    quote: "Honestly, the audacity",
  },
] as const;

export function LandingExperience() {
  return (
    <VintageRoot className={styles.root}>
      <section className={styles.hero}>
        <Parallax speed={0.35} className={styles.heroBg} aria-hidden="true">
          <Image src="/characters/references/professor.png" alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "62% 22%" }} />
          <span className={styles.duotone} />
        </Parallax>
        <div className={styles.heroScrim} aria-hidden="true" />
        <div className={styles.heroVignette} aria-hidden="true" />
        <div className="wrap">
          <div className={styles.heroInner}>
          <Reveal className={styles.heroCopy}>
            <p className={styles.kickerLight}>Humanisse Press</p>
            <h1 className={styles.h1}>{copy.headline}</h1>
            <Ornament className={styles.heroOrnamentLight} />
            <p className={styles.leadLight}>{copy.support}</p>
            <div className={styles.actions}>
              <Link href={`${base}/comics`} className={styles.btnPrimary}>Open the Collection <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link href={`${base}/comics/negotiation`} className={styles.btnGhostLight}><BookOpen size={16} aria-hidden="true" /> Read a Sample Chapter</Link>
            </div>
          </Reveal>
          </div>
        </div>
        <p className={styles.heroCredit}>Fig I, The Professor, keeper of every Humanisse story</p>
      </section>

      <section className={styles.toc} aria-labelledby="toc-h">
        <div className="wrap">
          <VintageSectionHead id="toc-h" kicker="The Card Catalogue" title="Ideas worth keeping" lead="Pull a drawer to read what is inside, the way you would in the reading room" />
          <ul className={styles.drawerGrid}>
            {copy.themes.map((t, i) => (
              <li key={t.slug}>
                <Reveal delay={i * 0.06} className={styles.fill}>
                  <DrawerTile index={i} title={t.title} text={t.text} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.plates} aria-labelledby="how-h">
        <div className="wrap">
          <VintageSectionHead id="how-h" kicker="A Reader's Guide" title="How a story reaches you" light />
          <ol className={styles.guideRow}>
            {copy.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08} className={styles.guideItem}>
                <span className={styles.guideNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.shelfSection} aria-labelledby="shelf-h">
        <div className="wrap">
          <VintageSectionHead id="shelf-h" kicker="From the Shelf" title="Popular comics" />
        </div>
        <div className="wrap">
          <Bookshelf comics={comics.slice(0, 8)} label="Popular comics" />
        </div>
      </section>

      <section className={styles.galleryBand} aria-labelledby="gallery-h">
        <div className={`wrap ${styles.galleryWrap}`}>
          <VintageSectionHead id="gallery-h" kicker="A Small Portrait Gallery" title="Three ways of looking at every story" lead="Tap a plate to turn it over and read the card behind it" light />
          <ul className={styles.gallery}>
            {gallery.map((g, i) => (
              <Reveal as="li" key={g.id} delay={i * 0.1} className={styles.fill}>
                <CastCard {...g} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <WatchSection />

      <section className={styles.faq} aria-labelledby="faq-h">
        <div className="wrap">
          <VintageSectionHead id="faq-h" kicker="Before You Begin" title="FAQs" />
          <dl className={styles.faqList}>
            {copy.faq.map((f, i) => (
              <Reveal as="li" key={f.q} delay={i * 0.04} className={styles.faqRow}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className={styles.final}>
        <Parallax speed={0.18} className={styles.finalLeaf} aria-hidden="true"><span /></Parallax>
        <div className={`wrap ${styles.finalRow}`}>
          <Reveal>
            <h2 className={styles.h2}>Ready to learn through a story</h2>
            <p className={styles.finalText}>This is a design preview, comics, prices and checkout here are demonstration only</p>
          </Reveal>
          <Reveal delay={0.1} className={styles.finalAction}>
            <span className={styles.seal}>Begin Reading</span>
            <Link href={`${base}/comics`} className={styles.btnPrimary}>Open the Collection <ArrowRight size={18} aria-hidden="true" /></Link>
          </Reveal>
        </div>
      </section>
    </VintageRoot>
  );
}
