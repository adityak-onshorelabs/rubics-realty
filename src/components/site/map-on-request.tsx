"use client";

/**
 * Adapted from Watermelon `view-on-map` (reference/watermelon/view-on-map.tsx).
 * Changes: the Google iframe loads only after the visitor asks (no third-party request on page load);
 * stock background image removed (we show the project's own location plan instead); focus moves to the
 * map region on open and back to the trigger on close; square brass-ruled frame instead of rounded card.
 */
import { useRef, useState, type ReactNode } from "react";
import { MapPin, X } from "lucide-react";

export function MapOnRequest({ query, label, children }: { query: string; label: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const region = useRef<HTMLDivElement>(null);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <div className="relative">
      {open ? (
        <div ref={region} tabIndex={-1} role="region" aria-label={`Map: ${label}`} className="relative aspect-[4/3] w-full bg-travertine-2 outline-none">
          <iframe
            title={`Google map of ${label}`}
            src={src}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              requestAnimationFrame(() => trigger.current?.focus());
            }}
            className="t-label absolute end-3 top-3 inline-flex min-h-11 items-center gap-2 bg-lacquer px-4 text-ivory"
          >
            <X aria-hidden className="size-4" /> Close map
          </button>
        </div>
      ) : (
        <>
          {children}
          <button
            ref={trigger}
            type="button"
            onClick={() => {
              setOpen(true);
              requestAnimationFrame(() => region.current?.focus());
            }}
            className="t-label mt-4 inline-flex min-h-[52px] items-center gap-3 border border-current px-6 transition-colors hover:bg-navy hover:text-ivory"
          >
            <MapPin aria-hidden className="size-4" />
            Open in Google Maps
          </button>
          <p className="mt-2 text-xs opacity-70">Loads a Google map. Google may set cookies.</p>
        </>
      )}
    </div>
  );
}
