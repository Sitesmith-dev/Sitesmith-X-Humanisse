"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Every scroll effect is gated so reduced-motion visitors get the plain, finished page
const OK = "(prefers-reduced-motion: no-preference)";
// Inside a panel that scrolls on its own, such as the comic pop-up, triggers follow the nearest [data-scroller] instead of the window
const scrollerOf = (el: HTMLElement | null) => el?.closest<HTMLElement>("[data-scroller]") ?? undefined;

/** Drifts its content vertically against the scroll, giving layers a sense of depth */
export function Parallax({ speed = 0.2, className, children }: { speed?: number; className?: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(OK, () => {
      gsap.fromTo(ref.current, { yPercent: -speed * 50 }, { yPercent: speed * 50, ease: "none", scrollTrigger: { trigger: ref.current, scroller: scrollerOf(ref.current), start: "top bottom", end: "bottom top", scrub: true } });
    });
  }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}

/** A statement whose words light up one by one as it scrolls through the viewport */
export function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(OK, () => {
      gsap.fromTo(ref.current!.querySelectorAll("[data-w]"), { opacity: 0.16 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ref.current, scroller: scrollerOf(ref.current), start: "top 82%", end: "bottom 50%", scrub: true } });
    });
  }, { scope: ref });
  return <p ref={ref} className={className}>{text.split(" ").map((w, i) => <span key={i} data-w>{w} </span>)}</p>;
}

/** Grows from slightly small to full size as it arrives, so the section feels like it opens up */
export function ScrollFrame({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(OK, () => {
      gsap.fromTo(ref.current, { scale: 0.88 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ref.current, scroller: scrollerOf(ref.current), start: "top 95%", end: "top 45%", scrub: true } });
    });
  }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}
