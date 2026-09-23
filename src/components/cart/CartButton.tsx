"use client";
import { SiteLink as Link } from "@/components/shared/SiteLink";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";
import styles from "@/components/shared/Shared.module.css";

// Header cart link: the count badge springs in only once something is in the cart,
// and the accessible name always carries the count even when the label collapses to the icon
export function CartButton() {
  const { count } = useCart();
  const name = count === 0 ? "Cart, empty" : `Cart, ${count} ${count === 1 ? "comic" : "comics"}`;
  return (
    <Link href="/cart" className={`${styles.link} ${styles.cart}`} aria-label={name}>
      <span className={styles.cartIcon}>
        <ShoppingCart size={20} aria-hidden="true" />
        <AnimatePresence>
          {count > 0 && (
            <motion.span key="badge" className={styles.badge} aria-hidden="true"
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}>
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className={styles.hideSm}>Cart</span>
    </Link>
  );
}
