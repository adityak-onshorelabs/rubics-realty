import type { Figure } from "@/content/types";
import { cn } from "@/lib/utils";
import { RollingNumber } from "./reveal";

/**
 * Figures as a ruled manifest line under a brass inlay (never stat cards). Tall condensed numerals that roll
 * up like a lift readout when they come into view.
 */
export function FiguresLine({ figures, className, size = "lg" }: { figures: Figure[]; className?: string; size?: "md" | "lg" }) {
  return (
    <div className={className}>
      <div aria-hidden className="inlay" />
      <dl className="grid grid-cols-2 sm:flex sm:flex-wrap sm:divide-x sm:divide-border">
        {figures.map((f, i) => (
          <div key={f.label} className="flex flex-col-reverse justify-end gap-3 py-5 pe-6 sm:flex-1 sm:px-6 sm:first:ps-0 lg:py-6">
            <dt className="text-sm">
              <span className="opacity-90">{f.label}</span>
              {f.note ? <span className="t-note mt-1.5 block opacity-70">{f.note}</span> : null}
            </dt>
            <dd
              className={cn(
                "t-numeral text-brass-deep [.on-lacquer_&]:text-brass [.on-navy_&]:text-brass",
                size === "lg" ? "text-[clamp(3rem,2rem+3.4vw,4.75rem)]" : "text-[clamp(2.5rem,1.9rem+2vw,3.5rem)]",
              )}
            >
              <RollingNumber value={f.value} delay={i * 120} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
