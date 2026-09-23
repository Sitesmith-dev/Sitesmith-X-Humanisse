import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getConcept } from "@/concepts/registry";
import { ConceptBar } from "@/components/concepts/ConceptBar";

export function generateStaticParams() {
  return [{ concept: "living-library" }, { concept: "vintage-reading-room" }];
}

export async function generateMetadata({ params }: { params: Promise<{ concept: string }> }): Promise<Metadata> {
  const { concept } = await params;
  const def = getConcept(concept);
  return { title: def ? `${def.direction} - ${def.name}` : "Concept" };
}

// Design A (living-library) is the main branch rendered verbatim, so it keeps only the real SiteHeader/SiteFooter
// and gets no extra bar here. Every other direction has no site chrome of its own yet, so it gets this thin
// reviewer strip instead: which direction you're in, and a way back to the gallery without hunting for the URL.
// generateStaticParams() covers both here; whichever direction the client picks continues on its own layout.
export default async function ConceptLayout({ children, params }: { children: React.ReactNode; params: Promise<{ concept: string }> }) {
  const { concept } = await params;
  const def = getConcept(concept);
  if (!def) notFound();
  if (def.slug === "living-library") return children;
  return (
    <div data-concept={def.slug}>
      <ConceptBar concept={def} />
      {children}
    </div>
  );
}
