import type { CSSProperties } from "react";

type View = { dir: string; body: string };

/**
 * Orientation key for the views: a site compass with the tower at its centre, the published outlooks marked
 * as sectors (West, North) and an elevation arrow for "Above". Only the directions the copy describes are drawn;
 * the landmark notes come from the same copy. Lines draw on as it scrolls into view.
 */
export function OrientationDiagram({ views, storeys }: { views: View[]; storeys: string }) {
  const has = (d: string) => views.some((v) => v.dir === d);
  const C = 160;
  const R = 118;
  // Sector path between two compass bearings (0 = north, clockwise)
  const pt = (deg: number, r: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
  };
  const sector = (from: number, to: number, r: number) => {
    const [x1, y1] = pt(from, r);
    const [x2, y2] = pt(to, r);
    return `M ${C} ${C} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
  };
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  const i = (n: number) => ({ ["--i" as string]: n }) as CSSProperties;

  return (
    <figure suppressHydrationWarning data-reveal="draw" className="relative mx-auto w-full max-w-[22rem]">
      <svg viewBox="0 0 320 320" className="h-auto w-full overflow-visible text-ivory" aria-hidden>
        {/* Sectors for the published outlooks */}
        {has("West") ? <path d={sector(235, 305, R)} className="draw-fade fill-accent-on-navy/20" style={i(2)} /> : null}
        {has("North") ? <path d={sector(-35, 35, R)} className="draw-fade fill-ivory/10" style={i(3)} /> : null}

        {/* Rings */}
        <circle className="draw" pathLength={1} cx={C} cy={C} r={R} fill="none" stroke="var(--datum-navy)" strokeWidth={1} />
        <circle className="draw" pathLength={1} cx={C} cy={C} r={R + 14} fill="none" stroke="var(--brass)" strokeOpacity={0.6} strokeWidth={0.75} style={i(1)} />
        {ticks.map((t) => {
          const major = t % 90 === 0;
          const [x1, y1] = pt(t, R + 14);
          const [x2, y2] = pt(t, R + (major ? 4 : 9));
          return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--brass)" strokeOpacity={major ? 1 : 0.45} strokeWidth={major ? 1.25 : 0.6} className="draw-fade" style={i(1)} />;
        })}

        {/* Bearings */}
        {(
          [
            ["N", 0],
            ["E", 90],
            ["S", 180],
            ["W", 270],
          ] as const
        ).map(([l, d]) => {
          const [x, y] = pt(d, R + 30);
          return (
            <text key={l} x={x} y={y + 3.5} textAnchor="middle" className="draw-fade fill-brass" style={{ fontSize: 11, fontVariationSettings: '"wdth" 125', letterSpacing: "0.12em", ...i(2) }}>
              {l}
            </text>
          );
        })}

        {/* Sight lines from the tower */}
        {has("West") ? <line className="draw" pathLength={1} x1={C} y1={C} x2={pt(270, R)[0]} y2={pt(270, R)[1]} stroke="var(--accent-on-navy)" strokeWidth={1.25} style={i(3)} /> : null}
        {has("North") ? <line className="draw" pathLength={1} x1={C} y1={C} x2={pt(0, R)[0]} y2={pt(0, R)[1]} stroke="var(--ivory)" strokeOpacity={0.7} strokeWidth={1} style={i(4)} /> : null}

        {/* Tower footprint at the centre, with the "Above" elevation arrow */}
        <rect x={C - 9} y={C - 9} width={18} height={18} fill="var(--lacquer)" stroke="var(--brass)" strokeWidth={1.25} />
        {has("Above") ? (
          <g className="draw-fade" style={i(4)}>
            <path d={`M ${C} ${C - 12} V ${C - 52}`} stroke="var(--brass)" strokeWidth={1} />
            <path d={`M ${C - 5} ${C - 44} L ${C} ${C - 54} L ${C + 5} ${C - 44}`} fill="none" stroke="var(--brass)" strokeWidth={1} />
          </g>
        ) : null}

        {/* Notes */}
        {has("West") ? (
          <text x={pt(270, R - 46)[0]} y={C + 24} textAnchor="middle" className="draw-fade fill-ivory" style={{ fontSize: 8.5, fontVariationSettings: '"wdth" 112', letterSpacing: "0.12em", ...i(4) }}>
            ARABIAN SEA
          </text>
        ) : null}
        {has("North") ? (
          <text x={C + 8} y={pt(0, R - 30)[1]} className="draw-fade fill-ivory" style={{ fontSize: 8.5, fontVariationSettings: '"wdth" 112', letterSpacing: "0.12em", ...i(5) }}>
            THE CITY
          </text>
        ) : null}
        {has("Above") ? (
          <text x={C + 10} y={C - 40} className="draw-fade fill-brass" style={{ fontSize: 8.5, fontVariationSettings: '"wdth" 112', letterSpacing: "0.12em", ...i(5) }}>
            {storeys.toUpperCase()}
          </text>
        ) : null}
      </svg>
      <figcaption className="t-note mt-4 text-center text-ivory-muted">Orientation key. Not to scale.</figcaption>
    </figure>
  );
}
