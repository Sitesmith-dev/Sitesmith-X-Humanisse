"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type Session = { signedIn: boolean; name: string | null };

// Asks the server whether someone is signed in. Checked again on every page change, since logging in and out
// both move to a new page while the header stays mounted. null until the first answer arrives
export function useSession() {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { signedIn: false, name: null }))
      .then((s: Session) => { if (live) setSession(s); })
      .catch(() => {});
    return () => { live = false; };
  }, [pathname]);
  return session;
}
