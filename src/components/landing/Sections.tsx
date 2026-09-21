import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { comics } from "@/content/comics";
import { copy } from "@/content/preview-copy";
import { SectionHead } from "@/components/shared/SectionHead";
import { PopularShelf } from "./PopularShelf";
import { Reveal } from "@/components/shared/Motion";
import styles from "./Landing.module.css";

export function FeaturedComics() {
  return (
    <section className={`band band-plum ${styles.featured}`} aria-labelledby="feat-h">
      <PopularShelf comics={comics.slice(0, 6)} />
    </section>
  );
}

const cast = [
  { id: "professor", role: "Introduces the idea", name: "The Professor", text: "Presents a situation and connects it to what it means", alt: "The Professor, a warm teacher with grey hair and a colourful sweater, holding a book", pos: "50% 25%" },
  { id: "bot", role: "Connects the dots", name: "The Bot", text: "Turns the situation into a clear sequence you can follow", alt: "The Bot, a friendly floating robot with a white moustache and beard", pos: "50% 45%" },
  { id: "cat", role: "Chief Story Critic", name: "The Cat", text: "Asks whether the story truly works, with dry humour", alt: "The Cat, a black cat with golden eyes wearing a Chief Story Critic badge", pos: "50% 35%" },
] as const;

export function Trio() {
  return (
    <section id="characters" className="band band-coral" aria-labelledby="trio-h">
      <div className="wrap">
        <SectionHead id="trio-h" title="Three ways of looking at every story" lead="The Professor sets the scene, the Bot connects the dots and the Cat tests whether it works" paper />
        <ul className={styles.artCards}>
          {cast.map((c, i) => (
            <li key={c.id}>
              <Reveal delay={i * 0.08} className={styles.fill}>
                <article className={styles.artCard}>
                  <div className={styles.artImg}>
                    <Image src={`/characters/references/${c.id}.png`} alt={c.alt} fill sizes="(max-width: 900px) 100vw, 380px" style={{ objectFit: "cover", objectPosition: c.pos }} />
                  </div>
                  <div className={styles.artBody}>
                    <span className={styles.artRole}>{c.role}</span>
                    <h3>{c.name}</h3>
                    <p>{c.text}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className={`band band-gold ${styles.final}`}>
      <div className={`wrap ${styles.finalRow}`}>
        <Reveal>
          <h2 className="capBox capBox-paper">Ready to learn through a story</h2>
          <p className={styles.finalText}>Pick a comic and see how it reads, this is a design preview so nothing here is a real purchase</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className={styles.finalAction}>
            <span className={styles.finalBurst} aria-hidden="true"><span>Start here</span></span>
            <Link href="/comics" className="btn btn-lg" style={{ background: "var(--ink)", color: "var(--paper)" }}>{copy.primaryCta} <ArrowRight size={20} aria-hidden="true" /></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
