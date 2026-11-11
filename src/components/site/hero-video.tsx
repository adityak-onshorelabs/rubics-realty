"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Background video over a server-rendered poster (the poster is the LCP image, rendered by the parent).
 * Loads once (the old site fetched the 3.9 MB file twice), picks a portrait crop on narrow screens,
 * and never plays when the visitor prefers reduced motion or has data saver on.
 */
export function HeroVideo({ desktop, mobile, className }: { desktop: string; mobile: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    // Deferred so the poster paints first.
    const id = window.setTimeout(() => setSrc(narrow ? mobile : desktop), 300);
    return () => window.clearTimeout(id);
  }, [desktop, mobile]);

  return src ? (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  ) : null;
}
