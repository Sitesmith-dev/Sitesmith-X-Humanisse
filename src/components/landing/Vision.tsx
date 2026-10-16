import Image from "next/image";
import { SiteLink as Link } from "@/components/shared/SiteLink";
import { ArrowRight } from "lucide-react";
import { about } from "@/content/about";
import styles from "./Landing.module.css";

// A still, no-motion section: the one place on the page that asks to be read rather than watched
const pillars = about.whatWeDo.pillars;

export function Vision() {
  return (
    <section id="vision" className="band band-paper" data-static aria-labelledby="vision-h">
      <div className="wrap">
        <div className={styles.visionGrid}>
          <div>
            <h2 id="vision-h" className="capBox">Why Humanisse exists</h2>
            <p className={styles.visionLead}>{about.vision}</p>
            <ul className={styles.visionList}>
              {pillars.map((p) => (
                <li key={p.title}>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
            <Link href="/about" className="btn" style={{ marginTop: 32 }}>More about us <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <figure className={styles.visionArt}>
            <Image src="/characters/references/professor.png" alt="The Professor, Humanisse's storyteller" fill priority sizes="(max-width: 900px) 100vw, 420px" style={{ objectFit: "cover", objectPosition: "38% 18%" }} />
          </figure>
        </div>
      </div>
    </section>
  );
}
