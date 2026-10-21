import { Plus } from "lucide-react";
import styles from "./Home.module.css";

const faq = [
  { q: "How do I read a comic?", a: "In your browser, with page turning, zoom and full screen. There is nothing to download." },
  { q: "Do I need an account to browse?", a: "No. Look through every comic freely, an account is only needed to buy and to read." },
  { q: "Where do my comics live after I buy them?", a: "In My Library, your own shelf, where you can continue reading or reread any story." },
] as const;

// Native <details>, so the answers open with no script at all
export function Questions() {
  return (
    <section id="faq" className={`band band-paper ${styles.sec}`} aria-labelledby="faq-h">
      <div className={`wrap ${styles.qWrap}`}>
        <h2 id="faq-h" className="capBox">Quick answers</h2>
        <div className={styles.faq}>
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}<Plus size={20} aria-hidden="true" /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
