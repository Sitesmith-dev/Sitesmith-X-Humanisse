"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import styles from "./Comic.module.css";

export function BuyPanel({ title, price }: { title: string; price: string }) {
  const [open, setOpen] = useState(false);
  const [bundle, setBundle] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => { setOpen(false); trigger.current?.focus(); };
  return (
    <div className={styles.buy}>
      <p className={styles.buyPrice}><strong>{price}</strong> <span className="demo">Sample price</span></p>
      <div className={styles.buyRow}>
        <button ref={trigger} type="button" className="btn btn-primary btn-lg" onClick={() => setOpen(true)} aria-haspopup="dialog">Buy Comic</button>
        <button type="button" className="btn btn-lg" aria-pressed={bundle} onClick={() => setBundle(!bundle)}>
          {bundle ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
          {bundle ? "Added to bundle" : "Add to bundle"}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className={styles.panel} role="dialog" aria-modal="false" aria-label="Preview notice"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <h3>Preview only</h3>
            <p>Checkout for {title} will be connected in the production build, no payment is taken and nothing has been purchased</p>
            <button type="button" className="btn" onClick={close} autoFocus>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
