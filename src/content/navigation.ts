// The site's page links, read by both the header and the footer. My Library, Cart and the account control are
// account actions, not pages, and stay out of this list
export type NavItem = { label: string; href: string };
export type NavGroup = { label: string; items: NavItem[] };
export type PrimaryNav = (NavItem | NavGroup)[];

export const primaryNav: PrimaryNav = [
  { label: "About Us", href: "/about" },
  { label: "Comics", href: "/comics" },
  { label: "Learning Ideology", href: "/learning-ideology" },
  {
    label: "Who It's For",
    items: [
      { label: "For Corporates", href: "/for-corporates" },
      { label: "For Campus", href: "/for-campus" },
      { label: "For Individuals", href: "/for-individuals" },
    ],
  },
  { label: "Community", href: "/community" },
];

export const isGroup = (item: NavItem | NavGroup): item is NavGroup => "items" in item;

// A link is current on its own page and on anything below it, so /comics/negotiation keeps Comics marked
export const isActive = (pathname: string | null, href: string) => !!pathname && (pathname === href || pathname.startsWith(href + "/"));
