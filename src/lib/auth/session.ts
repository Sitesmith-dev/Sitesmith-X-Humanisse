import type { SupabaseClient } from "@supabase/supabase-js";

// Makes this device the account's only signed-in device and signs every other device out.
// The other devices notice on their next page load, in the proxy. Returns false if the claim could not be recorded,
// in which case this login is undone rather than left in a state the proxy would immediately sign out
export async function claimThisDevice(supabase: SupabaseClient) {
  let { error } = await supabase.rpc("claim_session");
  if (error) ({ error } = await supabase.rpc("claim_session"));
  if (error) {
    await supabase.auth.signOut({ scope: "local" });
    return false;
  }
  await supabase.auth.signOut({ scope: "others" });
  return true;
}
