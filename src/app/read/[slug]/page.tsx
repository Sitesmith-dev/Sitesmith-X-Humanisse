import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getComic } from "@/content/comics";
import { createClient } from "@/lib/supabase/server";
import { cleanForStamp } from "@/lib/auth/names";
import { Reader } from "@/components/reader/Reader";
import type { Holder } from "@/components/reader/stamp";
import styles from "@/components/reader/Reader.module.css";

// Every page carries the reader's own name and email, so this is rendered per request and never prerendered or
// shared between readers. Dynamic responses go out as Cache-Control: private, no-store
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/read/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const comic = getComic(slug);
  return { title: comic ? `Reading ${comic.title}` : "Reader" };
}

// Who the pages are stamped for. The email comes from the verified login token. The name comes from public.profiles,
// which the account holder cannot edit, falling back to the signup metadata until that table exists
async function getHolder(slug: string): Promise<Holder> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const email = cleanForStamp(String(claims?.email ?? ""));
  // The proxy already sends signed-out visitors away. This is the second lock: no identity, no pages
  if (!claims || !email) redirect(`/login?next=${encodeURIComponent(`/read/${slug}`)}`);
  const { data: profile } = await supabase.from("profiles").select("first_name,last_name").eq("id", claims.sub).maybeSingle();
  const fromProfile = cleanForStamp(`${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`);
  const fromSignup = cleanForStamp(String(claims.user_metadata?.full_name ?? ""));
  return { name: fromProfile || fromSignup, email };
}

export default async function ReadPage({ params }: PageProps<"/read/[slug]">) {
  const { slug } = await params;
  const comic = getComic(slug);
  if (!comic) notFound();
  const holder = await getHolder(slug);
  // A comic can exist without artwork. Reaching its reader URL directly is a dead end rather than an error, so say so and point back
  if (comic.pages.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyCard}>
          <h1>{comic.title} is not available to read yet</h1>
          <p>The pages for this comic have not been added. Everything else about it is on the comic page.</p>
          <Link href={`/comics/${comic.slug}`} className="btn btn-primary btn-lg"><ArrowLeft size={18} aria-hidden="true" /> Back to {comic.title}</Link>
        </div>
      </div>
    );
  }
  return <Reader comic={comic} holder={holder} />;
}
