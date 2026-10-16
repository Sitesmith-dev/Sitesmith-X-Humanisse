import { community } from "@/content/community";
import { Reveal } from "@/components/shared/Motion";
import styles from "./Pages.module.css";

const num = (i: number) => String(i + 1).padStart(2, "0");

// Describes a community that is still to be built, so there is deliberately no way to join from here
export function CommunityContent() {
  return (
    <>
      <section className="pagehead">
        <div className="wrap">
          <h1>Building the Humanisse Community</h1>
          <p className="lead">{community.title}</p>
        </div>
      </section>

      <section className="band band-paper">
        <div className="wrap">
          <Reveal className={styles.prose}>
            {community.intro.map((p) => <p key={p}>{p}</p>)}
            <p className={styles.sub}>{community.introLead}</p>
            <p className={styles.bubble}>{community.idea}</p>
          </Reveal>
        </div>
      </section>

      <section className="band band-plum" aria-labelledby="cjourney-h">
        <div className="wrap">
          <div className={styles.head}><h2 id="cjourney-h" className="capBox capBox-paper">{community.journeyTitle}</h2></div>
          <ol className={styles.five}>
            {community.journey.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.06} className={styles.fill}>
                  <article className={styles.step}>
                    <span className={styles.num}>{num(i)}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band band-paper" aria-labelledby="who-h">
        <div className="wrap">
          <div className={styles.head}><h2 id="who-h" className="capBox">{community.whoTitle}</h2></div>
          <ul className={styles.grid3}>
            {community.who.map((w, i) => (
              <li key={w.title}>
                <Reveal delay={(i % 3) * 0.06} className={styles.fill}>
                  <article className={styles.card}>
                    <h3>{w.title}</h3>
                    <p>{w.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band band-coral" aria-labelledby="aud-h">
        <div className="wrap">
          <div className={styles.head}><h2 id="aud-h" className="capBox capBox-paper">{community.audienceTitle}</h2></div>
          <Reveal><p className="lead">{community.audience}</p></Reveal>
        </div>
      </section>

      <section className="band band-ink" aria-label="Humanisse">
        <div className="wrap">
          <p className={styles.lines}>
            {community.closingLines.map((l) => <span key={l}>{l}</span>)}
          </p>
          <ul className={styles.tags}>
            {community.closingTags.map((t) => <li key={t} className="pill">{t}</li>)}
          </ul>
        </div>
      </section>
    </>
  );
}
