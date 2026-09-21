"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Each colour panel opens up from a slightly inset frame as it scrolls into view, so the change between sections is an animation, not a cut
export function PanelTransitions() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".band").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(6% 3% 0% 3% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: el, start: "top 100%", end: "top 42%", scrub: true } });
      });
    });
  });
  return null;
}
