"use client";
import NextLink, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent, type Ref } from "react";
import { conceptHref } from "@/lib/concept-links";

type Props = Omit<LinkProps, "href"> & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

// Drop-in replacement for next/link's Link. When rendered inside the /concepts/living-library preview it keeps
// internal navigation (home, comics, the Negotiation comic, library, same-page anchors) inside that preview;
// everywhere else, including the real site, it behaves exactly like a plain Link.
export const SiteLink = forwardRef(function SiteLink({ href, onClick, ...rest }: Props, ref: Ref<HTMLAnchorElement>) {
  const pathname = usePathname();
  const base = pathname?.startsWith("/concepts/living-library") ? "/concepts/living-library" : "";
  const to = conceptHref(base, href);

  // Next's Link does nothing when the URL already ends in this link's #section (click, scroll back up, click
  // again), so in that case scroll to the section ourselves; its scroll-margin and smooth scrolling still apply.
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = new URL(to, window.location.href);
    if (!url.hash || url.hash !== window.location.hash || url.pathname !== window.location.pathname || url.search !== window.location.search) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView();
  }

  return <NextLink ref={ref} href={to} onClick={handleClick} {...rest} />;
});
