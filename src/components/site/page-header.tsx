import type { ReactNode } from "react";
import { DatumLine } from "./level-section";

/** Inner-page opening: navy band with level code, H1 and a lede. */
export function PageHeader({
  level,
  label,
  title,
  lede,
  children,
}: {
  level: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section data-level={level} className="on-lacquer grain">
      <div className="frame pb-16 pt-14 lg:pb-24 lg:pt-20">
        <DatumLine level={level} label={label} />
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <h1 className="t-display lg:col-span-8">{title}</h1>
          {lede ? <div className="t-lead self-end text-ivory-muted lg:col-span-4">{lede}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
