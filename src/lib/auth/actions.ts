"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "./redirect";
import { claimThisDevice } from "./session";

export type AuthMode = "login" | "signup" | "forgot";
export type AuthState = { mode: AuthMode; kind: "error" | "success"; message: string } | null;

const MIN_PASSWORD = 8;

// Supabase's own error wording is written for developers, so readers see these instead
function friendly(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "That email and password don't match. Check them and try again";
  if (m.includes("email not confirmed")) return "Please confirm your email first. We sent you a link when you created your account";
  if (m.includes("rate limit") || m.includes("too many")) return "Too many attempts. Please wait a few minutes and try again";
  if (m.includes("password")) return message;
  return "Something went wrong. Please try again";
}

async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

// The login page's single form. Which of the three things it does depends on the tab the reader is on
export async function authenticate(_prev: AuthState, form: FormData): Promise<AuthState> {
  const mode = String(form.get("mode")) as AuthMode;
  // Email today. Adding phone later means accepting a phone number here and passing { phone } instead of { email }
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const fail = (message: string): AuthState => ({ mode, kind: "error", message });

  if (!email || !email.includes("@")) return fail("Please enter your email address");
  const supabase = await createClient();

  if (mode === "forgot") {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${await siteOrigin()}/auth/confirm?next=/login/reset` });
    if (error) return fail(friendly(error.message));
    return { mode, kind: "success", message: "If there is an account for that email, a link to reset your password is on its way" };
  }

  if (password.length < MIN_PASSWORD) return fail(`Your password needs at least ${MIN_PASSWORD} characters`);

  if (mode === "signup") {
    const name = String(form.get("name") ?? "").trim();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name }, emailRedirectTo: `${await siteOrigin()}/auth/confirm?next=/library` },
    });
    if (error) return fail(friendly(error.message));
    // With "Confirm email" switched off in Supabase the account is signed in straight away
    if (data.session) {
      if (!(await claimThisDevice(supabase))) return fail("Something went wrong. Please try logging in again");
      redirect("/library");
    }
    return { mode, kind: "success", message: `Almost there. We sent a link to ${email}, open it to confirm your account` };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return fail(friendly(error.message));
  if (!(await claimThisDevice(supabase))) return fail("Something went wrong. Please try again");
  redirect(safeNext(form.get("next")));
}

export type ResetState = { kind: "error"; message: string } | null;

// Sets a new password. The reader arrives here signed in, from the link in their reset email
export async function updatePassword(_prev: ResetState, form: FormData): Promise<ResetState> {
  const password = String(form.get("password") ?? "");
  if (password.length < MIN_PASSWORD) return { kind: "error", message: `Your password needs at least ${MIN_PASSWORD} characters` };
  if (password !== String(form.get("confirm") ?? "")) return { kind: "error", message: "The two passwords don't match" };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.message.toLowerCase().includes("session")) return { kind: "error", message: "This reset link has expired. Please ask for a new one from the login page" };
    if (error.message.toLowerCase().includes("different from the old")) return { kind: "error", message: "Please choose a password you haven't used before" };
    return { kind: "error", message: friendly(error.message) };
  }
  redirect("/library");
}
