import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// A Supabase client for Server Components, Server Actions and Route Handlers, signed in as whoever's cookies came
// with the request. Create a fresh one per request, never share one across requests.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        // Server Components cannot write cookies. That is fine: the proxy has already refreshed the session
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {}
      },
    },
  });
}
