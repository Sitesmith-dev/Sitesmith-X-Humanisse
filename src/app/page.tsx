import { PanelTransitions } from "@/components/shared/PanelTransitions";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Marquee } from "@/components/landing/Marquee";
import { VideoPreview } from "@/components/landing/VideoPreview";
import { Faq } from "@/components/landing/Faq";
import { AboutUs } from "@/components/landing/AboutUs";
import { FeaturedComics, FinalCTA, Trio } from "@/components/landing/Sections";

export default function Home() {
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
