import type { Metadata } from "next";
import { ComicsHero } from "@/components/comics/ComicsHero";
import { Storefront } from "@/components/comics/Storefront";

export const metadata: Metadata = { title: "Comics" };

export default function ComicsPage() {
  return (
    <>
      <ComicsHero />
      <Storefront />
    </>
  );
}
