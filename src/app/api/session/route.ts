import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Tells the site header whether someone is signed in, without making every page render per visitor
export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const body = claims ? { signedIn: true, name: (claims.user_metadata?.full_name as string | undefined) || null } : { signedIn: false, name: null };
  return NextResponse.json(body, { headers: { "Cache-Control": "private, no-store" } });
}
