"use client";

/**
 * Page transition and loader: lift doors with a lobby floor indicator.
 *
 * On an internal link click, two lacquer doors (Deco inset panels, brass seam) slide shut. Over the seam sits
 * the indicator housing, a solid brass-framed panel, so the seam runs into its frame instead of through its
 * text. Inside: a lamp row of floors (G, 01, 02 ...) that lights floor by floor from where you are to where
 * you are going, a rolling readout with a direction arrow, and a journey hairline that fills as the lift
 * travels (the progress indicator). The route changes once the doors have met, and the doors open when the
 * new page has painted and the journey has arrived. If the next page is slow the doors stay shut, so this
 * doubles as the loading screen.
 *
 * Skipped for: same-page links (hash or query only), modified clicks (new tab/window), target="_blank",
 * downloads, external/tel/mailto links, and visitors who prefer reduced motion (navigation is untouched).
 * Next's router still does the navigation and focus/announcement.
 */
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { images, projects } from "@/content/en";
import { pressStories } from "@/content/press";
import { cn } from "@/lib/utils";
import { DOORS_OPEN_EVENT } from "./reveal-observer";

type Phase = "idle" | "closing" | "closed" | "opening";

const EASE = [0.65, 0, 0.35, 1] as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const CLOSE_MS = 650;
const OPEN_MS = 800;
/** Time per floor travelled, and the pause after the doors meet before the lift sets off. */
const STEP_MS = 150;
const DEPART_MS = 220;
/** Minimum time the doors stay shut, so the indicator can be read even when the next page is instant. */
const MIN_HOLD_MS = 700;
const FAILSAFE_MS = 8000;

const labels: Record<string, string> = {
  "/": "Home",
  "/projects": "Projects",
  "/about": "About Rubics",
  "/press": "Press",
  "/contact": "Contact",
  "/privacy": "Privacy policy",
  "/disclaimer": "Disclaimer",
};

/** Each page is a floor of the building. G is the lobby. */
const floorOrder = ["/", "/projects", "/projects/beaumonte-tower-c", "/projects/lalbaug", "/about", "/press", "/contact"];
function floorOf(pathname: string) {
  const exact = floorOrder.indexOf(pathname);
  return exact >= 0 ? exact : pathname.startsWith("/press/") ? floorOrder.indexOf("/press") : floorOrder.length;
}
const floorCode = (i: number) => (i === 0 ? "G" : String(i).padStart(2, "0"));

function destinationLabel(pathname: string) {
  if (labels[pathname]) return labels[pathname];
  const project = projects.find((p) => pathname === `/projects/${p.slug}`);
  if (project) return project.name;
  if (pathname.startsWith("/press/")) {
    return pressStories.find((s) => pathname === `/press/${s.slug}`) ? "Press" : "Rubics Realty";
  }
  return "Rubics Realty";
}

export function LiftDoors() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const [trip, setTrip] = useState({ from: 0, to: 0 });
  const [shown, setShown] = useState(0);
  const target = useRef<string | null>(null);
  const pendingHref = useRef<string | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const failsafe = useRef<number>(0);
  const closedAt = useRef(0);
  const holdMs = useRef(MIN_HOLD_MS);

  const set = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
    // While shut, the arriving page's scroll reveals wait (RevealObserver), then play as the doors part.
    const root = document.documentElement;
    if (p === "closing" || p === "closed") root.dataset.doors = p;
    else {
      delete root.dataset.doors;
      if (p === "opening") window.dispatchEvent(new Event(DOORS_OPEN_EVENT));
    }
  }, []);

  // Once the doors have met, the lift travels: one floor per step, lamps lighting in turn.
  useEffect(() => {
    if (phase !== "closed" || trip.from === trip.to) return;
    const dir = Math.sign(trip.to - trip.from);
    let id = 0;
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        setShown((s) => {
          const next = s + dir;
          if (next === trip.to) window.clearInterval(id);
          return next;
        });
      }, STEP_MS);
    }, DEPART_MS);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, [phase, trip]);

  // Intercept internal link clicks before Next's <Link> handler (capture phase on document).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // hash/query-only: let Next/native handle it
      if (url.pathname.startsWith("/api/") || /\.[a-z0-9]+$/i.test(url.pathname)) return; // files, API
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (phaseRef.current !== "idle") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      // A modal dialog (mobile menu) sits in the top layer above everything; close it so the doors are visible.
      document.querySelectorAll<HTMLDialogElement>("dialog[open]").forEach((d) => d.close());

      const from = floorOf(location.pathname);
      const to = floorOf(url.pathname);
      target.current = url.pathname;
      setLabel(destinationLabel(url.pathname));
      setTrip({ from, to });
      setShown(from);
      // Hold long enough for the journey to finish, and never less than the minimum.
      holdMs.current = Math.max(MIN_HOLD_MS, DEPART_MS + Math.abs(to - from) * STEP_MS + 320);
      // Navigation starts when the doors have actually met (onAnimationComplete below), never on a timer,
      // so the next page can't flash through the seam.
      pendingHref.current = url.pathname + url.search + url.hash;
      set("closing");
      // Never leave the doors shut if navigation fails.
      window.clearTimeout(failsafe.current);
      failsafe.current = window.setTimeout(() => {
        if (phaseRef.current === "closed" || phaseRef.current === "closing") set("opening");
      }, FAILSAFE_MS);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [set]);

  // Open once the destination route has rendered (two frames so the new page paints behind the doors)
  // and the journey has arrived.
  useEffect(() => {
    if (phaseRef.current !== "closed") return;
    if (target.current && pathname !== target.current) return;
    let id1 = 0;
    let id2 = 0;
    const wait = Math.max(0, holdMs.current - (performance.now() - closedAt.current));
    const t = window.setTimeout(() => {
      id1 = requestAnimationFrame(() => {
        id2 = requestAnimationFrame(() => {
          window.clearTimeout(failsafe.current);
          set("opening");
        });
      });
    }, wait);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [pathname, phase, set]);

  const shut = phase === "closing" || phase === "closed";
  const visible = phase !== "idle";
  const dir = Math.sign(trip.to - trip.from);
  const arrived = shown === trip.to;
  const travelling = phase === "closed" && !arrived;
  const steps = Math.abs(trip.to - trip.from);
  const lamps = Array.from({ length: Math.max(7, trip.from + 1, trip.to + 1) }, (_, i) => i);
  // Journey progress for the hairline: 0 at the start floor, 1 on arrival.
  const progress = steps === 0 ? (phase === "closed" ? 1 : 0) : Math.abs(shown - trip.from) / steps;

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {shut ? `Loading ${label}` : ""}
      </div>
      <AnimatePresence>
        {visible ? (
          <div key="doors" aria-hidden className="pointer-events-auto fixed inset-0 z-[60] overflow-hidden">
            {(["left", "right"] as const).map((side) => (
              <motion.div
                key={side}
                className={cn("on-lacquer grain absolute inset-y-0 w-1/2", side === "left" ? "left-0" : "right-0")}
                initial={{ x: side === "left" ? "-100%" : "100%" }}
                animate={{ x: shut ? "0%" : side === "left" ? "-100%" : "100%" }}
                transition={{ duration: (shut ? CLOSE_MS : OPEN_MS) / 1000, ease: EASE }}
                onAnimationComplete={() => {
                  if (side !== "left") return;
                  if (phaseRef.current === "closing" && pendingHref.current) {
                    const href = pendingHref.current;
                    pendingHref.current = null;
                    closedAt.current = performance.now();
                    set("closed");
                    router.push(href);
                  } else if (phaseRef.current === "opening") {
                    target.current = null;
                    set("idle");
                  }
                }}
              >
                {/* Door leaf: inset Deco moulding and a brass kick rail, with depth toward the seam */}
                <span
                  className={cn(
                    "absolute inset-0",
                    side === "left"
                      ? "bg-[linear-gradient(to_right,transparent_55%,color-mix(in_oklch,var(--navy-2)_55%,transparent))]"
                      : "bg-[linear-gradient(to_left,transparent_55%,color-mix(in_oklch,var(--navy-2)_55%,transparent))]",
                  )}
                />
                <span className="absolute inset-[clamp(1rem,3.2vw,2.75rem)] border border-brass/15" />
                <span className="absolute inset-[calc(clamp(1rem,3.2vw,2.75rem)+0.5rem)] border border-brass/[0.07]" />
                <span className="absolute inset-x-[clamp(1rem,3.2vw,2.75rem)] bottom-[16%] h-[5px] border-y border-brass/25" />
                {/* Brass seam on the meeting edge */}
                <span className={cn("absolute inset-y-0 w-px bg-brass/60", side === "left" ? "right-0" : "left-0")} />
              </motion.div>
            ))}

            {/* Indicator housing: solid, centred over the seam, so the seam ends at its frame */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <motion.div
                className="plaque relative w-[min(27rem,100%)] !px-6 !pb-5 !pt-6 sm:!px-8"
                style={{
                  ["--chamfer" as string]: "12px",
                  ["--plaque-line" as string]: "var(--brass)",
                  ["--plaque-fill" as string]: "var(--lacquer)",
                }}
                initial={{ opacity: 0, y: 10, scale: 0.985 }}
                animate={shut ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -6, scale: 0.99 }}
                transition={shut ? { duration: 0.55, delay: 0.42, ease: EASE_OUT } : { duration: 0.22, ease: EASE }}
              >
                {/* Inner frame line, the indicator's bezel */}
                <span className="pointer-events-none absolute inset-[6px] border border-brass/20 [clip-path:polygon(8px_0,calc(100%-8px)_0,100%_8px,100%_calc(100%-8px),calc(100%-8px)_100%,8px_100%,0_calc(100%-8px),0_8px)]" />

                <div className="flex items-center justify-between">
                  <Image src={images.logo.src} alt="" width={154} height={32} className="h-[1.15rem] w-auto" style={{ width: "auto" }} />
                  <span className="t-note text-ivory-muted">Lift · Mumbai</span>
                </div>

                {/* Readout: direction arrow and the floor code, rolling as each floor passes */}
                <div className="mt-6 flex items-center gap-5">
                  <div className="flex w-5 flex-col items-center gap-1" aria-hidden>
                    {[1, -1].map((d) => (
                      <motion.svg
                        key={d}
                        width="14"
                        height="11"
                        viewBox="0 0 14 11"
                        className={cn("fill-current transition-colors duration-300", d === -1 && "rotate-180", dir === d ? "text-brass" : "text-datum-navy")}
                        animate={{ opacity: dir === d && travelling ? [1, 0.35, 1] : 1 }}
                        transition={{ duration: 0.9, repeat: travelling ? Infinity : 0 }}
                      >
                        <path d="M7 0l7 11H0z" />
                      </motion.svg>
                    ))}
                  </div>
                  <span className="relative block h-[3.6rem] w-[4.4rem] overflow-hidden">
                    <AnimatePresence initial={false}>
                      <motion.span
                        key={shown}
                        className="t-numeral absolute inset-0 flex items-center text-[3.6rem] text-brass"
                        initial={{ y: dir < 0 ? "-100%" : "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: dir < 0 ? "100%" : "-100%" }}
                        transition={{ duration: Math.min(0.32, STEP_MS / 1000 + 0.12), ease: EASE_OUT }}
                      >
                        {floorCode(shown)}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <div className="min-w-0 flex-1 border-s border-datum-navy ps-5">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.span
                        key={arrived && phase === "closed" ? "arrived" : "arriving"}
                        className="t-note block text-ivory-muted"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.25, ease: EASE_OUT }}
                      >
                        {arrived && phase === "closed" ? "Arrived" : "Arriving"}
                      </motion.span>
                    </AnimatePresence>
                    <span className="t-label mt-1.5 block truncate text-ivory">{label}</span>
                  </div>
                </div>

                {/* Lamp row: one lamp per floor, lit as the lift passes */}
                <ol className="mt-6 grid border-t border-datum-navy pt-3" style={{ gridTemplateColumns: `repeat(${lamps.length}, minmax(0, 1fr))` }}>
                  {lamps.map((i) => {
                    const lit = i === shown;
                    const onRoute = dir !== 0 && (i - trip.from) * dir >= 0 && (trip.to - i) * dir >= 0;
                    return (
                      <li key={i} className="flex flex-col items-center gap-1.5">
                        <span
                          className={cn(
                            "t-level text-[0.72rem] transition-[color,text-shadow] duration-200",
                            lit ? "text-brass [text-shadow:0_0_12px_color-mix(in_oklch,var(--brass)_70%,transparent)]" : onRoute ? "text-ivory-muted" : "text-datum-navy",
                          )}
                        >
                          {floorCode(i)}
                        </span>
                        <span
                          className={cn(
                            "size-1.5 rounded-full transition-[background-color,box-shadow] duration-200",
                            lit ? "bg-brass shadow-[0_0_10px_2px_color-mix(in_oklch,var(--brass)_55%,transparent)]" : i === trip.to ? "bg-brass/40" : "bg-datum-navy",
                          )}
                        />
                      </li>
                    );
                  })}
                </ol>

                {/* Journey hairline: the progress indicator */}
                <div className="relative mt-4 h-px bg-datum-navy">
                  <span
                    className="absolute inset-y-0 start-0 w-full origin-left bg-brass transition-transform ease-[cubic-bezier(0.65,0,0.35,1)]"
                    style={{ transform: `scaleX(${progress})`, transitionDuration: `${STEP_MS + 80}ms` } as CSSProperties}
                  />
                  {arrived && phase === "closed" ? (
                    <motion.span
                      className="absolute -top-[3px] end-0 size-[7px] rounded-full bg-brass"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: [0.4, 1.6, 1], opacity: 1 }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                    />
                  ) : null}
                </div>
              </motion.div>
            </div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
