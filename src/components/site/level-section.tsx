import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "travertine" | "travertine-2" | "navy" | "lacquer";

const toneClass: Record<Tone, string> = {
  travertine: "bg-travertine text-graphite",
  "travertine-2": "bg-travertine-2 text-graphite",
  navy: "on-navy grain",
  lacquer: "on-lacquer grain",
};

/**
 * A "floor" of the page. Each section sits between datum lines and carries a level code,
 * which the header's floor readout picks up through `data-level`.
 */
export function LevelSection({
  id,
  level,
  label,
  tone = "travertine",
  children,
  className,
  bare = false,
  ariaLabel,
}: {
  id?: string;
  level: string;
  label?: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
  /** Skip the datum header (e.g. hero). */
  bare?: boolean;
  ariaLabel?: string;
}) {
  return (
    <section
      id={id}
      data-level={level}
      data-label={label ?? ariaLabel}
      aria-label={ariaLabel}
      tabIndex={id ? -1 : undefined}
      className={cn(toneClass[tone], "relative outline-none", !bare && "section-y", className)}
    >
      {!bare && label ? (
        <div className="frame mb-10 lg:mb-14">
          <DatumLine level={level} label={label} />
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function DatumLine({ level, label }: { level: string; label: string }) {
  return (
    <p className="datum t-label text-brass-deep [.on-navy_&]:text-brass [.on-lacquer_&]:text-brass">
      <span aria-hidden className="t-level flex items-center gap-1.5 normal-case tracking-normal">
        <svg width="10" height="8" viewBox="0 0 10 8" aria-hidden className="fill-current">
          <path d="M0 0h10L5 8z" />
        </svg>
        {level}
      </span>
      <span>{label}</span>
    </p>
  );
}
