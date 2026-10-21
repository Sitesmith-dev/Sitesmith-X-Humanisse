import { Hero } from "@/components/landing/Hero";
import { Cast } from "@/components/landing/Cast";
import { Masterclass } from "@/components/landing/Masterclass";
import { Questions } from "@/components/landing/Questions";

// The brand first: the hero, the three who teach, the introduction, the answers
export default function Home() {
  return (
    <>
      <Hero />
      <Cast />
      <Masterclass />
      <Questions />
    </>
  );
}
