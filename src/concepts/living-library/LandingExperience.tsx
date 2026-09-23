// Design A is the main branch, verbatim: the exact same section components the live site composes on "/",
// so this preview can never quietly drift from what actually ships there.
import { PanelTransitions } from "@/components/shared/PanelTransitions";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Marquee } from "@/components/landing/Marquee";
import { VideoPreview } from "@/components/landing/VideoPreview";
import { Faq } from "@/components/landing/Faq";
import { AboutUs } from "@/components/landing/AboutUs";
import { FeaturedComics, FinalCTA, Trio } from "@/components/landing/Sections";

export function LandingExperience() {
  return (
    <>
      <PanelTransitions />
      <Hero />
      <Marquee />
      <AboutUs />
      <FeaturedComics />
      <HowItWorks />
      <Trio />
      <VideoPreview />
      <Faq />
      <FinalCTA />
    </>
  );
}
