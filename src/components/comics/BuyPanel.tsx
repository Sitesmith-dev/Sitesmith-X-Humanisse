"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import styles from "./Comic.module.css";

// Amazon-style pair: Buy now goes straight to the cart, Add to cart stays here and the button becomes a link once it is in
export function BuyPanel({ slug, title, price }: { slug: string; title: string; price: string }) {
  const router = useRouter();
  const { add, has } = useCart();
  const inCart = has(slug);
  const [announce, setAnnounce] = useState("");
  const view = useRef<HTMLAnchorElement>(null);

  const buyNow = () => { add(slug); router.push("/cart"); };
  const addToCart = () => {
    add(slug);
    setAnnounce(`${title} added to your cart`);
    // The button is replaced by the link, so keyboard focus follows it rather than dropping to the page
    requestAnimationFrame(() => view.current?.focus());
  };

  return (
    <div className={styles.buy}>
      <p className={styles.buyPrice}><strong>{price}</strong> <span className="demo">Sample price</span></p>
      <div className={styles.buyRow}>
        <button type="button" className="btn btn-primary btn-lg" onClick={buyNow}><ShoppingBag size={18} aria-hidden="true" /> Buy now</button>
        {inCart ? (
          <Link ref={view} href="/cart" className="btn btn-lg"><Check size={18} aria-hidden="true" /> In cart, view it</Link>
        ) : (
          <button type="button" className="btn btn-lg" onClick={addToCart}><Plus size={18} aria-hidden="true" /> Add to cart</button>
        )}
      </div>
      <p className={`notice ${styles.buyNote}`}><span className="demo">Preview</span> No payment is taken and nothing has been purchased</p>
      <p className="sr-only" aria-live="polite">{announce}</p>
    </div>
  );
}
