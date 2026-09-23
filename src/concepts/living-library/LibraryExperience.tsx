// The exact same My Library page as "/library" on the main branch, including its populated/empty toggle
import Link from "next/link";
import { LibraryView } from "@/components/library/LibraryView";
import { EmptyLibrary } from "@/components/library/EmptyLibrary";
import type { LibraryItem } from "@/types/library";

const demoItems: LibraryItem[] = [
  { slug: "negotiation", progress: 60 },
  { slug: "ethics", progress: 100 },
  { slug: "resilience", progress: 15 },
  { slug: "leadership", progress: 35 },
];

export function LibraryExperience({ searchParams }: { searchParams?: { state?: string } }) {
  const empty = searchParams?.state === "empty";
  return (
    <>
      {empty ? <EmptyLibrary /> : <LibraryView items={demoItems} />}
      <p className="wrap" style={{ margin: "32px auto" }}>
        <Link href={empty ? "/library" : "/library?state=empty"} className="btn">
          {empty ? "See populated library" : "See empty library"}
        </Link>
      </p>
    </>
  );
}
