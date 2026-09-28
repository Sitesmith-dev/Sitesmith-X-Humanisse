import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { claimThisDevice } from "@/lib/auth/session";
import { safeNext } from "@/lib/auth/redirect";

// Where the links in Supabase's emails land: confirming a new account and resetting a password.
// Handles both link styles, token_hash (works in any browser) and code (works in the browser that asked for it)
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;
  const code = params.get("code");
  const next = safeNext(params.get("next"));
  const supabase = await createClient();

  const { error } = tokenHash && type
    ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    : code
      ? await supabase.auth.exchangeCodeForSession(code)
      : { error: new Error("missing token") };

  const url = request.nextUrl.clone();
  url.search = "";
  if (error || !(await claimThisDevice(supabase))) {
    url.pathname = "/login";
    url.searchParams.set("reason", "link");
    return NextResponse.redirect(url);
  }
  url.pathname = next;
  return NextResponse.redirect(url);
}
