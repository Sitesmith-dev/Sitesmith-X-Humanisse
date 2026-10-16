import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Tells the site header whether someone is signed in, without making every page render per visitor
export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  // The header greets by first name: the one given at signup, or the first word of an older account's single name
  const meta = (claims?.user_metadata ?? {}) as { first_name?: string; full_name?: string };
  const name = (meta.first_name?.trim() || meta.full_name?.trim().split(/\s+/)[0]) || null;
  const body = claims ? { signedIn: true, name } : { signedIn: false, name: null };
  return NextResponse.json(body, { headers: { "Cache-Control": "private, no-store" } });
}
