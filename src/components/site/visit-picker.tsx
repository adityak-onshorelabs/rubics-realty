"use client";

/**
 * Preferred-visit picker. Adapted from Watermelon `slot-picker` (reference/watermelon/slot-picker.tsx).
 * Changes: the demo edits weekly availability (toggle per day + free-text time slots). Here the mechanic is
 * reused for a buyer: day rows (next 7 days) act as a radio group; the chosen day expands to reveal time
 * windows (also radios). Native inputs inside fieldsets, so keyboard and screen readers work without
 * custom roles; expand animates grid-template-rows; tokens instead of greys; no Math.random ids.
 * It records a *preferred* slot only: the sales team confirms by phone. Days are computed after mount
 * so the server-rendered HTML never bakes in a stale date.
 */
import { useEffect, useState } from "react";
import { windows } from "@/lib/enquiry";
import { cn } from "@/lib/utils";

type Day = { iso: string; weekday: string; label: string };

function nextDays(n: number): Day[] {
  const out: Day[] = [];
  const now = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    out.push({
      iso,
      weekday: d.toLocaleDateString("en-IN", { weekday: "long" }),
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    });
  }
  return out;
}

export function VisitPicker({
  date,
  window: win,
  onChange,
  error,
}: {
  date: string;
  window: string;
  onChange: (v: { date: string; window: string }) => void;
  error?: string;
}) {
  const [days, setDays] = useState<Day[]>([]);
  useEffect(() => {
    // Client-only: dates depend on the visitor's "today".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDays(nextDays(7));
  }, []);

  return (
    <fieldset aria-describedby={error ? "visitDate-error" : undefined}>
      <legend className="t-label text-graphite-muted">Preferred day</legend>
      <div className="mt-3 grid gap-2">
        {days.length === 0 ? <div className="h-[22rem]" aria-hidden /> : null}
        {days.map((d) => {
          const selected = d.iso === date;
          return (
            <div
              key={d.iso}
              className={cn(
                "border transition-colors",
                selected ? "border-navy bg-travertine" : "border-datum bg-travertine-2/60 hover:border-graphite-muted",
              )}
            >
              <label className="flex min-h-12 cursor-pointer items-center gap-4 px-4">
                <input
                  type="radio"
                  name="visitDate"
                  value={d.iso}
                  checked={selected}
                  onChange={() => onChange({ date: d.iso, window: win || "Morning" })}
                  className="size-4 accent-[var(--navy)]"
                />
                <span className="flex-1 font-medium">{d.weekday}</span>
                <span className="t-level text-graphite-muted">{d.label}</span>
              </label>
              <div className={cn("grid transition-[grid-template-rows] duration-300 ease-[var(--ease-lift)]", selected ? "grid-rows-[1fr]" : "grid-rows-[0fr]")} inert={!selected}>
                <div className="overflow-hidden">
                  <fieldset className="flex flex-wrap gap-2 px-4 pb-4">
                    <legend className="sr-only">Preferred time on {d.weekday}</legend>
                    {windows.map((w) => (
                      <label
                        key={w}
                        className={cn(
                          "t-label flex min-h-11 cursor-pointer items-center gap-2 border px-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-brass-deep [&:has(:focus-visible)]:outline-solid",
                          win === w && selected ? "border-navy bg-navy text-ivory" : "border-datum",
                        )}
                      >
                        <input
                          type="radio"
                          name={`visitWindow-${d.iso}`}
                          value={w}
                          checked={win === w && selected}
                          onChange={() => onChange({ date: d.iso, window: w })}
                          className="sr-only"
                        />
                        {w}
                      </label>
                    ))}
                  </fieldset>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {error ? (
        <p id="visitDate-error" className="mt-2 text-sm text-error">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
