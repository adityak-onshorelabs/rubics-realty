import type { TravelGroup } from "@/content/types";

/** Key connections as large lift-readout numerals. */
export function KeyConnections({ items }: { items: { place: string; time: string }[] }) {
  return (
    <ol className="grid grid-cols-2 border-t border-datum-navy sm:grid-cols-3">
      {items.map((i) => (
        <li key={i.place} className="border-b border-datum-navy py-5 pe-4">
          <p className="flex items-baseline gap-1.5">
            <span className="t-numeral text-6xl text-brass">{i.time}</span>
            <span className="t-label text-ivory-muted">min</span>
          </p>
          <p className="mt-2 text-sm text-ivory">{i.place}</p>
        </li>
      ))}
    </ol>
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
            <span aria-hidden className="t-level text-brass transition-transform group-open:rotate-45">+</span>
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
