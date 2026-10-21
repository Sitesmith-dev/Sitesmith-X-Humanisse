// Design A is the main branch, verbatim: the exact same section components the live site composes on "/",
// so this preview can never quietly drift from what actually ships there.
import { PanelTransitions } from "@/components/shared/PanelTransitions";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { Community } from "@/components/landing/Community";
import { Hero } from "@/components/landing/Hero";
import { LearningIdeology } from "@/components/landing/LearningIdeology";
import { VideoPreview } from "@/components/landing/VideoPreview";
import { Vision } from "@/components/landing/Vision";
import { Faq } from "@/components/landing/Faq";
import { FeaturedComics, FinalCTA, Trio } from "@/components/landing/Sections";

export function LandingExperience() {
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
