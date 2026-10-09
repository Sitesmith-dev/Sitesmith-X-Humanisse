import type { Metadata } from "next";
import { getAudience } from "@/content/audiences";
import { AudienceContent } from "@/components/landing/AudienceContent";

export const metadata: Metadata = { title: "For Corporates" };

export default function ForCorporatesPage() {
  const audience = getAudience("for-corporates")!;
  return <AudienceContent audience={audience} />;
}
