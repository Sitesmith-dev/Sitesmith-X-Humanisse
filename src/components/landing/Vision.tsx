import Image from "next/image";
import styles from "./Landing.module.css";

// A still, no-motion section: the one place on the page that asks to be read rather than watched
const pillars = [
  { title: "Story first", text: "Every lesson starts as a situation you can picture, not a slide you forget" },
  { title: "Real human skills", text: "Ethics, negotiation, resilience and emotional intelligence, the things no textbook quite teaches" },
  { title: "Made to return to", text: "Short enough to read in one sitting, built to reread when the moment actually arrives" },
] as const;

export function Vision() {
  return (
    <section id="vision" className="band band-paper" data-static aria-labelledby="vision-h">
      <div className="wrap">
        <div className={styles.visionGrid}>
          <div>
            <h2 id="vision-h" className="capBox">Why Humanisse exists</h2>
            <p className={styles.visionLead}>
              Humanisse teaches life skills through original comics starring the Professor, the Bot and the Cat,
              because an idea told as a story is one people actually carry with them
            </p>
            <ul className={styles.visionList}>
              {pillars.map((p) => (
                <li key={p.title}>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <figure className={styles.visionArt}>
            <Image src="/characters/references/professor.png" alt="The Professor, Humanisse's storyteller" fill priority sizes="(max-width: 900px) 100vw, 420px" style={{ objectFit: "cover", objectPosition: "38% 18%" }} />
          </figure>
        </div>
      </div>
    </section>
  );
}
