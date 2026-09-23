"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// A page settling into place as it is turned to, a slow rise with the faintest tilt rather than a UI card popping in
export function Reveal({ children, delay = 0, className, as: As = "div", ...rest }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" } & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(ref.current, { opacity: 0, y: 26, rotate: -0.6 }, {
        opacity: 1, y: 0, rotate: 0, duration: 0.85, delay, ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
    });
  }, { scope: ref, dependencies: [delay] });
  return <As ref={ref} className={className} {...rest}>{children}</As>;
}
