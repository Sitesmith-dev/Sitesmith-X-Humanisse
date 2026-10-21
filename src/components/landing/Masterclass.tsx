import { introVideos } from "@/content/intro-videos";
import { IntroStage } from "@/components/shared/IntroStage";
import styles from "./Home.module.css";

// The one brand introduction. While there is no video the frame holds its place; set `brand` in
// src/content/intro-videos.ts and it plays here
export function Masterclass() {
  return (
    <section id="masterclass" className={`band band-ink ${styles.sec}`} aria-labelledby="class-h">
      <div className={`wrap ${styles.classOne}`}>
        <div className={styles.classText}>
          <h2 id="class-h" className="capBox capBox-paper">Meet Humanisse</h2>
          <p className={styles.headLead}>A short introduction from Prof. Rao on why we teach life skills through stories, and what to expect from every comic</p>
        </div>
        <IntroStage title="Welcome to Humanisse" subtitle="With Prof. Rao" src={introVideos.brand} />
      </div>
    </section>
  );
}
