"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
/** The page's Lenis instance, or null (reduced motion, touch-only, or not mounted yet). */
export const getLenis = () => lenis;

/**
 * Smooth scroll: Lenis eases wheel and trackpad input (touch stays native), driven by GSAP's ticker so
 * Lenis, ScrollTrigger scrubs and the browser paint all advance on the same frame at any refresh rate
 * (60, 120, 164Hz). Off entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const headerOffset = () => -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 3.5) * parseFloat(getComputedStyle(document.documentElement).fontSize) - 16;

    lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
      anchors: { offset: headerOffset() },
      // Let inner scrollers (tabs, chip tracks, the menu dialog, the map) scroll themselves.
      prevent: (node) => !!node.closest?.("dialog, iframe, [data-lenis-prevent]"),
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Layout settles once the variable font has loaded.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // New page: start at the top (unless a hash asks for a section) and re-measure scroll-linked effects.
  useEffect(() => {
    // Skip the first run so a reload keeps the browser's restored position.
    if (first.current) first.current = false;
    else if (!location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => {
      lenis?.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
