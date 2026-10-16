import { SiteLink as Link } from "@/components/shared/SiteLink";
import { ArrowRight } from "lucide-react";
import type { Audience } from "@/content/audiences";
import { Reveal } from "@/components/shared/Motion";
import styles from "./Landing.module.css";

const num = (i: number) => String(i + 1).padStart(2, "0");

export function AudienceContent({ audience }: { audience: Audience }) {
  const [lead, ...rest] = audience.intro;
  const { journey } = audience;
  // Months sit three across, the individual journey's four steps four across
  const numbered = journey.steps.every((s) => !s.label);
  return (
    <>
      <section className="pagehead">
        <div className="wrap">
          <span className="demo">{audience.kicker}</span>
          <h1 style={{ marginTop: 14 }}>{audience.proposition}</h1>
          <p className="lead">{lead}</p>
          {rest.map((p) => <p key={p} className={styles.audIntro}>{p}</p>)}
        </div>
      </section>

      <section className="band band-paper">
        <div className="wrap">
          <h2 className={styles.audListTitle}>{audience.interventionsTitle}</h2>
          <ul className={styles.principles}>
            {audience.interventions.map((item, i) => (
              <li key={item.title}>
                <Reveal delay={(i % 2) * 0.06} className={styles.fill}>
                  <article className={`${styles.principleCard} ${styles[`principle_${i % 3}`]}`}>
                    <span className={styles.audNum}>{num(i)}</span>
                    <h3>{item.title}</h3>
                    <p className={styles.audQuestion}>{item.question}</p>
                    <p>{item.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band band-ink" aria-labelledby="journey-h">
        <div className="wrap">
          <h2 id="journey-h" className={`${styles.audListTitle} ${styles.progTitle}`}>{journey.title}</h2>
          <ol className={`${styles.prog} ${numbered ? styles.prog4 : ""}`}>
            {journey.steps.map((step, i) => (
              <li key={step.title}>
                <Reveal delay={i * 0.06} className={styles.fill}>
                  <article className={styles.progCard}>
                    {step.label ? <span className={styles.progLabel}>{step.label}</span> : <span className={styles.audNum}>{num(i)}</span>}
                    <h3 className={styles.progStep}>{step.title}</h3>
                    {step.topics && (
                      <ul className={styles.progTopics}>
                        {step.topics.map((t) => <li key={t} className="pill">{t}</li>)}
                      </ul>
                    )}
                    {step.text && <p>{step.text}</p>}
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
          {journey.note && <p className={`lead ${styles.progNote}`}>{journey.note}</p>}
        </div>
      </section>

      <section className={`band band-gold ${styles.final}`} aria-label="Humanisse">
        <div className={`wrap ${styles.finalRow}`}>
          <Reveal>
            <span className={styles.closingLabel}>Humanisse</span>
            <p className={styles.closingLines}>
              {audience.closing.map((line) => <span key={line}>{line}</span>)}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/comics" className="btn btn-lg" style={{ background: "var(--ink)", color: "var(--paper)" }}>
              See the comics behind this <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
