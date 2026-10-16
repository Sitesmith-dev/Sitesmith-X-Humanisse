import { SiteLink as Link } from "@/components/shared/SiteLink";
import { ArrowRight } from "lucide-react";
import { about } from "@/content/about";
import { ideology } from "@/content/ideology";
import { getAudience } from "@/content/audiences";
import { Reveal } from "@/components/shared/Motion";
import { StepChain } from "./StepChain";
import styles from "./Pages.module.css";

const num = (i: number) => String(i + 1).padStart(2, "0");

const products = [
  { title: "Comics", href: "/comics", text: about.whatWeDo.pillars[0].text },
  ...(["for-corporates", "for-campus", "for-individuals"] as const).map((slug) => {
    const a = getAudience(slug)!;
    return { title: `For ${a.label}`, href: `/${slug}`, text: a.proposition };
  }),
];

export function AboutContent() {
  const { whatWeDo, founder } = about;
  return (
    <>
      <section className="pagehead">
        <div className="wrap">
          <h1>About Us</h1>
          <p className="lead">{ideology.closing}</p>
        </div>
      </section>

      <section className="band band-paper">
        <div className="wrap">
          <ul className={styles.pair}>
            {([["Vision", about.vision], ["Mission", about.mission]] as const).map(([label, text], i) => (
              <li key={label}>
                <Reveal delay={i * 0.08} className={styles.fill}>
                  <article className={styles.card}>
                    <h2 className={`${styles.label} ${styles.pairLabel}`}>{label}</h2>
                    <p className={styles.statement}>{text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band band-plum" aria-labelledby="do-h">
        <div className="wrap">
          <div className={styles.head}><h2 id="do-h" className="capBox capBox-paper">What we do</h2></div>
          <p className={`lead ${styles.lead}`}>{whatWeDo.intro}</p>
          <p className={styles.sub}>{whatWeDo.approachLead}</p>
          <StepChain steps={whatWeDo.approach} className={styles.chain} />
          <p className={styles.sub}>{whatWeDo.bringLead}</p>
          <ul className={styles.grid2}>
            {whatWeDo.pillars.map((p, i) => (
              <li key={p.title}>
                <Reveal delay={(i % 2) * 0.06} className={styles.fill}>
                  <article className={`${styles.card} ${styles.cardOnDark}`}>
                    <span className={styles.num}>{num(i)}</span>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className={`capBox ${styles.closingBox}`}>{whatWeDo.closing}</p>
        </div>
      </section>

      <section className="band band-gold" aria-labelledby="founder-h">
        <div className="wrap">
          <div className={styles.head}><h2 id="founder-h" className="capBox capBox-paper">Founder speaks</h2></div>
          <Reveal>
            <figure className={styles.quote}>
              <blockquote><p>&ldquo;{founder.quote}&rdquo;</p></blockquote>
              <figcaption>{founder.attribution}</figcaption>
            </figure>
          </Reveal>
          <p className={`capBox capBox-paper ${styles.founderLine}`}>{founder.line}</p>
        </div>
      </section>

      <section className="band band-ink" aria-labelledby="products-h">
        <div className="wrap">
          <div className={styles.head}><h2 id="products-h" className="capBox">Our products</h2></div>
          <ul className={styles.grid2}>
            {products.map((p, i) => (
              <li key={p.href}>
                <Reveal delay={(i % 2) * 0.06} className={styles.fill}>
                  <Link href={p.href} className={styles.product}>
                    <h3>{p.title} <ArrowRight size={22} aria-hidden="true" /></h3>
                    <p>{p.text}</p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
