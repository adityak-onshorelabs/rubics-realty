import type { CSSProperties } from "react";
import type { TravelGroup } from "@/content/types";
import { RollingNumber } from "./reveal";

/**
 * Key connections drawn as a route line, schematic like a transit map: BeauMonté at the start, destinations
 * in order of travel time at even spacing, labels alternating above and below the line. Vertical list on
 * narrow screens (also the accessible version). Minutes are the published, indicative times.
 */
export function KeyConnections({ items }: { items: { place: string; time: string }[] }) {
  const sorted = [...items].sort((a, b) => Number(a.time) - Number(b.time));
  const n = sorted.length;
  const at = (k: number) => `${((k + 1) / (n + 0.5)) * 100}%`;

  return (
    <div>
      {/* Wide: schematic route */}
      <div className="relative hidden h-[15.5rem] md:block" aria-hidden>
        <div className="absolute inset-x-0 top-1/2">
          <span suppressHydrationWarning data-reveal="line" className="absolute inset-x-0 -top-px h-0.5 origin-left bg-brass/80" />
          {/* Origin */}
          <span className="absolute start-0 top-0 -translate-y-1/2">
            <span className="block size-3.5 rotate-45 border border-brass bg-lacquer" />
          </span>
          <span className="t-note absolute start-0 top-4 whitespace-nowrap text-brass">BeauMonté</span>
          {sorted.map((it, k) => {
            const up = k % 2 === 0;
            return (
              <span
                key={it.place}
                suppressHydrationWarning data-reveal="fade"
                className="absolute top-0"
                style={{ left: at(k), ["--d" as string]: `${300 + k * 120}ms` } as CSSProperties}
              >
                <span className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brass bg-navy" />
                <span className={`absolute w-px -translate-x-1/2 bg-brass/40 ${up ? "bottom-2 h-6" : "top-2 h-6"}`} />
                <span className={`absolute w-max max-w-[10rem] -translate-x-1/2 text-center ${up ? "bottom-9" : "top-9"}`}>
                  <span className="flex items-baseline justify-center gap-1">
                    <span className="t-numeral text-[2.6rem] text-brass">
                      <RollingNumber value={it.time} delay={300 + k * 120} />
                    </span>
                    <span className="t-note text-ivory-muted">min</span>
                  </span>
                  <span className="mt-1 block text-[0.8rem] leading-snug text-ivory">{it.place}</span>
                </span>
              </span>
            );
          })}
        </div>
      </div>
      <p className="t-note mt-2 hidden text-ivory-muted md:block">Schematic. Stops in order of travel time, not to scale.</p>

      {/* Narrow, and the accessible version for everyone */}
      <ol className="relative border-s border-brass/60 ps-6 md:sr-only">
        {sorted.map((it) => (
          <li key={it.place} className="relative py-3">
            <span aria-hidden className="absolute -start-[1.85rem] top-5 size-3 rounded-full border-2 border-brass bg-navy" />
            <span className="flex items-baseline gap-2">
              <span className="t-numeral text-4xl text-brass">
                <RollingNumber value={it.time} />
              </span>
              <span className="t-note text-ivory-muted">min</span>
            </span>
            <span className="mt-1 block text-sm text-ivory">{it.place}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Neighbourhood groups as native disclosures (no JS needed). */
export function TravelGroups({ groups }: { groups: TravelGroup[] }) {
  return (
    <div className="border-t border-datum-navy">
      {groups.map((g) => (
        <details key={g.title} className="group border-b border-datum-navy">
          <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 py-3 [&::-webkit-details-marker]:hidden">
            <span className="t-h3 flex-1 font-normal text-ivory">{g.title}</span>
            <span className="t-level text-ivory-muted">{g.items.length}</span>
            <span aria-hidden className="t-level text-brass transition-transform duration-300 group-open:rotate-45">+</span>
          </summary>
          <ul className="grid gap-x-8 pb-5 sm:grid-cols-2">
            {g.items.map((i) => (
              <li key={i.place} className="flex items-baseline justify-between gap-4 border-t border-datum-navy/60 py-2 text-sm">
                <span className="text-ivory-muted">{i.place}</span>
                <span className="t-level shrink-0 text-ivory">{i.time} min</span>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
