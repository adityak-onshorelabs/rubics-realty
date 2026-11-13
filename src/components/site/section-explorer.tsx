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
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Hand, MousePointerClick } from "lucide-react";
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

/** Short names for the stop buttons (the full band name shows in the readout). */
const stopName: Partial<Record<ExplorerLevel["kind"], string>> = { terrace: "Crown", residential: "Residences", amenity: "E-Deck" };

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
  // Discoverability: the lift demonstrates itself once, and the carriage carries a drag cue until the visitor
  // has used any control (drag, tap, key or stop button).
  const [touched, setTouched] = useState(false);
  const [riding, setRiding] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const shaftRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const rideRaf = useRef(0);
  const levelRef = useRef(level);
  useEffect(() => {
    levelRef.current = level;
  }, [level]);
  const titleId = useId();

  const stopRide = useCallback(() => {
    cancelAnimationFrame(rideRaf.current);
    rideRaf.current = 0;
    setRiding(false);
  }, []);

  /** Ride the lift to a level floor by floor (eased), so jumps read as travel rather than a cut. */
  const rideTo = useCallback(
    (to: number, from?: number) => {
      cancelAnimationFrame(rideRaf.current);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setLevel(to);
        return;
      }
      let start = 0;
      const origin = from ?? levelRef.current;
      setLevel(origin);
      setRiding(true);
      const dist = Math.abs(to - origin) || 1;
      const ms = Math.min(1400, 260 + dist * 34);
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const frame = (now: number) => {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / ms);
        setLevel(Math.round(origin + (to - origin) * ease(t)));
        if (t < 1) rideRaf.current = requestAnimationFrame(frame);
        else {
          rideRaf.current = 0;
          setRiding(false);
        }
      };
      rideRaf.current = requestAnimationFrame(frame);
    },
    [],
  );

  const touch = useCallback(() => {
    setTouched(true);
    stopRide();
  }, [stopRide]);

  // First time the explorer is properly in view: ride up from the ground to the starting floor.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        rideTo(initial, 0);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(rideRaf.current);
    };
  }, [initial, rideTo]);

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
    touch();
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
    if (e.key in step || e.key === "Home" || e.key === "End") touch();
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
    <div ref={rootRef} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Drawing + lift shaft */}
      <div className="lg:col-span-5">
        {/* Width follows the viewport height too, so the whole tower fits on a short laptop screen */}
        <div
          className="relative mx-auto w-full max-w-[min(22rem,calc((100svh-var(--header-h)-8rem)*0.565))] max-lg:max-w-[22rem]"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
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
                <g
                  key={l}
                  onClick={() => {
                    touch();
                    setLevel(l);
                  }}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(l)}
                  onPointerLeave={() => setHovered(null)}
                  className="cursor-pointer"
                >
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
            {/* Hovered floor: brass outline and its level code at the left, so floors read as clickable */}
            {hovered !== null && hovered !== level ? (
              <g pointerEvents="none">
                <rect
                  x={shape(hovered).x - 1}
                  y={yOf(hovered) + 0.2}
                  width={shape(hovered).w + 2}
                  height={ROW - 0.4}
                  fill="none"
                  stroke="var(--brass)"
                  strokeWidth={0.9}
                />
                <rect x={2} y={yOf(hovered) + 1} width={26} height={ROW - 2} className="fill-navy" />
                <text
                  x={26}
                  y={yOf(hovered) + ROW - 2}
                  textAnchor="end"
                  className="fill-brass"
                  style={{ fontSize: 7, fontVariationSettings: '"wdth" 75', fontVariantNumeric: "tabular-nums" }}
                >
                  {levelCode(hovered)}
                </text>
              </g>
            ) : null}
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
                (dragging || riding) && "duration-0",
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
            {/* Drag cue until first use (outside the clipped plaque): a pulsing ring and chevrons above and below */}
            {!touched ? (
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute h-11 w-[3.25rem] -translate-x-1/2 -translate-y-1/2 transition-[top] duration-200 ease-[var(--ease-lift)]",
                  (dragging || riding) && "duration-0",
                )}
                style={{ top: `${carriageTop}%`, left: `${((232 / W - 0.8) / 0.2) * 100}%` }}
              >
                <span className="explorer-ping absolute -inset-1.5 border border-brass" />
                <svg width="12" height="8" viewBox="0 0 12 8" className="explorer-bob-up absolute -top-4 left-1/2 -translate-x-1/2 fill-brass">
                  <path d="M6 0l6 8H0z" />
                </svg>
                <svg width="12" height="8" viewBox="0 0 12 8" className="explorer-bob-down absolute -bottom-4 left-1/2 -translate-x-1/2 rotate-180 fill-brass">
                  <path d="M6 0l6 8H0z" />
                </svg>
                {/* Coach mark: an explicit callout pinned above the carriage, right-aligned so it stays inside the drawing */}
                {!riding ? (
                  <span className="explorer-coach absolute bottom-[calc(100%+1.6rem)] end-0 flex items-center gap-2 whitespace-nowrap bg-brass px-3 py-2 text-lacquer">
                    <Hand className="explorer-hand size-4" strokeWidth={1.75} />
                    <span className="t-label text-[0.6rem]">Drag the lift</span>
                    {/* pointer down to the carriage */}
                    <span className="absolute -bottom-1.5 end-5 size-3 rotate-45 bg-brass" />
                  </span>
                ) : null}
              </span>
            ) : null}
          </div>
        </div>
        <p id={titleId} className="sr-only">
          Tower C section. Drag the lift, tap a floor, choose a stop, or use the arrow keys.
        </p>
        <div aria-hidden className="mx-auto mt-7 grid max-w-[22rem] grid-cols-2 border-y border-datum-navy">
          <span className="t-note flex items-center gap-2.5 py-3 text-ivory-muted">
            <Hand className="size-4 shrink-0 text-brass" strokeWidth={1.5} />
            Drag the brass lift
          </span>
          <span className="t-note flex items-center gap-2.5 border-s border-datum-navy py-3 ps-4 text-ivory-muted">
            <MousePointerClick className="size-4 shrink-0 text-brass" strokeWidth={1.5} />
            Tap any floor
          </span>
        </div>
      </div>

      {/* Readout panel */}
      <div className="min-w-0 lg:col-span-7">
        {/* Stops: explicit lift buttons for every band, the obvious way in */}
        <div className="mb-8">
          <p className="t-note mb-3 text-ivory-muted">Jump to a stop</p>
          <ul className="no-scrollbar scroll-hint -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" data-lenis-prevent>
            {[...levels].map((b) => {
              const active = b === band;
              const stop = b.unitTableId === "typical" ? initial : b.to;
              return (
                <li key={b.code} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      touch();
                      rideTo(stop);
                    }}
                    className={cn(
                      "group flex min-h-11 items-center gap-2.5 border px-3.5 transition-colors duration-300",
                      active ? "border-brass bg-brass text-lacquer" : "border-datum-navy text-ivory hover:border-brass",
                    )}
                  >
                    <span className={cn("t-level text-[0.8rem]", active ? "text-lacquer" : "text-brass")}>{b.code}</span>
                    <span className="t-label text-[0.6rem]">{stopName[b.kind] ?? b.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex items-end gap-6 border-b border-datum-navy pb-6">
          <p className="t-numeral text-[clamp(4.5rem,min(3rem+8vw,1rem+12svh),9rem)] text-brass" aria-hidden>
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
