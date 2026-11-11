"use client";

/**
 * Adapted from Watermelon `faq-6` (reference/watermelon/faq-06.tsx).
 * Changes: dashed FAQ grid -> lobby directory of amenity clubs with level-style numbering; built on native
 * buttons with aria-expanded/aria-controls instead of the base-ui Accordion; open/close animates
 * grid-template-rows (no measured heights); react-icons removed; multiple rows may stay open;
 * tokens instead of hardcoded colours.
 */
import { useId, useState } from "react";
import { Plus } from "lucide-react";
import type { AmenityClub } from "@/content/types";
import { cn } from "@/lib/utils";

export function ClubDirectory({ clubs }: { clubs: AmenityClub[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const base = useId();
  const toggle = (i: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <ol className="border-t border-datum md:columns-2 md:gap-x-12">
      {clubs.map((c, i) => {
        const isOpen = open.has(i);
        const panelId = `${base}-club-${i}`;
        return (
          <li key={c.name} className="break-inside-avoid border-b border-datum">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="group flex min-h-16 w-full items-center gap-5 py-4 text-start"
              >
                <span className="t-level w-8 text-accent-ink" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="t-h3 flex-1 font-normal">{c.name}</span>
                <span className="t-level text-graphite-muted">{c.items.length}</span>
                <Plus
                  aria-hidden
                  className={cn("size-5 text-brass-deep transition-transform duration-300", isOpen && "rotate-45")}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-label={c.name}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-lift)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
              inert={!isOpen}
            >
              <div className="overflow-hidden">
                <ul className="grid gap-x-6 pb-6 ps-[3.25rem] sm:grid-cols-2">
                  {c.items.map((it) => (
                    <li key={it} className="py-1.5 text-sm text-graphite-muted">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
