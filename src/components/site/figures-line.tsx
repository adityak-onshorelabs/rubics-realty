import type { Figure } from "@/content/types";
import { cn } from "@/lib/utils";

/** Figures as a ruled manifest line (never stat cards). Tall condensed numerals, like a lift readout. */
export function FiguresLine({ figures, className, size = "lg" }: { figures: Figure[]; className?: string; size?: "md" | "lg" }) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 border-t border-border sm:flex sm:flex-wrap sm:divide-x sm:divide-border",
        className,
      )}
    >
      {figures.map((f) => (
        <div key={f.label} className="flex flex-col-reverse gap-2 py-5 pe-6 sm:flex-1 sm:px-6 sm:first:ps-0">
          <dt className="text-sm opacity-80">
            {f.label}
            {f.note ? <span className="mt-1 block text-xs opacity-80">{f.note}</span> : null}
          </dt>
          <dd
            className={cn(
              "t-numeral text-brass-deep [.on-navy_&]:text-brass [.on-lacquer_&]:text-brass",
              size === "lg" ? "text-6xl lg:text-7xl" : "text-5xl",
            )}
          >
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
