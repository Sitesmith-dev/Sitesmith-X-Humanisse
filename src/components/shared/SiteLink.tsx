"use client";
import NextLink, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, type AnchorHTMLAttributes, type Ref } from "react";
import { conceptHref } from "@/lib/concept-links";

type Props = Omit<LinkProps, "href"> & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

// Drop-in replacement for next/link's Link. When rendered inside the /concepts/living-library preview it keeps
// internal navigation (home, comics, the Negotiation comic, library, same-page anchors) inside that preview;
// everywhere else, including the real site, it behaves exactly like a plain Link.
export const SiteLink = forwardRef(function SiteLink({ href, ...rest }: Props, ref: Ref<HTMLAnchorElement>) {
  const pathname = usePathname();
  const base = pathname?.startsWith("/concepts/living-library") ? "/concepts/living-library" : "";
  return <NextLink ref={ref} href={conceptHref(base, href)} {...rest} />;
});
