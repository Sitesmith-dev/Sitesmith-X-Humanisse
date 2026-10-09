import { PanelTransitions } from "@/components/shared/PanelTransitions";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { Community } from "@/components/landing/Community";
import { Hero } from "@/components/landing/Hero";
import { LearningIdeology } from "@/components/landing/LearningIdeology";
import { VideoPreview } from "@/components/landing/VideoPreview";
import { Vision } from "@/components/landing/Vision";
import { Faq } from "@/components/landing/Faq";
import { FeaturedComics, FinalCTA, Trio } from "@/components/landing/Sections";

export default function Home() {
  return (
    <>
      <PanelTransitions />
      <Hero />
      <Vision />
      <Trio />
      <VideoPreview />
      <FeaturedComics />
      <LearningIdeology />
      <AudienceSection />
      <Community />
      <Faq />
      <FinalCTA />
    </>
  );
}
