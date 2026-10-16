import type { Metadata } from "next";
import { CommunityContent } from "@/components/pages/CommunityContent";

export const metadata: Metadata = { title: "Community" };

export default function CommunityPage() {
  return <CommunityContent />;
}
