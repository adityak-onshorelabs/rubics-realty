"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Brass lift indicator in the header. Shows the level code of the section currently under the
 * header line. Native scroll + IntersectionObserver; no scroll listeners, no hijacking.
 * Decorative: aria-hidden (section headings carry the same information for assistive tech).
 */
export function FloorReadout() {
  const pathname = usePathname();
  const [level, setLevel] = useState("L00");
  const [dir, setDir] = useState<1 | -1>(1);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-level]"));
    if (!sections.length) return;
    const visible = new Map<Element, number>();
    const order = new Map(sections.map((s, i) => [s as Element, i]));
    let current = -1;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target, order.get(e.target) ?? 0);
          else visible.delete(e.target);
        }
        if (!visible.size) return;
        // Topmost section intersecting the readout band wins.
        const idx = Math.min(...visible.values());
        if (idx !== current) {
          setDir(idx > current ? 1 : -1);
          current = idx;
          setLevel(sections[idx].dataset.level ?? "");
        }
      },
      { rootMargin: "-72px 0px -70% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="plaque relative hidden h-10 w-[4.75rem] items-center justify-center overflow-hidden !px-0 !py-0 sm:flex"
      style={{ ["--chamfer" as string]: "6px", ["--plaque-line" as string]: "var(--brass)" }}
    >
      <svg width="8" height="6" viewBox="0 0 10 8" className="me-1.5 shrink-0 fill-brass" aria-hidden>
        <path d={dir === 1 ? "M5 0l5 8H0z" : "M0 0h10L5 8z"} />
      </svg>
      <span className="relative block h-5 w-11 overflow-hidden">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.span
            key={level}
            custom={dir}
            className="t-level absolute inset-0 text-center text-[0.95rem] leading-5 text-brass"
            variants={{
              enter: (d: number) => ({ y: d * 20, opacity: 0 }),
              center: { y: 0, opacity: 1 },
              exit: (d: number) => ({ y: d * -20, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.65, 0, 0.35, 1] }}
          >
            {level}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
