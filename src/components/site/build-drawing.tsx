"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Figure, ImageAsset } from "@/content/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The elevation sketch as the section's centrepiece: a full-height drawing sheet that stays in view while the
 * principles scroll past. As the section arrives, the tower is drawn in from the ground up, the dimension
 * string extends with it and the storey count climbs to the published figure, all scrubbed to scroll.
 * Server-rendered complete; under reduced motion it simply stays complete.
 */
export function BuildDrawing({
  image,
  storeys,
  facts,
  title,
}: {
  image: ImageAsset;
  /** Published storey count, e.g. "41". */
  storeys: string;
  /** Facts for the title block (first three are shown). */
  facts: Figure[];
  title: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const total = Number(storeys) || 0;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        const section = el.closest("section") ?? el;
        const counter = el.querySelector<HTMLElement>("[data-count]");
        const state = { n: 0 };
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 75%", end: "top -15%", scrub: 0.6 },
        });
        tl.fromTo(el.querySelector("[data-rise]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
          .fromTo(el.querySelector("[data-dim]"), { scaleY: 0 }, { scaleY: 1, ease: "none" }, 0)
          .fromTo(el.querySelectorAll("[data-tick]"), { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.25, ease: "none" }, 0.1)
          .fromTo(
            state,
            { n: 0 },
            {
              n: total,
              ease: "none",
              onUpdate: () => {
                if (counter) counter.textContent = String(Math.round(state.n)).padStart(2, "0");
              },
            },
            0,
          );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="lg:sticky lg:top-[calc(var(--header-h)+1.25rem)]">
      <figure className="relative">
        <span aria-hidden className="plate-crop" />
        <div className="flex h-[min(80svh,44rem)] flex-col border border-datum bg-[var(--paper)] lg:h-[calc(100svh-var(--header-h)-4.5rem)]">
          {/* Sheet header */}
          <div className="t-note flex items-center justify-between gap-4 border-b border-datum px-4 py-2.5 text-graphite-muted sm:px-5">
            <span>
              <span className="text-brass-deep">Pl. 01</span> · Elevation
            </span>
            <span className="truncate max-sm:hidden">{title}</span>
            <span>Not to scale</span>
          </div>

          {/* Drawing */}
          <div className="relative flex min-h-0 flex-1 items-end justify-center px-12 pb-7 pt-6 sm:px-16">
            <div className="relative h-full max-w-full" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
              {/* The sheet is the sketch's own paper colour, so the drawing sits on it seamlessly (no blend) */}
              <div data-rise className="absolute inset-0">
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-contain object-bottom" />
              </div>

              {/* Dimension string, top of tower to ground */}
              <div aria-hidden className="absolute -end-9 bottom-[3%] top-[1%] w-4 text-brass-deep">
                <span data-dim className="absolute inset-y-0 start-1/2 w-px origin-bottom bg-current" />
                <span data-tick className="absolute start-0 top-0 h-px w-4 bg-current" />
                <span data-tick className="absolute bottom-0 start-0 h-px w-4 bg-current" />
                <span className="t-note absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap bg-[var(--paper)] px-1.5">
                  {storeys} storeys
                </span>
              </div>

              {/* Ground datum */}
              <div aria-hidden className="absolute -inset-x-8 bottom-[3%] h-px bg-brass-deep/70" />
              <span aria-hidden className="t-note absolute -bottom-4 -start-8 text-brass-deep">
                ±0.00
              </span>
            </div>
          </div>

          {/* Title block */}
          <dl className="tblock grid-cols-3 border-b-0 bg-travertine-2/60">
            <div>
              <dt className="t-note text-graphite-muted">Storeys</dt>
              <dd className="t-numeral mt-1 text-[clamp(1.9rem,1.4rem+1.2vw,2.75rem)] text-brass-deep">
                <span className="sr-only">{storeys}</span>
                <span aria-hidden data-count>
                  {storeys}
                </span>
              </dd>
            </div>
            {facts.slice(1, 3).map((f) => (
              <div key={f.label}>
                <dt className="t-note text-graphite-muted">{f.label}</dt>
                <dd className="t-numeral mt-1 text-[clamp(1.9rem,1.4rem+1.2vw,2.75rem)]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </figure>
    </div>
  );
}
