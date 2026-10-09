import type { Metadata } from "next";
import { getAudience } from "@/content/audiences";
import { AudienceContent } from "@/components/landing/AudienceContent";

export const metadata: Metadata = { title: "For Individuals" };

export default function ForIndividualsPage() {
  const audience = getAudience("for-individuals")!;
  return <AudienceContent audience={audience} />;
}
