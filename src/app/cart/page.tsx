import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <>
      <section className="pagehead">
        <div className="wrap">
          <h1>Your cart</h1>
          <p className="lead">Comics you have picked so far, kept on this device until you are ready to read them in your library</p>
          <p className="notice"><span className="demo">Preview</span> Prices are samples and checkout does not take payment</p>
        </div>
      </section>
      <CartView />
    </>
  );
}
