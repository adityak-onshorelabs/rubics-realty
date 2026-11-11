"use client";

/**
 * Section explorer: the BeauMonté signature interaction.
 *
 * Adapted from Watermelon `scrub-slider` (reference/watermelon/scrub-slider.tsx). What changed:
 * - Horizontal temperature scrubber -> vertical lift scrubber running beside an SVG section of Tower C.
 * - Value = real level number (-1 basement ... 41), not a 0-based tick index (the demo breaks with min > 0).
 * - Pointer Events with capture instead of window mouse/touch listeners; drag only on the lift shaft so the
 *   tower drawing never traps page scroll on phones. Tapping a band selects it.
 * - role="slider" with aria-valuetext, Arrow/Page/Home/End keys; works with motion off (CSS transitions only,
 *   killed globally under prefers-reduced-motion).
 * - Data from content (old site's Tower Specifications and RERA carpet tables). Nothing invented: Level 7
 *   is shown as "details on request" because no published source describes it.
 */
import { useCallback, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ExplorerLevel, UnitTable } from "@/content/types";
import { formatArea } from "@/lib/site";
import { cn } from "@/lib/utils";

const MIN = -1;
const MAX = 41;
const ROW = 10; // svg units per level
const TOP = 16; // roof cap
const H = TOP + (MAX - MIN + 1) * ROW + 14; // + ground/footing
const W = 260;

const yOf = (level: number) => TOP + (MAX - level) * ROW; // top edge of a level row

export const levelCode = (n: number) => (n === -1 ? "B1" : n === 0 ? "G" : n <= 5 ? `P${n}` : `L${String(n).padStart(2, "0")}`);

function shape(level: number) {
  // x range per level, in svg units. Podium is wider than the tower; crown steps in.
  if (level <= 5) return { x: 34, w: 176 };
  if (level === 39) return { x: 80, w: 90 };
  if (level === 40) return { x: 87, w: 76 };
  if (level === 41) return { x: 95, w: 60 };
  return { x: 74, w: 102 };
}

export function SectionExplorer({
  levels,
  tables,
  views,
  initial = 24,
}: {
  levels: ExplorerLevel[];
  tables: UnitTable[];
  views: { dir: string; body: string }[];
  initial?: number;
}) {
  const [level, setLevel] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const shaftRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const band = useMemo(() => levels.find((b) => level >= b.from && level <= b.to)!, [levels, level]);
  const table = band.unitTableId ? tables.find((t) => t.id === band.unitTableId) : undefined;
  const above = views.find((v) => v.dir === "Above");

  const clamp = (n: number) => Math.max(MIN, Math.min(MAX, n));

  const levelFromClientY = useCallback((clientY: number) => {
    const el = shaftRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const units = ((clientY - r.top) / r.height) * H;
    return clamp(Math.round(MAX - (units - TOP - ROW / 2) / ROW));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    const l = levelFromClientY(e.clientY);
    if (l !== null) setLevel(l);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const l = levelFromClientY(e.clientY);
    if (l !== null) setLevel(l);
  };
  const endDrag = () => setDragging(false);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5 };
    if (e.key in step) {
      e.preventDefault();
      setLevel((l) => clamp(l + step[e.key]));
    } else if (e.key === "Home") {
      e.preventDefault();
      setLevel(MIN);
    } else if (e.key === "End") {
      e.preventDefault();
      setLevel(MAX);
    }
  };

  const valueText = `${band.kind === "residential" || band.kind === "terrace" ? `Level ${level}` : levelCode(level)}, ${band.name}`;
  const carriageTop = ((yOf(level) + ROW / 2) / H) * 100;
  const enquireHref = `?level=${level}#visit`;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Drawing + lift shaft */}
      <div className="lg:col-span-5">
        <div className="relative mx-auto aspect-[260/476] w-full max-w-[22rem]" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
            {/* level labels every 5 floors */}
            {[41, 35, 30, 25, 20, 15, 10, 6].map((l) => (
              <text
                key={l}
                x={26}
                y={yOf(l) + ROW - 2}
                textAnchor="end"
                className="fill-ivory-muted"
                style={{ fontSize: 7, fontVariationSettings: '"wdth" 75', fontVariantNumeric: "tabular-nums" }}
              >
                {levelCode(l)}
              </text>
            ))}
            {/* Bands: clickable rows drawn per level */}
            {Array.from({ length: MAX - MIN + 1 }, (_, i) => MAX - i).map((l) => {
              const s = shape(l);
              const b = levels.find((x) => l >= x.from && l <= x.to)!;
              const inBand = b === band;
              const isSel = l === level;
              return (
                <g key={l} onClick={() => setLevel(l)} className="cursor-pointer">
                  <rect
                    x={s.x}
                    y={yOf(l) + 0.6}
                    width={s.w}
                    height={ROW - 1.2}
                    className={cn(
                      "transition-colors duration-150",
                      isSel
                        ? "fill-accent-on-navy"
                        : inBand
                          ? "fill-[color-mix(in_oklch,var(--accent-on-navy)_28%,var(--navy-2))]"
                          : b.kind === "unpublished"
                            ? "fill-navy"
                            : l === -1
                              ? "fill-lacquer"
                              : "fill-navy-2",
                    )}
                    stroke="var(--datum-navy)"
                    strokeWidth={0.6}
                    strokeDasharray={l === -1 || b.kind === "unpublished" ? "2 1.5" : undefined}
                  />
                  {/* window rhythm on residential floors */}
                  {l >= 8 && !isSel
                    ? Array.from({ length: 7 }, (_, k) => (
                        <rect
                          key={k}
                          x={s.x + 6 + k * ((s.w - 12) / 7)}
                          y={yOf(l) + 3}
                          width={(s.w - 12) / 7 - 4}
                          height={ROW - 6}
                          className="fill-lacquer/50"
                        />
                      ))
                    : null}
                </g>
              );
            })}
            {/* E-Deck marker */}
            <line x1={34} x2={210} y1={yOf(6)} y2={yOf(6)} stroke="var(--brass)" strokeWidth={0.6} />
            {/* Ground datum ±0.00 */}
            <line x1={6} x2={W - 6} y1={yOf(0) + ROW} y2={yOf(0) + ROW} stroke="var(--brass)" strokeWidth={1} />
            <path d={`M ${8} ${yOf(0) + ROW - 7} h 8 l -4 6 z`} fill="var(--brass)" />
            <text x={20} y={yOf(0) + ROW - 2} className="fill-brass" style={{ fontSize: 6.5, fontVariationSettings: '"wdth" 75' }}>
              ±0.00
            </text>
            {/* Roof cap */}
            <line x1={95} x2={155} y1={TOP - 3} y2={TOP - 3} stroke="var(--datum-navy)" strokeWidth={0.8} />
            {/* Guide from selected floor to the shaft */}
            <line
              x1={shape(level).x + shape(level).w}
              x2={226}
              y1={yOf(level) + ROW / 2}
              y2={yOf(level) + ROW / 2}
              stroke="var(--brass)"
              strokeWidth={0.6}
              strokeDasharray="2 2"
            />
            {/* Lift shaft rail */}
            <line x1={232} x2={232} y1={TOP} y2={yOf(MIN) + ROW} stroke="var(--datum-navy)" strokeWidth={1} />
          </svg>

          {/* Shaft hit area + brass carriage (the slider) */}
          <div
            ref={shaftRef}
            className="absolute inset-y-0 end-0 w-[20%] cursor-ns-resize touch-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div
              role="slider"
              tabIndex={0}
              aria-labelledby={titleId}
              aria-orientation="vertical"
              aria-valuemin={MIN}
              aria-valuemax={MAX}
              aria-valuenow={level}
              aria-valuetext={valueText}
              onKeyDown={onKey}
              className={cn(
                "plaque absolute flex h-11 w-[3.25rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center !p-0 transition-[top] duration-200 ease-[var(--ease-lift)]",
                dragging && "duration-0",
              )}
              style={{
                top: `${carriageTop}%`,
                left: `${((232 / W - 0.8) / 0.2) * 100}%`,
                ["--chamfer" as string]: "6px",
                ["--plaque-line" as string]: "var(--brass)",
                ["--plaque-fill" as string]: "var(--lacquer)",
              }}
            >
              <span className="t-level text-sm text-brass">{levelCode(level)}</span>
            </div>
          </div>
        </div>
        <p id={titleId} className="t-label mt-5 text-center text-ivory-muted">
          Tower C section. Drag the lift, tap a floor, or use arrow keys.
        </p>
      </div>

      {/* Readout panel */}
      <div className="lg:col-span-7">
        <div className="flex items-end gap-6 border-b border-datum-navy pb-6">
          <p className="t-numeral text-[clamp(5rem,3rem+8vw,9rem)] text-brass" aria-hidden>
            {level <= 5 ? levelCode(level) : String(level).padStart(2, "0")}
          </p>
          <div className="pb-3">
            <p className="t-label text-accent-on-navy">{band.code}</p>
            <h3 className="t-h3 mt-1 text-ivory">{band.name}</h3>
          </div>
        </div>

        <p className="t-body mt-6 text-ivory-muted">{band.summary}</p>
        {band.points.length ? (
          <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
            {band.points.map((p) => (
              <li key={p} className="flex gap-3 border-t border-datum-navy py-3 text-sm text-ivory">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 bg-brass" />
                {p}
              </li>
            ))}
          </ul>
        ) : null}

        {table ? (
          <div className="mt-8">
            <p className="t-label text-ivory-muted">
              {table.title} · {table.floors}
            </p>
            <table className="mt-3 w-full text-sm">
              <caption className="sr-only">
                Residences on {valueText}. RERA carpet area in square feet.
              </caption>
              <thead>
                <tr className="t-label text-start text-[0.64rem] text-ivory-muted">
                  <th scope="col" className="py-2 text-start font-medium">Unit</th>
                  <th scope="col" className="py-2 text-start font-medium">Config</th>
                  <th scope="col" className="py-2 text-end font-medium">RERA carpet</th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((r) => (
                  <tr key={r.unit} className="border-t border-datum-navy">
                    <td className="t-level py-2.5 text-brass">{r.unit}</td>
                    <td className="py-2.5 text-ivory">{r.config}</td>
                    <td className="py-2.5 text-end tabular-nums text-ivory">{formatArea(r.carpet)} sq ft</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {band.kind === "terrace" && above ? (
          <p className="t-body mt-8 text-ivory-muted">
            <span className="t-label me-2 text-brass">Above</span>
            {above.body}
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={enquireHref} className="t-label inline-flex min-h-[52px] items-center gap-3 bg-ivory px-6 text-navy hover:bg-travertine-2">
            {band.kind === "residential" || band.kind === "terrace" ? `Enquire about level ${level}` : "Ask the sales team"}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
          <a href="#residences" className="t-label inline-flex min-h-[52px] items-center px-2 text-ivory hover:text-brass">
            All residences
          </a>
        </div>
      </div>
    </div>
  );
}
