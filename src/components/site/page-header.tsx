import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DatumLine, slugify } from "./level-section";
import { Reveal, SplitText } from "./reveal";

/**
 * Inner-page opening: lacquer band with the level code, an H1 whose words rise into place, and a lede.
 * Kept compact so the first floor of content shows on a short laptop screen.
 */
export function PageHeader({
  level,
  label,
  title,
  lede,
  meta = "Rubics Realty, Mumbai",
  titleClassName,
  children,
}: {
  level: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  meta?: string;
  titleClassName?: string;
  children?: ReactNode;
}) {
  const name = label.split(" · ")[0];
  return (
    <section id={slugify(name)} tabIndex={-1} data-level={level} data-label={name} className="on-lacquer grain relative outline-none">
      <div className="frame pb-12 pt-10 lg:pb-16 lg:pt-14">
        <DatumLine level={level} label={label} meta={meta} />
        <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:items-end">
          <h1 className={cn("t-display lg:col-span-8", titleClassName)}>{typeof title === "string" ? <SplitText delay={100}>{title}</SplitText> : title}</h1>
          {lede ? (
            <Reveal delay={350} className="t-lead text-ivory-muted lg:col-span-4">
              {lede}
            </Reveal>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
