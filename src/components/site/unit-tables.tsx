"use client";

import { useState } from "react";
import type { UnitTable } from "@/content/types";
import { formatArea } from "@/lib/site";
import { LevelTabs } from "./level-tabs";

/** RERA carpet tables by floor type. Tabs are the adapted continuous-tabs (LevelTabs). */
export function UnitTables({ tables, note, showSaleable = true }: { tables: UnitTable[]; note: string; showSaleable?: boolean }) {
  const [active, setActive] = useState(tables[0].id);
  const table = tables.find((t) => t.id === active)!;
  const codes: Record<string, string> = { typical: "L08–38", jodi: "L08–38", upper: "L39–41" };

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
          <table className="w-full min-w-[36rem] text-sm">
            <caption className="t-label pb-4 text-start text-graphite-muted">
              {table.title} · {table.floors} · areas in sq ft
            </caption>
            <thead>
              <tr className="t-label text-[0.64rem] text-graphite-muted">
                <th scope="col" className="py-3 pe-4 text-start font-medium">Unit</th>
                <th scope="col" className="py-3 pe-4 text-start font-medium">Configuration</th>
                <th scope="col" className="py-3 pe-4 text-end font-medium">RERA carpet</th>
                <th scope="col" className="py-3 pe-4 text-end font-medium">{table.outdoorLabel}</th>
                {showSaleable ? <th scope="col" className="py-3 text-end font-medium">Saleable</th> : null}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {table.rows.map((r) => (
                <tr key={r.unit} className="border-t border-datum odd:bg-travertine-2/50">
                  <th scope="row" className="t-level py-3.5 pe-4 text-start font-medium text-accent-ink">
                    {r.unit}
                  </th>
                  <td className="py-3.5 pe-4">{r.config}</td>
                  <td className="py-3.5 pe-4 text-end font-medium">{formatArea(r.carpet)}</td>
                  <td className="py-3.5 pe-4 text-end">{formatArea(r.outdoor)}</td>
                  {showSaleable ? <td className="py-3.5 text-end text-graphite-muted">{formatArea(r.saleable)}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-graphite-muted">{note}</p>
      </div>
    </div>
  );
}
