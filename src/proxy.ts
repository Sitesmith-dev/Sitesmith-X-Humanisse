import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Visiting /preview turns on the refreshed home page for this browser: while the cookie is set, the home page ("/")
// shows /preview's content, so logos and "home" links keep you inside the preview. /?preview=off turns it off
const COOKIE = "hm_preview";
const WEEK = 60 * 60 * 24 * 7;

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const response = await updateSession(request);

  if (pathname === "/preview") {
    response.cookies.set(COOKIE, "1", { path: "/", maxAge: WEEK, sameSite: "lax" });
    return response;
  }
  if (pathname === "/" && searchParams.get("preview") === "off") {
    response.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  }
  if (pathname === "/" && request.cookies.get(COOKIE)?.value === "1") {
    const rewrite = NextResponse.rewrite(new URL("/preview", request.url));
    response.cookies.getAll().forEach((c) => rewrite.cookies.set(c));
    response.headers.forEach((value, key) => { if (!key.startsWith("x-middleware")) rewrite.headers.set(key, value); });
    return rewrite;
  }
  return response;
}

export const config = {
  // Every page, but not Next's own files, images or other static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|avif|glb|gltf|mp4|webm)$).*)"],
};
