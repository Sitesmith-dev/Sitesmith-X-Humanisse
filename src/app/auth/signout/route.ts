import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Log out is a plain form post to here rather than a Server Action: a full page load can't be cut short by a
// client-side navigation happening at the same moment, and it resets everything on the page that knew who was signed in
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  // "local" signs out only this device
  await supabase.auth.signOut({ scope: "local" });
  // 303 turns the POST into a GET of the home page
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
