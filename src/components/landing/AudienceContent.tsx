import { SiteLink as Link } from "@/components/shared/SiteLink";
import { ArrowRight } from "lucide-react";
import type { Audience } from "@/content/audiences";
import { Reveal } from "@/components/shared/Motion";
import styles from "./Landing.module.css";

export function AudienceContent({ audience }: { audience: Audience }) {
  return (
    <>
      <section className="pagehead">
        <div className="wrap">
          <span className="demo">{audience.kicker}</span>
          <h1 style={{ marginTop: 14 }}>{audience.proposition}</h1>
          <p className="lead">{audience.summary}</p>
          <p className="notice"><span className="demo">Preview</span> This is sample copy for review, final wording comes from Humanisse</p>
        </div>
      </section>
      <section className="band band-paper">
        <div className="wrap">
          <h2 className={styles.audListTitle}>{audience.journeyTitle}</h2>
          <ul className={styles.principles}>
            {audience.interventions.map((item, i) => (
              <li key={item.title}>
                <Reveal delay={(i % 2) * 0.06} className={styles.fill}>
                  <article className={`${styles.principleCard} ${styles[`principle_${i % 3}`]}`}>
                    <span className={styles.audNum}>{String(i + 1).padStart(2, "0")}</span>
                    <h3>{item.title}</h3>
                    <p className={styles.audQuestion}>{item.question}</p>
                    <p>{item.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
          <Link href="/comics" className="btn btn-primary btn-lg" style={{ marginTop: 32 }}>
            See the comics behind this <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
