// Design A is the main branch, verbatim: the exact same section components the live site composes on "/",
// so this preview can never quietly drift from what actually ships there.
import { Hero } from "@/components/landing/Hero";
import { Cast } from "@/components/landing/Cast";
import { Masterclass } from "@/components/landing/Masterclass";
import { Questions } from "@/components/landing/Questions";

export function LandingExperience() {
  return (
    <>
      <Hero />
      <Cast />
      <Masterclass />
      <Questions />
    </>
  );
}
