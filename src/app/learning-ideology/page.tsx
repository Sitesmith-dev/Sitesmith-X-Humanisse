import type { Metadata } from "next";
import { IdeologyContent } from "@/components/pages/IdeologyContent";

export const metadata: Metadata = { title: "The Learning Ideology" };

export default function LearningIdeologyPage() {
  return <IdeologyContent />;
}
