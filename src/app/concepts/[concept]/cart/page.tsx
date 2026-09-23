import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getConcept, getExperiences } from "@/concepts/registry";

export async function generateMetadata({ params }: { params: Promise<{ concept: string }> }): Promise<Metadata> {
  const { concept } = await params;
  const def = getConcept(concept);
  return { title: def ? `Cart (${def.direction})` : "Cart" };
}

export default async function ConceptCartPage({ params }: { params: Promise<{ concept: string }> }) {
  const { concept } = await params;
  const def = getConcept(concept);
  if (!def) notFound();
  const { Cart } = getExperiences(def.slug);
  if (!Cart) notFound();
  return <Cart />;
}
