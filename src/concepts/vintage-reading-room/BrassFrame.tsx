import styles from "./vintage.module.css";

// The same gilt corner brackets first used on the login card, reused wherever a card should
// read as an official document rather than a plain box, so the site's premium cards feel of a piece
export function BrassFrame() {
  return (
    <>
      <span className={`${styles.brassCorner} ${styles.brassCornerTl}`} aria-hidden="true" />
      <span className={`${styles.brassCorner} ${styles.brassCornerTr}`} aria-hidden="true" />
      <span className={`${styles.brassCorner} ${styles.brassCornerBl}`} aria-hidden="true" />
      <span className={`${styles.brassCorner} ${styles.brassCornerBr}`} aria-hidden="true" />
    </>
  );
}
