"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Film = {
  src: string | null;
  ready: boolean;
  playing: boolean;
  setReady: (v: boolean) => void;
  setPlaying: (v: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

const FilmContext = createContext<Film | null>(null);
const useFilm = () => {
  const f = useContext(FilmContext);
  if (!f) throw new Error("HeroFilm parts must sit inside <HeroFilm>");
  return f;
};

/**
 * Background film over a server-rendered poster (the poster is the LCP image, rendered by the parent).
 * Loads once, picks a portrait cut on narrow screens, and never plays when the visitor prefers reduced
 * motion or has data saver on. A visible pause control is required because the film loops (WCAG 2.2.2).
 */
export function HeroFilm({ desktop, mobile, children }: { desktop: string; mobile: string; children: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    // Deferred so the poster paints first.
    const id = window.setTimeout(() => setSrc(narrow ? mobile : desktop), 300);
    return () => window.clearTimeout(id);
  }, [desktop, mobile]);

  return (
    <FilmContext.Provider value={{ src, ready, playing, setReady, setPlaying, videoRef }}>{children}</FilmContext.Provider>
  );
}

export function HeroFilmVideo({ className }: { className?: string }) {
  const { src, ready, setReady, videoRef } = useFilm();
  return src ? (
    <video
      ref={videoRef}
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
        "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  ) : null;
}

export function HeroFilmToggle({ className }: { className?: string }) {
  const { src, ready, playing, setPlaying, videoRef } = useFilm();
  if (!src) return null;
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!ready}
      className={cn(
        "group t-label inline-flex min-h-11 items-center gap-2.5 text-[0.62rem] text-ivory/80 transition-[opacity,color] duration-500 hover:text-ivory disabled:opacity-0",
        className,
      )}
    >
      <span className="flex size-7 items-center justify-center border border-ivory/35 transition-colors group-hover:border-ivory">
        {playing ? <Pause aria-hidden className="size-3" /> : <Play aria-hidden className="size-3" />}
      </span>
      {playing ? "Pause film" : "Play film"}
    </button>
  );
}
