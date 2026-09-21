import type { Metadata } from "next";
import { Storefront } from "@/components/comics/Storefront";

export const metadata: Metadata = { title: "Comics" };

export default function ComicsPage() {
  return (
    <>
      <section className="pagehead">
        <div className="wrap">
          <h1>Comics</h1>
          <p className="lead">Ten stories, ten ideas worth keeping, so pick one, watch its short introduction, then read it in your library</p>
          <p className="notice"><span className="demo">Preview</span> Titles, descriptions, covers and prices are samples</p>
        </div>
      </section>
      <Storefront />
    </>
  );
}
