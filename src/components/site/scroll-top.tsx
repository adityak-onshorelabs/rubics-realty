"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getLenis } from "./smooth-scroll";

/** easeInOutQuint: a lift that pulls away gently, runs, and settles. */
const liftEase = (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);

/** The level code of the floor currently at the reading line (a third of the way down the viewport). */
function currentLevel() {
  const line = window.innerHeight * 0.33;
  let code = "G";
  for (const el of document.querySelectorAll<HTMLElement>("main [data-level]")) {
    if (!el.getClientRects().length) continue; // previous routes stay mounted but hidden
    if (el.getBoundingClientRect().top <= line) code = el.dataset.level ?? code;
  }
  return code === "L00" ? "G" : code;
}

/**
 * Back to top as a lift call button. A brass ring around it fills with reading progress. Pressed, the page
 * rides up on a slow-in slow-out curve while the arrow keeps launching upward, the ring drains and a readout
 * counts the floors down to G; a brass pulse marks arrival. Scroll position is written straight to the DOM
 * each frame (no React re-render per frame). Under reduced motion it jumps to the top.
 */
export function ScrollTop() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);
  const [riding, setRiding] = useState(false);
  const [arrived, setArrived] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const ridingRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    const paint = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(1 - p);
      if (ridingRef.current && readoutRef.current) readoutRef.current.textContent = currentLevel();
      setShown(window.scrollY > window.innerHeight * 0.8 || ridingRef.current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const arrive = useCallback(() => {
    ridingRef.current = false;
    setRiding(false);
    setArrived(true);
    window.setTimeout(() => setArrived(false), 900);
    // Keyboard and screen-reader users land at the start of the content.
    document.getElementById("main")?.focus({ preventScroll: true });
  }, []);

  const goUp = () => {
    if (ridingRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      window.scrollTo(0, 0);
      arrive();
      return;
    }
    ridingRef.current = true;
    setRiding(true);
    if (readoutRef.current) readoutRef.current.textContent = currentLevel();
    // Longer pages take a little longer, within limits.
    const duration = Math.min(2.4, Math.max(1.1, 0.9 + window.scrollY / 6000));
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration, easing: liftEase, lock: true, force: true, onComplete: arrive });
      return;
    }
    // Touch devices (Lenis leaves touch native): animate the native scroll position.
    const from = window.scrollY;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      window.scrollTo(0, from * (1 - liftEase(t)));
      if (t < 1) requestAnimationFrame(step);
      else arrive();
    };
    requestAnimationFrame(step);
  };

  return (
    <div
      className={cn(
        "scroll-top fixed bottom-5 end-4 z-40 flex items-center transition-[opacity,translate,scale] duration-500 ease-[var(--ease-out-expo)] sm:bottom-7 sm:end-6",
        shown || arrived ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-90 opacity-0",
      )}
      inert={!(shown || arrived)}
    >
      {/* Readout while riding: floors counting down to the lobby */}
      <span
        aria-hidden
        className={cn(
          "t-label me-3 flex items-center gap-2 whitespace-nowrap bg-lacquer px-3 py-2 text-[0.6rem] text-ivory transition-[opacity,translate,clip-path] duration-500 ease-[var(--ease-out-expo)]",
          riding ? "translate-x-0 opacity-100 [clip-path:inset(0)]" : "pointer-events-none translate-x-2 opacity-0 [clip-path:inset(0_0_0_100%)]",
        )}
      >
        Going up
        <span ref={readoutRef} className="t-level min-w-[2.6ch] text-[0.8rem] text-brass">
          G
        </span>
      </span>

      <button
        type="button"
        onClick={goUp}
        className="group relative flex size-12 items-center justify-center rounded-full bg-lacquer text-brass outline-offset-4 sm:size-14"
      >
        <span className="sr-only">Back to top</span>
        {/* Hover label (pointer devices) */}
        <span
          aria-hidden
          className={cn(
            "t-label pointer-events-none absolute end-[calc(100%+0.75rem)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap bg-lacquer px-3 py-2 text-[0.6rem] text-ivory transition-[clip-path] duration-300 ease-[var(--ease-out-expo)] [@media(hover:hover)]:block",
            riding ? "[clip-path:inset(0_0_0_100%)]" : "[clip-path:inset(0_0_0_100%)] group-hover:[clip-path:inset(0)] group-focus-visible:[clip-path:inset(0)]",
          )}
        >
          Back to the lobby
        </span>

        {/* Progress ring: reading progress; drains as the lift rides up */}
        <svg aria-hidden viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90">
          <circle cx="28" cy="28" r="26.5" fill="none" stroke="var(--datum-navy)" strokeWidth="1" />
          <circle
            ref={ringRef}
            cx="28"
            cy="28"
            r="26.5"
            fill="none"
            stroke="var(--brass)"
            strokeWidth="1.5"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        </svg>
        {/* Inner bezel */}
        <span aria-hidden className="absolute inset-[5px] rounded-full border border-brass/25 transition-colors duration-300 group-hover:border-brass/60" />

        {/* Arrow: lifts on hover, keeps launching while riding */}
        <span aria-hidden className="relative block h-4 w-3.5 overflow-hidden">
          <svg
            viewBox="0 0 14 16"
            className={cn(
              "absolute inset-0 size-full fill-none stroke-current transition-transform duration-300 ease-[var(--ease-out-expo)]",
              riding ? "scroll-top-launch" : "group-hover:-translate-y-0.5",
            )}
            strokeWidth="1.5"
          >
            <path d="M7 15V2M1.5 7.5 7 2l5.5 5.5" />
          </svg>
        </span>

        {/* Arrival pulse */}
        {arrived ? <span aria-hidden className="scroll-top-pulse absolute inset-0 rounded-full border border-brass" /> : null}
      </button>
    </div>
  );
}
