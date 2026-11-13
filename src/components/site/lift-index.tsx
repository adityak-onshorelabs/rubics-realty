"use client";

/**
 * Section index for project pages below 1024px: a horizontal chip track of level codes under the header,
 * with aria-current for the section in view (IntersectionObserver, native scroll). From 1024px the lift
 * shaft (floor-rail.tsx) is the page's vertical navigation, so the old right-hand lift panel is gone.
 */
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type LiftStop = { id: string; code: string; label: string };

export function LiftIndex({ stops }: { stops: LiftStop[] }) {
  const [active, setActive] = useState(stops[0]?.id);

  useEffect(() => {
    // Next keeps previous routes mounted but hidden, so ids can repeat: take the rendered one.
    const els = stops
      .map((s) => Array.from(document.querySelectorAll<HTMLElement>(`[id="${s.id}"]`)).find((el) => el.getClientRects().length > 0))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [stops]);

  // Below 1024px: horizontal track under the header (from 1024px the lift shaft on the left takes over).
  // Follows the header when it tucks away on scroll.
  return (
      <nav
        aria-label="On this page"
        className="on-lacquer sticky top-[var(--header-h)] z-30 border-b border-datum-navy transition-transform duration-500 ease-[var(--ease-out-expo)] [transform:translateY(var(--header-shift))] lg:hidden"
      >
        <ol className="no-scrollbar scroll-hint frame flex gap-1 overflow-x-auto py-2" data-lenis-prevent>
          {stops.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={s.id === active ? "location" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2 px-3 text-ivory-muted",
                  s.id === active && "text-ivory",
                )}
              >
                <span className={cn("t-level text-[0.7rem]", s.id === active ? "text-brass" : "")}>{s.code}</span>
                <span className="t-label text-[0.62rem]">{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
  );
}
