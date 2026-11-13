import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "travertine" | "travertine-2" | "navy" | "lacquer";

const toneClass: Record<Tone, string> = {
  travertine: "bg-travertine text-graphite stone",
  "travertine-2": "bg-travertine-2 text-graphite stone [--surface:var(--travertine-2)]",
  navy: "on-navy grain",
  lacquer: "on-lacquer grain",
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * A "floor" of the page. Each section sits between datum lines and carries a level code, which the
 * lift shaft reads through `data-level` / `data-label`. Every floor gets an id so the shaft can link to it.
 */
export function LevelSection({
  id,
  level,
  label,
  tone = "travertine",
  children,
  className,
  bare = false,
  tight = false,
  meta,
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
  tight?: boolean;
  /** Small print at the far end of the datum line. */
  meta?: string;
  ariaLabel?: string;
}) {
  const sectionId = id ?? (label ? slugify(label) : undefined);
  return (
    <section
      id={sectionId}
      data-level={level}
      data-label={label ?? ariaLabel}
      aria-label={ariaLabel}
      tabIndex={sectionId ? -1 : undefined}
      className={cn(toneClass[tone], "relative outline-none", !bare && (tight ? "section-y-tight" : "section-y"), className)}
    >
      {!bare && label ? (
        <div className="frame mb-9 lg:mb-12">
          <DatumLine level={level} label={label} meta={meta} />
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function DatumLine({ level, label, meta }: { level: string; label: string; meta?: string }) {
  return (
    <p
      suppressHydrationWarning data-reveal="wipe"
      className="datum t-label text-brass-deep [.on-lacquer_&]:text-brass [.on-navy_&]:text-brass"
    >
      <span aria-hidden className="t-level flex items-center gap-1.5 normal-case tracking-normal">
        <svg width="10" height="8" viewBox="0 0 10 8" aria-hidden className="fill-current">
          <path d="M0 0h10L5 8z" />
        </svg>
        {level}
      </span>
      <span>{label}</span>
      <span aria-hidden className="datum-rule" />
      {meta ? (
        <span aria-hidden className="t-note opacity-80 max-sm:hidden">
          {meta}
        </span>
      ) : null}
    </p>
  );
}

/**
 * Stepped terminator taken from the logo's stacked chevrons (floors rising). Ends a band or opens a statement.
 */
export function StepRule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-4 text-brass-deep [.on-lacquer_&]:text-brass [.on-navy_&]:text-brass", className)}>
      <span suppressHydrationWarning data-reveal="line" className="h-px flex-1 origin-left bg-current opacity-50" />
      <svg width="22" height="20" viewBox="0 0 22 20" className="shrink-0" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M3 8 11 2l8 6" />
        <path d="M3 13l8-6 8 6" />
        <path d="M3 18l8-6 8 6" />
      </svg>
      <span suppressHydrationWarning data-reveal="line" className="h-px flex-1 origin-right bg-current opacity-50" />
    </div>
  );
}
