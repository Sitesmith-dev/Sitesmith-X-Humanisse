import type { Metadata } from "next";
import { CatalogueHero } from "@/components/comics/CatalogueHero";
import { Storefront } from "@/components/comics/Storefront";

export const metadata: Metadata = { title: "Comics" };

export default function ComicsPage() {
  return (
    <>
      <CatalogueHero />
      <Storefront />
    </>
  );
}
