import styles from "./Catalogue.module.css";

// A short header: the page does one job, getting you to a comic, so there is no hero art between you and the shelf
export function CatalogueHero() {
  return (
    <section className={styles.head} aria-labelledby="comics-h">
      <div className="wrap">
        <h1 id="comics-h" className={styles.h1}>Comics</h1>
        <p className={styles.sub}>Ten stories, ten ideas worth keeping. Pick one, watch its short introduction, then read it in your library.</p>
      </div>
    </section>
  );
}
