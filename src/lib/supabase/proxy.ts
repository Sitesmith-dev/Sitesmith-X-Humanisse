import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Pages a signed-out visitor is sent to the login page from
const PROTECTED = ["/library"];

// Runs before every page. It keeps the login cookie fresh, enforces one signed-in device per account, and sends
// visitors to the right place: signed-out readers away from their library, signed-in readers away from /login.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Carries any refreshed or cleared cookies over to a redirect, so the browser never keeps a stale login
  const redirectTo = (pathname: string, params: Record<string, string> = {}) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = new URLSearchParams(params).toString();
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    response.headers.forEach((value, key) => { if (key !== "location") redirect.headers.set(key, value); });
    return redirect;
  };

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const path = request.nextUrl.pathname;
  // Only page loads are redirected. Form posts and Server Actions (login, log out) run where they were sent, since
  // redirecting one of those mid-flight makes the browser drop it; they check who is signed in themselves
  const isPageLoad = request.method === "GET" || request.method === "HEAD";

  if (claims) {
    // One device per account: only the most recent login stays valid, every other device is signed out here
    const { data: active, error } = await supabase.from("active_sessions").select("session_id").eq("user_id", claims.sub).maybeSingle();
    // If the lookup itself fails, this one request skips the check. Claiming on an error would let a device that
    // was signed out elsewhere take the account back just because the lookup hiccupped
    if (!error && !active) {
      await supabase.rpc("claim_session");
    } else if (!error && active && active.session_id !== claims.session_id) {
      // "local" signs out only this device. The default would sign out every device, the new one included
      await supabase.auth.signOut({ scope: "local" });
      return isPageLoad ? redirectTo("/login", { reason: "elsewhere" }) : response;
    }
    if (isPageLoad && path === "/login") return redirectTo("/library");
  } else if (isPageLoad && PROTECTED.some((p) => path === p || path.startsWith(`${p}/`))) {
    return redirectTo("/login", { next: path });
  }

  return response;
}
