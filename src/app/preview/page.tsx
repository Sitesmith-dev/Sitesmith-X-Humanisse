import type { Metadata } from "next";
import { PreviewHero } from "@/components/landing/PreviewHero";
import { Cast } from "@/components/landing/Cast";
import { Masterclass } from "@/components/landing/Masterclass";
import { Questions } from "@/components/landing/Questions";

export const metadata: Metadata = { title: "Preview" };

// The refreshed home page, shown at /preview while the live home page stays as it is
export default function PreviewPage() {
  return (
    <>
      <PreviewHero />
      <Cast />
      <Masterclass />
      <Questions />
    </>
  );
}
