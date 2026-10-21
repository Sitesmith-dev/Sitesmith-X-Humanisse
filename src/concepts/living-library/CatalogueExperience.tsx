// The exact same catalogue as "/comics" on the main branch, search, filters, cart bar and all
import { CatalogueHero } from "@/components/comics/CatalogueHero";
import { Storefront } from "@/components/comics/Storefront";

export function CatalogueExperience() {
  return (
    <>
      <CatalogueHero />
      <Storefront />
    </>
  );
}
