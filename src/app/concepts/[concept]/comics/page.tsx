import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getConcept, getExperiences } from "@/concepts/registry";

export async function generateMetadata({ params }: { params: Promise<{ concept: string }> }): Promise<Metadata> {
  const { concept } = await params;
  const def = getConcept(concept);
  return { title: def ? `Comics (${def.direction})` : "Comics" };
}

export default async function ConceptCataloguePage({ params }: { params: Promise<{ concept: string }> }) {
  const { concept } = await params;
  const def = getConcept(concept);
  if (!def) notFound();
  const { Catalogue } = getExperiences(def.slug);
  return <Catalogue />;
}
