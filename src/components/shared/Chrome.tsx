"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// The main site header and footer step aside on routes that build their own chrome: the reader (full viewport,
// no distractions), the concept picker gallery (belongs to no direction) and Direction B (its own bar and no
// footer yet). A nested layout cannot do this, everything under app/ is wrapped by the root layout, so it opts
// out here instead. Direction A keeps this chrome, since it is the main site rendered verbatim.
export function Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/read/") || pathname === "/concepts" || pathname?.startsWith("/concepts/vintage-reading-room");
  return bare ? null : <>{children}</>;
}
