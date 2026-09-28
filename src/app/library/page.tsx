import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LibraryView } from "@/components/library/LibraryView";
import { EmptyLibrary } from "@/components/library/EmptyLibrary";
import { getComic } from "@/content/comics";
import { createClient } from "@/lib/supabase/server";
import type { LibraryItem } from "@/types/library";

export const metadata: Metadata = { title: "My Library" };

export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth) redirect("/login?next=/library");

  // Security rules in the database return only this reader's own purchases
  const { data } = await supabase.from("purchases").select("comic_slug, progress").order("purchased_at", { ascending: false });
  // Skip any row for a comic that is no longer in the catalogue
  const items: LibraryItem[] = (data ?? []).filter((row) => getComic(row.comic_slug)).map((row) => ({ slug: row.comic_slug, progress: row.progress }));

  return items.length ? <LibraryView items={items} /> : <EmptyLibrary />;
}
