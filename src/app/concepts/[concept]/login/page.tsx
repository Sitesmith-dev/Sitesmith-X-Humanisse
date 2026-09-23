import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getConcept, getExperiences } from "@/concepts/registry";

export async function generateMetadata({ params }: { params: Promise<{ concept: string }> }): Promise<Metadata> {
  const { concept } = await params;
  const def = getConcept(concept);
  return { title: def ? `Log in (${def.direction})` : "Log in" };
}

export default async function ConceptLoginPage({ params }: { params: Promise<{ concept: string }> }) {
  const { concept } = await params;
  const def = getConcept(concept);
  if (!def) notFound();
  const { Login } = getExperiences(def.slug);
  if (!Login) notFound();
  return <Login />;
}
