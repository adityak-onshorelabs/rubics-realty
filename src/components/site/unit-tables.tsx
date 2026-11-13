"use client";

import { useState, type CSSProperties } from "react";
import type { UnitTable } from "@/content/types";
import { formatArea } from "@/lib/site";
import { LevelTabs } from "./level-tabs";

/**
 * RERA carpet tables by floor type. Tabs are the adapted continuous-tabs (LevelTabs).
 * Each row carries a scale bar drawn to the largest home in the tower: carpet in the project accent,
 * balcony/terrace as a hatched extension, so relative size reads before the numbers do.
 */
export function UnitTables({ tables, note, showSaleable = true }: { tables: UnitTable[]; note: string; showSaleable?: boolean }) {
  const [active, setActive] = useState(tables[0].id);
  const table = tables.find((t) => t.id === active)!;
  const codes: Record<string, string> = { typical: "L08–38", jodi: "L08–38", upper: "L39–41" };
  const max = Math.max(...tables.flatMap((t) => t.rows.map((r) => r.carpet + r.outdoor)));

  return (
    <div>
      <LevelTabs
        tabs={tables.map((t) => ({ id: t.id, label: t.title, code: codes[t.id] }))}
        active={active}
        onChange={setActive}
        label="Residence types"
        idBase="units"
      />
      <div id={`units-panel-${table.id}`} role="tabpanel" aria-labelledby={`units-tab-${table.id}`} tabIndex={0} className="pt-6 outline-none">
        <div className="-mx-4 overflow-x-auto px-4">
          <table className="w-full text-sm sm:min-w-[38rem]">
            <caption className="t-label pb-4 text-start leading-relaxed text-graphite-muted">
              {table.title} · {table.floors} · areas in sq ft
            </caption>
            <thead>
              <tr className="t-label text-[0.64rem] text-graphite-muted">
                <th scope="col" className="py-3 pe-4 text-start font-medium">Unit</th>
                <th scope="col" className="py-3 pe-4 text-start font-medium"><span className="sm:hidden">Config</span><span className="max-sm:hidden">Configuration</span></th>
                <th scope="col" className="hidden w-[28%] py-3 pe-6 text-start font-medium md:table-cell">
                  <span aria-hidden>Scale</span>
                  <span className="sr-only">Relative size</span>
                </th>
                <th scope="col" className="py-3 pe-4 text-end font-medium">RERA carpet</th>
                <th scope="col" className="py-3 pe-4 text-end font-medium">{table.outdoorLabel}</th>
                {showSaleable ? <th scope="col" className="hidden py-3 text-end font-medium sm:table-cell">Saleable</th> : null}
              </tr>
            </thead>
            <tbody key={table.id} className="tabular-nums">
              {table.rows.map((r, i) => (
                <tr key={r.unit} className="group border-t border-datum transition-colors hover:bg-travertine-2/70">
                  <th scope="row" className="t-level py-3.5 pe-4 text-start font-medium text-accent-ink">
                    {r.unit}
                  </th>
                  <td className="py-3.5 pe-4">{r.config}</td>
                  <td aria-hidden className="hidden py-3.5 pe-6 md:table-cell">
                    <span className="flex h-2 items-center">
                      <span
                        className="unit-bar h-full bg-accent-ink"
                        style={{ width: `${(r.carpet / max) * 100}%`, ["--i" as string]: i } as CSSProperties}
                      />
                      <span
                        className="unit-bar h-full bg-[repeating-linear-gradient(-45deg,var(--accent-ink)_0_1px,transparent_1px_4px)] opacity-80"
                        style={{ width: `${(r.outdoor / max) * 100}%`, ["--i" as string]: i } as CSSProperties}
                      />
                    </span>
                  </td>
                  <td className="py-3.5 pe-4 text-end font-medium">{formatArea(r.carpet)}</td>
                  <td className="py-3.5 pe-4 text-end">{formatArea(r.outdoor)}</td>
                  {showSaleable ? <td className="hidden py-3.5 text-end text-graphite-muted sm:table-cell">{formatArea(r.saleable)}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-graphite-muted">
          <span className="hidden items-center gap-2 md:inline-flex">
            <span aria-hidden className="inline-block h-2 w-5 bg-accent-ink" /> Carpet
            <span aria-hidden className="ms-3 inline-block h-2 w-5 bg-[repeating-linear-gradient(-45deg,var(--accent-ink)_0_1px,transparent_1px_4px)]" />{" "}
            {table.outdoorLabel}
          </span>
          <span>{note}</span>
        </p>
      </div>
    </div>
  );
}
