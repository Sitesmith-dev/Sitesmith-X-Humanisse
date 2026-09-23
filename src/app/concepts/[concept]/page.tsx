import { notFound } from "next/navigation";
import { getConcept, getExperiences } from "@/concepts/registry";

export default async function ConceptLandingPage({ params }: { params: Promise<{ concept: string }> }) {
  const { concept } = await params;
  const def = getConcept(concept);
  if (!def) notFound();
  const { Landing } = getExperiences(def.slug);
  return <Landing />;
}
