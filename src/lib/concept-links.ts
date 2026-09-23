// Internal hrefs that exist both on the main site and, at the same path shape, under /concepts/living-library.
// Any other href (another comic's page, cart, login) has no equivalent inside the preview sandbox, so it is
// left exactly as authored and correctly falls through to the real top-level site.
const ROUTABLE = new Set(["/comics", "/comics/negotiation", "/library"]);

export function conceptHref(base: string, href: string): string {
  if (!base) return href;
  if (href === "/") return base;
  if (href.startsWith("/#")) return `${base}${href.slice(1)}`;
  if (ROUTABLE.has(href)) return `${base}${href}`;
  return href;
}
