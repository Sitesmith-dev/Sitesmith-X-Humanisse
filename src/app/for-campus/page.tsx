import type { Metadata } from "next";
import { getAudience } from "@/content/audiences";
import { AudienceContent } from "@/components/landing/AudienceContent";

export const metadata: Metadata = { title: "For Institutions" };

export default function ForCampusPage() {
  const audience = getAudience("for-campus")!;
  return <AudienceContent audience={audience} />;
}
