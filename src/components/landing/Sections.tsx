import { SiteLink as Link } from "@/components/shared/SiteLink";
import { ArrowRight } from "lucide-react";
import { comics } from "@/content/comics";
import { copy } from "@/content/preview-copy";
import { SectionHead } from "@/components/shared/SectionHead";
import { CastFlipCard } from "./CastFlipCard";
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
  {
    id: "professor", role: "Introduces the idea", name: "The Professor", text: "Presents a situation and connects it to what it means",
    bio: "A warm teacher who opens every story, setting the scene before stepping aside and letting the characters answer the question themselves",
    quote: "Every story has a reason", alt: "The Professor, a warm teacher with grey hair and a colourful sweater, holding a book", pos: "50% 25%", accent: "gold",
  },
  {
    id: "bot", role: "Connects the dots", name: "The Bot", text: "Turns the situation into a clear sequence you can follow",
    bio: "Part companion, part compass, turning a tangled moment into a sequence you can actually follow, one clear step at a time",
    quote: "Let's connect the dots", alt: "The Bot, a friendly floating robot with a white moustache and beard", pos: "50% 45%", accent: "plum",
  },
  {
    id: "cat", role: "Chief Story Critic", name: "The Cat", text: "Asks whether the story truly works, with dry humour",
    bio: "Unimpressed until a story earns it, with a badge to prove the judgement is official and a coffee that is never quite good enough",
    quote: "Honestly, the audacity", alt: "The Cat, an illustrated ginger Persian with golden eyes, Chief Story Critic", pos: "50% 30%", accent: "ink",
  },
] as const;

export function Trio() {
  return (
    <section id="characters" className="band band-coral" aria-labelledby="trio-h">
      <div className="wrap">
        <SectionHead id="trio-h" title="Three ways of looking at every story" lead="Tap a card to turn it over and meet who is behind it" paper />
        <ul className={styles.artCards}>
          {cast.map((c, i) => (
            <li key={c.id}>
              <Reveal delay={i * 0.08} className={styles.fill}>
                <CastFlipCard {...c} />
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
