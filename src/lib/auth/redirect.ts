// Only ever send people to a page on this site after logging in, never to an address smuggled in through the URL
export function safeNext(next: unknown, fallback = "/library") {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}
