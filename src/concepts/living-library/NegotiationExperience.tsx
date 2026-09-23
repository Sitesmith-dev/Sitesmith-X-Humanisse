// The exact same standalone comic page as "/comics/negotiation" on the main branch
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getComic } from "@/content/comics";
import { ComicPanel } from "@/components/comics/ComicPanel";

const comic = getComic("negotiation")!;

export function NegotiationExperience() {
  return <ComicPanel comic={comic} topbar={<Link href="/comics" className="btn"><ArrowLeft size={18} aria-hidden="true" /> Back to comics</Link>} />;
}
