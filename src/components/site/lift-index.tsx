"use client";

/**
 * Lift-button section index for project pages.
 * Adapted from Watermelon `vertical-tooltip-navbar` (reference/watermelon/vertical-tooltip-navbar.tsx).
 * Changes: icon buttons -> round brass lift buttons carrying level codes; the label reveal keeps the demo's
 * clip-path idea but is pure CSS (hover + focus-visible), no measured offsets or timers; buttons are real
 * links to section ids with aria-current for the section in view (IntersectionObserver, native scroll);
 * on small screens it becomes a horizontal chip track under the header.
 */
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type LiftStop = { id: string; code: string; label: string };

export function LiftIndex({ stops }: { stops: LiftStop[] }) {
  const [active, setActive] = useState(stops[0]?.id);

  useEffect(() => {
    const els = stops.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
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

  return (
    <>
      {/* Desktop: vertical lift panel */}
      <nav aria-label="On this page" className="fixed end-5 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
        <ol className="on-lacquer flex flex-col-reverse gap-1.5 border border-datum-navy p-2">
          {stops.map((s) => {
            const isActive = s.id === active;
            return (
              <li key={s.id} className="group relative">
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "t-level flex size-11 items-center justify-center rounded-full border text-[0.7rem] transition-colors",
                    isActive
                      ? "border-brass bg-brass text-lacquer"
                      : "border-datum-navy text-ivory-muted hover:border-brass hover:text-brass",
                  )}
                >
                  {s.code}
                  <span className="sr-only">: {s.label}</span>
                </a>
                <span
                  aria-hidden
                  className="t-label pointer-events-none absolute end-[calc(100%+0.85rem)] top-1/2 -translate-y-1/2 whitespace-nowrap bg-lacquer px-3 py-2 text-ivory [clip-path:inset(0_0_0_100%)] transition-[clip-path] duration-200 ease-[var(--ease-lift)] group-hover:[clip-path:inset(0)] group-has-[:focus-visible]:[clip-path:inset(0)]"
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile/tablet: horizontal track */}
      <nav aria-label="On this page" className="on-lacquer sticky top-[var(--header-h)] z-30 border-b border-datum-navy xl:hidden">
        <ol className="no-scrollbar frame flex gap-1 overflow-x-auto py-2">
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
    </>
  );
}
