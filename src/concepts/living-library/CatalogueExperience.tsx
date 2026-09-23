// The exact same catalogue as "/comics" on the main branch, search, filters, cart bar and all
import { ComicsHero } from "@/components/comics/ComicsHero";
import { Storefront } from "@/components/comics/Storefront";

export function CatalogueExperience() {
  return (
    <>
      <ComicsHero />
      <Storefront />
    </>
  );
}
