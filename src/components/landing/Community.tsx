import { SiteLink as Link } from "@/components/shared/SiteLink";
import { ArrowRight } from "lucide-react";
import { community } from "@/content/community";
import { SectionHead } from "@/components/shared/SectionHead";
import { Reveal } from "@/components/shared/Motion";
import styles from "./Landing.module.css";

const steps = community.journey;

export function Community() {
  return (
    <section id="community" className="band band-plum" aria-labelledby="community-h">
      <div className="wrap">
        <SectionHead
          id="community-h"
          title="Learning becomes more powerful when it becomes a conversation"
          lead={community.intro[0]}
          paper
        />
        <Reveal className={styles.communityTag}>
          <p>{community.idea}</p>
        </Reveal>
        <ol className={styles.commSteps}>
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.06} className={styles.fill}>
                <article className={styles.commStep}>
                  <span className={styles.commNum}>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
        <Link href="/community" className="btn" style={{ marginTop: 36 }}>Explore the community <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
