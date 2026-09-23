"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// The reader takes the whole viewport, so the header and footer are not rendered at all on /read routes.
// A nested layout cannot do this, everything under app/ is wrapped by the root layout, so the chrome opts out here instead
export function Chrome({ children }: { children: ReactNode }) {
  return usePathname().startsWith("/read/") ? null : <>{children}</>;
}
