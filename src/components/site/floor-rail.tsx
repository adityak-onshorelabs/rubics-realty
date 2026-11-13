"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Floor = { level: string; label: string; id?: string; els: HTMLElement[] };

/**
 * Lift shaft: the page's only vertical navigation, fixed to the left edge from 1024px.
 * Each segment is as tall as its section, stacked from the ground up, so scrolling down rides the lift *up*.
 * Passed floors fill with brass; the car carries the current level code and name. Every floor is a real link.
 *
 * Performance: scroll position is applied straight to the DOM (transforms on refs) once per frame. React
 * only re-renders when the floor list or the current floor changes, never per scrolled frame, and nothing
 * scroll-driven carries a CSS transition (a transition re-targeted every frame judders, worst on 144Hz+).
 */
export function FloorShaft() {
  const pathname = usePathname();
  const [floors, setFloors] = useState<Floor[]>([]);
  const [weights, setWeights] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const carRef = useRef<HTMLDivElement>(null);
  const shaftRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    let grouped: Floor[] = [];
    let geo = { tops: [] as number[], bottoms: [] as number[] };
    let raf = 0;
    let lastIdx = -1;

    const measure = () => ({
      tops: grouped.map((f) => f.els[0].getBoundingClientRect().top + window.scrollY),
      bottoms: grouped.map((f) => f.els[f.els.length - 1].getBoundingClientRect().bottom + window.scrollY),
    });

    const paint = () => {
      raf = 0;
      if (!grouped.length) return;
      // Reading line sits a third of the way down the viewport.
      const y = window.scrollY + window.innerHeight * 0.33;
      let idx = 0;
      let travelled = 0;
      let total = 0;
      for (let i = 0; i < grouped.length; i++) {
        const h = Math.max(1, geo.bottoms[i] - geo.tops[i]);
        const f = Math.max(0, Math.min(1, (y - geo.tops[i]) / h));
        if (y >= geo.tops[i]) idx = i;
        travelled += f * h;
        total += h;
        const fill = fillRefs.current[i];
        if (fill) fill.style.transform = `scaleY(${f})`;
      }
      if (idx !== lastIdx) {
        lastIdx = idx;
        setCurrent(idx);
      }
      const car = carRef.current;
      const shaft = shaftRef.current;
      if (car && shaft) {
        const H = shaft.clientHeight;
        const c = car.offsetHeight;
        const bottom = Math.max(0, Math.min(H - c, (travelled / total) * H - c / 2));
        car.style.transform = `translate3d(-50%, ${-bottom}px, 0)`;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const remeasure = () => {
      geo = measure();
      setWeights(geo.tops.map((t, i) => Math.max(1, geo.bottoms[i] - t)));
      schedule();
    };

    // Next keeps previous routes mounted but hidden (display: none), so only rendered sections count.
    // Re-read when main's children change and shortly after a route change: the pathname can update before
    // the new page is committed or the old one is hidden.
    let signature = "";
    const rebuild = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("main [data-level]")).filter((el) => el.getClientRects().length > 0);
      const next = sections.map((el) => `${el.dataset.level}:${el.id}`).join("|");
      if (next === signature) return remeasure();
      signature = next;
      grouped = [];
      for (const el of sections) {
        const level = el.dataset.level ?? "";
        const last = grouped[grouped.length - 1];
        if (last && last.level === level) last.els.push(el);
        else grouped.push({ level, label: el.dataset.label ?? level, id: el.id || undefined, els: [el] });
      }
      lastIdx = -1;
      setFloors(grouped);
      remeasure();
    };

    rebuild();
    const settle = [120, 450, 1200].map((ms) => window.setTimeout(rebuild, ms));
    const main = document.getElementById("main");
    let mraf = 0;
    const mo = new MutationObserver(() => {
      if (!mraf)
        mraf = requestAnimationFrame(() => {
          mraf = 0;
          rebuild();
        });
    });
    if (main) mo.observe(main, { childList: true, subtree: true });
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      settle.forEach((t) => window.clearTimeout(t));
      mo.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      if (raf) cancelAnimationFrame(raf);
      if (mraf) cancelAnimationFrame(mraf);
    };
  }, [pathname]);

  const floor = floors[current];
  if (floors.length < 2 || !floor) return null;

  return (
    <nav
      aria-label="Floors on this page"
      className="pointer-events-none fixed bottom-6 start-4 top-[calc(var(--header-h)+1.5rem)] z-30 hidden w-8 lg:block"
    >
      {/* Shaft: lacquer track so it reads on both navy and cream bands */}
      <ol ref={shaftRef} className="absolute inset-y-0 start-1/2 flex w-[5px] -translate-x-1/2 flex-col-reverse gap-[3px] bg-lacquer/85 p-px">
        {floors.map((f, i) => (
          <li key={`${f.level}-${i}`} className="group/floor relative w-full" style={{ flexGrow: weights[i] ?? 1, flexBasis: 0 }}>
            <span className="absolute inset-0 overflow-hidden bg-datum-navy">
              <span
                ref={(el) => {
                  fillRefs.current[i] = el;
                }}
                className="absolute inset-0 origin-bottom bg-brass"
                style={{ transform: "scaleY(0)", opacity: i === current ? 1 : 0.7 }}
              />
            </span>
            {f.id ? (
              <a
                href={`#${f.id}`}
                aria-current={i === current ? "location" : undefined}
                className="pointer-events-auto absolute -inset-x-3 inset-y-0 block outline-none"
              >
                <span className="sr-only">
                  {f.level}: {f.label}
                </span>
                {/* Floor label slides out from the shaft on hover/focus */}
                <span
                  aria-hidden
                  className="absolute start-[calc(100%+0.25rem)] top-1/2 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap bg-lacquer px-2.5 py-1.5 text-ivory [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-300 ease-[var(--ease-out-expo)] group-hover/floor:[clip-path:inset(0)] group-has-[:focus-visible]/floor:[clip-path:inset(0)]"
                >
                  <span className="t-level text-[0.7rem] text-brass">{f.level}</span>
                  <span className="t-label text-[0.6rem]">{f.label}</span>
                </span>
              </a>
            ) : null}
          </li>
        ))}
      </ol>

      {/* Car: rides up with the reading position (transform set per frame), carries the current floor */}
      <div
        ref={carRef}
        aria-hidden
        className="absolute bottom-0 start-1/2 flex flex-col-reverse items-center gap-2 border border-brass/40 bg-lacquer px-1 py-2 will-change-transform"
        style={{ transform: "translate3d(-50%, 0, 0)" }}
      >
        <span className="size-1.5 bg-brass" />
        <span className="relative block overflow-hidden [writing-mode:vertical-rl] rotate-180">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={floor.level}
              className="t-level block text-[0.7rem] text-brass"
              initial={{ x: 8, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {floor.level}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="relative block overflow-hidden [writing-mode:vertical-rl] rotate-180">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={floor.label}
              className="t-label block whitespace-nowrap text-[0.6rem] text-ivory"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {floor.label}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </nav>
  );
}
