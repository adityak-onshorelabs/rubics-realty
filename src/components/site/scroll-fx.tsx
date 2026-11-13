"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scroll-scrubbed effects (GSAP ScrollTrigger). Entrance reveals stay in CSS (reveal.tsx); these are the
 * effects tied continuously to scroll position. Every one is set up inside a reduced-motion media query
 * and reverted on unmount, so hidden routes and route changes leave nothing behind.
 */
const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Image drifts inside its frame as the frame crosses the viewport. Wraps a Plate (targets .plate-media). */
export function Parallax({ children, amount = 5, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = ref.current;
        const media = el?.querySelector<HTMLElement>(".plate-media");
        if (!el || !media) return;
        gsap.fromTo(
          media,
          { yPercent: -amount },
          { yPercent: amount, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} data-parallax className={className}>
      {children}
    </div>
  );
}

/**
 * Hero exit: as a full-height hero scrolls away, its media sinks and slowly enlarges while the copy lifts
 * and dims, so the page appears to rise over the film. Drop inside a section that marks
 * [data-hero-media] and [data-hero-content].
 */
export function HeroScroll() {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const section = ref.current?.closest("section");
      const media = section?.querySelector("[data-hero-media]");
      const content = section?.querySelector("[data-hero-content]");
      if (!section || !media) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true } });
      tl.to(media, { yPercent: 18, scale: 1.08, ease: "none" }, 0);
      if (content) tl.to(content, { y: () => -window.innerHeight * 0.12, autoAlpha: 0.15, ease: "none" }, 0);
    });
    return () => mm.revert();
  });
  return <span ref={ref} hidden />;
}

/** Large display type that slides sideways with scroll, like lettering seen from a moving lift. */
export function Drift({ children, from = 0, to = -6, className }: { children: ReactNode; from?: number; to?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (!ref.current) return;
        gsap.fromTo(
          ref.current,
          { xPercent: from },
          { xPercent: to, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
