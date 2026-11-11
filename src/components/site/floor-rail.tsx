"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Floor = { level: string; label: string; els: HTMLElement[] };

/**
 * Lift shaft: a fixed vertical rail on the left edge (wide screens only) that maps the page as floors.
 * Each segment is as tall as its section, stacked from the ground up, so scrolling down the page rides the
 * lift *up* the tower. Passed floors stay lit in brass; a small car carries the current floor name.
 * Native scroll only (passive listener + rAF), no hijacking. Decorative (aria-hidden): section headings
 * carry the same information for assistive tech.
 */
function useFloors() {
  const pathname = usePathname();
  const [floors, setFloors] = useState<Floor[]>([]);
  const [weights, setWeights] = useState<number[]>([]);
  const [fills, setFills] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main [data-level]"));
    // Merge consecutive sections that share a level code (e.g. a page header and its first band).
    const grouped: Floor[] = [];
    for (const el of sections) {
      const level = el.dataset.level ?? "";
      const last = grouped[grouped.length - 1];
      if (last && last.level === level) last.els.push(el);
      else grouped.push({ level, label: el.dataset.label ?? level, els: [el] });
    }

    const measure = () => {
      const tops = grouped.map((f) => f.els[0].getBoundingClientRect().top + window.scrollY);
      const bottoms = grouped.map((f) => {
        const r = f.els[f.els.length - 1].getBoundingClientRect();
        return r.bottom + window.scrollY;
      });
      return { tops, bottoms };
    };

    let geo = measure();
    const update = () => {
      raf.current = 0;
      // Reading line sits a third of the way down the viewport.
      const y = window.scrollY + window.innerHeight * 0.33;
      const f = geo.tops.map((t, i) => Math.max(0, Math.min(1, (y - t) / Math.max(1, geo.bottoms[i] - t))));
      setFills(f);
      let idx = 0;
      for (let i = 0; i < geo.tops.length; i++) if (y >= geo.tops[i]) idx = i;
      setCurrent(idx);
    };
    const schedule = () => {
      if (!raf.current) raf.current = requestAnimationFrame(update);
    };
    const remeasure = () => {
      geo = measure();
      setWeights(geo.tops.map((t, i) => Math.max(1, geo.bottoms[i] - t)));
      schedule();
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect -- DOM-derived page map
    setFloors(grouped);
    remeasure();
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [pathname]);

  return { floors, weights, fills, current };
}

export function FloorShaft() {
  const { floors, weights, fills, current } = useFloors();
  const carRef = useRef<HTMLDivElement>(null);
  const [carH, setCarH] = useState(0);
  const floor = floors[current];

  useEffect(() => {
    if (carRef.current) setCarH(carRef.current.offsetHeight);
  }, [floor?.label]);

  if (floors.length < 2 || !floor) return null;

  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const before = weights.slice(0, current).reduce((a, b) => a + b, 0);
  const progress = Math.min(1, (before + (fills[current] ?? 0) * (weights[current] ?? 0)) / total);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-6 start-3 top-[calc(var(--header-h)+1.5rem)] z-30 hidden w-6 xl:block"
    >
      {/* Shaft: lacquer track so it reads on both navy and cream bands */}
      <div className="absolute inset-y-0 start-1/2 flex w-[5px] -translate-x-1/2 flex-col-reverse gap-[3px] bg-lacquer/85 p-px">
        {floors.map((f, i) => (
          <span
            key={`${f.level}-${i}`}
            className="relative w-full overflow-hidden bg-datum-navy"
            style={{ flexGrow: weights[i] ?? 1, flexBasis: 0 }}
          >
            <span
              className="absolute inset-0 origin-bottom bg-brass transition-transform duration-150 ease-out"
              style={{ transform: `scaleY(${fills[i] ?? 0})`, opacity: i === current ? 1 : 0.7 }}
            />
          </span>
        ))}
      </div>

      {/* Car: rides up with the reading position, carries the floor name (reads bottom to top) */}
      <div
        ref={carRef}
        className="absolute start-1/2 flex -translate-x-1/2 flex-col-reverse items-center gap-2 bg-lacquer px-1 py-2 transition-[bottom] duration-200 ease-[var(--ease-lift)]"
        style={{ bottom: `min(calc(${progress * 100}% - ${carH / 2}px), calc(100% - ${carH}px))` }}
      >
        <span className="size-1.5 bg-brass" />
        <span className="t-level text-[0.7rem] text-brass [writing-mode:vertical-rl] rotate-180">{pad(current + 1)}</span>
        <span className="relative block overflow-hidden [writing-mode:vertical-rl] rotate-180">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={floor.label}
              className="t-label block whitespace-nowrap text-[0.62rem] text-ivory"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.65, 0, 0.35, 1] }}
            >
              {floor.label}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </div>
  );
}
