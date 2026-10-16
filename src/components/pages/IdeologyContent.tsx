import { SiteLink as Link } from "@/components/shared/SiteLink";
import { ArrowRight } from "lucide-react";
import { ideology } from "@/content/ideology";
import { Reveal } from "@/components/shared/Motion";
import { StepChain } from "./StepChain";
import styles from "./Pages.module.css";

const num = (i: number) => String(i + 1).padStart(2, "0");

export function IdeologyContent() {
  return (
    <>
      <section className="pagehead">
        <div className="wrap">
          <h1>The Learning Ideology</h1>
          <p className="lead">{ideology.opening}</p>
        </div>
      </section>

      <section className="band band-paper">
        <div className="wrap">
          <Reveal className={styles.prose}>
            {ideology.intro.map((p) => <p key={p}>{p}</p>)}
          </Reveal>
        </div>
      </section>

      <section className="band band-coral" aria-labelledby="philosophy-h">
        <div className="wrap">
          <div className={styles.head}><h2 id="philosophy-h" className="capBox capBox-paper">{ideology.philosophyTitle}</h2></div>
          <StepChain steps={ideology.philosophy} className={styles.chain} />
        </div>
      </section>

      <section className="band band-paper" aria-labelledby="principles-h">
        <div className="wrap">
          <div className={styles.head}><h2 id="principles-h" className="capBox">How we think about learning</h2></div>
          <ol className={styles.grid2}>
            {ideology.principles.map((p, i) => (
              <li key={p.title}>
                <Reveal delay={(i % 2) * 0.06} className={styles.fill}>
                  <article className={styles.card}>
                    <span className={styles.num}>{num(i)}</span>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band band-plum" aria-labelledby="model-h">
        <div className="wrap">
          <div className={styles.head}><h2 id="model-h" className="capBox capBox-paper">{ideology.modelTitle}</h2></div>
          <ol className={styles.model}>
            {ideology.model.map((m, i) => (
              <li key={m.title}>
                <Reveal delay={i * 0.06} className={styles.fill}>
                  <article className={styles.step}>
                    <span className={styles.num}>{num(i)}</span>
                    <h3>{m.title}</h3>
                    <p>{m.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band band-gold" aria-labelledby="belief-h">
        <div className="wrap">
          <div className={styles.head}><h2 id="belief-h" className="capBox capBox-paper">{ideology.beliefTitle}</h2></div>
          <Reveal><p className={styles.statement}>{ideology.belief}</p></Reveal>
        </div>
      </section>

      <section className="band band-ink" aria-label="Humanisse">
        <div className={`wrap ${styles.centre}`}>
          <span className={`${styles.label} ${styles.labelDark}`}>Humanisse</span>
          <p className={styles.closingText}>{ideology.closing}</p>
          <Link href="/comics" className="btn btn-primary btn-lg">Browse Comics <ArrowRight size={20} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
