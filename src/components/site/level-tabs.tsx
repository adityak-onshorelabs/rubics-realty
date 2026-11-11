"use client";

/**
 * Adapted from Watermelon `continuous-tabs` (reference/watermelon/continuous-tabs.tsx).
 * Changes: pill -> square brass-ruled indicator (lift-panel feel); proper WAI-ARIA tabs (roles, roving tabindex,
 * Arrow/Home/End keys, aria-controls); removed the "render nothing until mounted" gate (it hid the tabs from SSR);
 * colours from tokens; horizontal track scrolls inside itself on mobile; optional level code per tab.
 */
import { LayoutGroup, motion } from "motion/react";
import { useId, useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export type LevelTab = { id: string; label: string; code?: string; count?: number };

export function LevelTabs({
  tabs,
  active,
  onChange,
  label,
  idBase,
  className,
}: {
  tabs: LevelTab[];
  active: string;
  onChange: (id: string) => void;
  label: string;
  /** Panels use `${idBase}-panel-${tab.id}` as their id. */
  idBase: string;
  className?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const layoutId = useId();

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    refs.current[next]?.focus();
    onChange(tabs[next].id);
  };

  return (
    <LayoutGroup id={layoutId}>
      <div
        role="tablist"
        aria-label={label}
        className={cn("no-scrollbar -mx-1 flex overflow-x-auto border-b border-border px-1", className)}
      >
        {tabs.map((tab, i) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`${idBase}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${idBase}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "relative flex min-h-12 shrink-0 items-center gap-2.5 px-4 pb-1 transition-colors",
                selected ? "text-current" : "opacity-65 hover:opacity-100",
              )}
            >
              {tab.code ? <span className="t-level text-accent-ink [.on-navy_&]:text-accent-on-navy">{tab.code}</span> : null}
              <span className="t-label">{tab.label}</span>
              {typeof tab.count === "number" ? (
                <span className="t-level opacity-70" aria-label={`${tab.count} items`}>
                  {tab.count}
                </span>
              ) : null}
              {selected ? (
                <motion.span
                  layoutId="level-tab-indicator"
                  aria-hidden
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-brass-deep [.on-navy_&]:bg-brass"
                  transition={{ type: "spring", stiffness: 420, damping: 40 }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
