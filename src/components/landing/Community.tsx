import { SectionHead } from "@/components/shared/SectionHead";
import { Reveal } from "@/components/shared/Motion";
import styles from "./Landing.module.css";

const steps = [
  { title: "Read", text: "Explore stories around real human situations, negotiation, resilience, empathy, decision making and difficult conversations" },
  { title: "Question", text: "Every story leaves you with something to think about, challenge the assumption and look at it from another angle" },
  { title: "Discuss", text: "Share your interpretation, your experience and the alternative approach you would have taken instead" },
  { title: "Apply", text: "The real value begins when an idea moves off the page, try it the next time the same situation finds you" },
] as const;

export function Community() {
  return (
    <section id="community" className="band band-plum" aria-labelledby="community-h">
      <div className="wrap">
        <SectionHead
          id="community-h"
          title="Learning becomes more powerful when it becomes a conversation"
          lead="Humanisse is not meant to be just a collection of comics, it is a community of curious people who believe learning should continue beyond classrooms and training rooms"
          paper
        />
        <Reveal className={styles.communityTag}>
          <p>Read something. Think about it. Talk about it. Try it. Share what you discovered.</p>
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
      </div>
    </section>
  );
}
