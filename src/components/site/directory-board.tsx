"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/types";
import { cn } from "@/lib/utils";
import { ImpressionTag } from "./impression-tag";
import { LevelTabs } from "./level-tabs";

const previewOf = (p: Project) => (p.status === "launched" ? p.hero : (p.sketch ?? p.hero));

/**
 * Lobby directory: projects as full-width brass-ruled rows with tall condensed names. Each row carries its
 * own image in place (a large plate on small screens, a thumbnail column on wide ones), so nothing floats
 * over the content. Optional status filter (adapted continuous-tabs via LevelTabs).
 */
export function DirectoryBoard({ projects, filter = false }: { projects: Project[]; filter?: boolean }) {
  const [status, setStatus] = useState<string>("all");
  const list = status === "all" ? projects : projects.filter((p) => p.status === status);

  const tabs = [
    { id: "all", label: "All", count: projects.length },
    { id: "launched", label: "Now selling", count: projects.filter((p) => p.status === "launched").length },
    { id: "rising-soon", label: "Rising soon", count: projects.filter((p) => p.status === "rising-soon").length },
  ];

  return (
    <div className="frame">
      {filter ? (
        <LevelTabs tabs={tabs} active={status} onChange={setStatus} label="Filter projects by status" idBase="directory" className="mb-2" />
      ) : null}
      <div
        id={filter ? `directory-panel-${status}` : undefined}
        role={filter ? "tabpanel" : undefined}
        aria-labelledby={filter ? `directory-tab-${status}` : undefined}
      >
        <ol suppressHydrationWarning data-reveal="stagger" className="border-t border-border">
          {list.map((p, k) => {
            const i = projects.indexOf(p);
            const img = previewOf(p);
            const launched = p.status === "launched";
            return (
              <li key={p.slug} style={{ ["--i" as string]: k } as CSSProperties} className={cn("border-b border-border", `accent-${p.accent}`)}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="group relative grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-4 py-6 sm:grid-cols-[4rem_minmax(0,1fr)_auto] lg:grid-cols-[3.5rem_clamp(8rem,11vw,11rem)_minmax(0,1.3fr)_minmax(0,1fr)_auto] lg:gap-x-8 lg:py-[clamp(1.25rem,0.25rem+2.5svh,2.25rem)]"
                >
                  {/* Hover wash slides in from the start edge */}
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-navy-2/70 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />

                  {/* Small screens: a full-width plate above the name */}
                  <span className="relative col-span-3 block aspect-[16/9] overflow-hidden bg-lacquer lg:hidden">
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 80vw, 92vw"
                      className={launched ? "object-cover" : "bg-travertine object-contain p-4"}
                    />
                    {img.impression ? <ImpressionTag /> : null}
                  </span>

                  <span className="t-level relative self-start pt-2 text-brass lg:self-center lg:pt-0" aria-hidden>
                    L{String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Wide screens: thumbnail column, in the row's own grid cell */}
                  <span aria-hidden className={cn("relative hidden aspect-[4/3] overflow-hidden lg:block", launched ? "bg-lacquer" : "bg-travertine")}>
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      sizes="11rem"
                      className={cn(
                        "transition-[scale] duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-110",
                        launched ? "object-cover" : "object-contain p-2 mix-blend-multiply",
                      )}
                    />
                  </span>

                  <span className="relative min-w-0">
                    <span className="t-board block transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3">
                      {p.nameDisplay}
                    </span>
                    <span className="mt-2 block text-ivory-muted lg:hidden">
                      {p.locality}, {p.city}
                    </span>
                  </span>

                  <span className="relative col-start-2 col-end-4 grid gap-1.5 text-sm lg:col-auto">
                    <span className="hidden text-ivory lg:block">
                      {p.name !== p.nameDisplay ? `${p.name.replace(p.nameDisplay, "").trim()}, ` : ""}
                      {p.locality}, {p.city}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
                      <span className="t-label text-accent-on-navy">{p.statusLabel}</span>
                      <span className="t-level text-ivory-muted">{p.rera ? `MahaRERA ${p.rera.number}` : "Registration details on launch"}</span>
                    </span>
                    {p.facts.length ? (
                      <span className="t-note mt-1 text-ivory-muted">
                        {p.facts
                          .slice(0, 2)
                          .map((f) => `${f.value} ${f.label}`)
                          .join("  ·  ")}
                      </span>
                    ) : null}
                  </span>

                  <span className="relative col-start-3 row-start-2 flex size-11 items-center justify-center self-start border border-brass/50 text-brass transition-colors duration-300 group-hover:border-brass group-hover:bg-brass group-hover:text-lacquer lg:col-auto lg:row-auto lg:size-14 lg:self-center">
                    <ArrowUpRight aria-hidden className="size-5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
