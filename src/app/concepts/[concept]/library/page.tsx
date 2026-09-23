import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getConcept, getExperiences } from "@/concepts/registry";

export async function generateMetadata({ params }: { params: Promise<{ concept: string }> }): Promise<Metadata> {
  const { concept } = await params;
  const def = getConcept(concept);
  return { title: def ? `My Library (${def.direction})` : "My Library" };
}

export default async function ConceptLibraryPage({ params, searchParams }: { params: Promise<{ concept: string }>; searchParams: Promise<{ state?: string }> }) {
  const { concept } = await params;
  const def = getConcept(concept);
  if (!def) notFound();
  const { Library } = getExperiences(def.slug);
  return <Library searchParams={await searchParams} />;
}
