"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/types";
import { cn } from "@/lib/utils";
import { ImpressionTag } from "./impression-tag";
import { LevelTabs } from "./level-tabs";

/**
 * Lobby directory: projects as brass-ruled rows. Hover/focus a row to preview its image.
 * Optional status filter (adapted continuous-tabs via LevelTabs).
 */
export function DirectoryBoard({ projects, filter = false }: { projects: Project[]; filter?: boolean }) {
  const [status, setStatus] = useState<string>("all");
  const [hovered, setHovered] = useState(projects[0]?.slug);
  const list = status === "all" ? projects : projects.filter((p) => p.status === status);
  const preview = projects.find((p) => p.slug === hovered) ?? projects[0];

  const tabs = [
    { id: "all", label: "All", count: projects.length },
    { id: "launched", label: "Now selling", count: projects.filter((p) => p.status === "launched").length },
    { id: "rising-soon", label: "Rising soon", count: projects.filter((p) => p.status === "rising-soon").length },
  ];

  return (
    <div className="frame grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        {filter ? (
          <LevelTabs
            tabs={tabs}
            active={status}
            onChange={setStatus}
            label="Filter projects by status"
            idBase="directory"
            className="mb-2"
          />
        ) : null}
        <div
          id={filter ? `directory-panel-${status}` : undefined}
          role={filter ? "tabpanel" : undefined}
          aria-labelledby={filter ? `directory-tab-${status}` : undefined}
        >
          <ol className="border-t border-border">
            {list.map((p) => {
              const i = projects.indexOf(p);
              return (
                <li key={p.slug} className={cn("border-b border-border", `accent-${p.accent}`)}>
                  <Link
                    href={`/projects/${p.slug}`}
                    onMouseEnter={() => setHovered(p.slug)}
                    onFocus={() => setHovered(p.slug)}
                    className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-4 gap-y-1 py-6 transition-colors hover:bg-navy-2/60 sm:grid-cols-[4rem_1fr_auto] sm:px-3 lg:py-8"
                  >
                    <span className="t-level text-brass" aria-hidden>
                      L{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="t-h2 block">{p.nameDisplay}</span>
                      <span className="mt-2 block text-ivory-muted">
                        {p.name !== p.nameDisplay ? `${p.name.replace(p.nameDisplay, "").trim()} · ` : ""}
                        {p.locality}, {p.city}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-6 self-center text-brass transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                    <span className="col-start-2 col-end-4 mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                      <span className="t-label text-accent-on-navy">{p.statusLabel}</span>
                      {p.rera ? (
                        <span className="t-level text-ivory-muted">MahaRERA {p.rera.number}</span>
                      ) : (
                        <span className="t-level text-ivory-muted">Registration details on launch</span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {preview ? (
        <div className="relative hidden lg:col-span-5 lg:block" aria-hidden>
          <div className="sticky top-[calc(var(--header-h)+2rem)]">
            <div className="relative aspect-[4/5] overflow-hidden bg-lacquer">
              {projects.map((p) => (
                <Image
                  key={p.slug}
                  src={(p.sketch && p.status !== "launched" ? p.sketch : p.hero).src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 38vw, 0px"
                  className={cn(
                    "transition-opacity duration-500",
                    p.status === "launched" ? "object-cover" : "bg-travertine object-contain p-6",
                    p.slug === preview.slug ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
              {preview.hero.impression && preview.status === "launched" ? <ImpressionTag /> : null}
            </div>
            <p className="mt-4 text-sm text-ivory-muted">{preview.oneLine}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
