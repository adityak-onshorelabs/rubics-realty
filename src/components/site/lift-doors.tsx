"use client";

/**
 * Page transition: lift doors.
 *
 * On an internal link click, two lacquer doors with a brass seam slide shut, showing where you are going,
 * then the route changes and the doors open once the new page has painted. If the next page is slow, the
 * doors simply stay shut until it arrives, so this doubles as the loading screen.
 *
 * Skipped for: same-page links (hash or query only), modified clicks (new tab/window), target="_blank",
 * downloads, external/tel/mailto links, and visitors who prefer reduced motion (navigation is untouched).
 * Native scroll is untouched; Next's router still does the navigation and focus/announcement.
 */
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { images, projects } from "@/content/en";
import { pressStories } from "@/content/press";

type Phase = "idle" | "closing" | "closed" | "opening";

const EASE = [0.65, 0, 0.35, 1] as const;
const CLOSE_MS = 420;
const OPEN_MS = 520;
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
  const target = useRef<string | null>(null);
  const pendingHref = useRef<string | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const failsafe = useRef<number>(0);

  const set = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

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

      target.current = url.pathname;
      setLabel(destinationLabel(url.pathname));
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

  // Open once the destination route has rendered (two frames so the new page paints behind the doors).
  useEffect(() => {
    if (phaseRef.current !== "closed" && phaseRef.current !== "closing") return;
    if (target.current && pathname !== target.current) return;
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => {
        window.clearTimeout(failsafe.current);
        set("opening");
      });
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [pathname, phase, set]);

  const shut = phase === "closing" || phase === "closed";
  const visible = phase !== "idle";

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
                className={`on-lacquer grain absolute inset-y-0 w-1/2 ${side === "left" ? "left-0" : "right-0"}`}
                initial={{ x: side === "left" ? "-100%" : "100%" }}
                animate={{ x: shut ? "0%" : side === "left" ? "-100%" : "100%" }}
                transition={{ duration: (shut ? CLOSE_MS : OPEN_MS) / 1000, ease: EASE }}
                onAnimationComplete={() => {
                  if (side !== "left") return;
                  if (phaseRef.current === "closing" && pendingHref.current) {
                    const href = pendingHref.current;
                    pendingHref.current = null;
                    set("closed");
                    router.push(href);
                  } else if (phaseRef.current === "opening") {
                    target.current = null;
                    set("idle");
                  }
                }}
              >
                {/* Brass seam on the meeting edge */}
                <span className={`absolute inset-y-0 w-px bg-brass/70 ${side === "left" ? "right-0" : "left-0"}`} />
              </motion.div>
            ))}

            {/* Indicator: shown only while the doors are shut */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: shut ? 1 : 0 }}
              transition={{ duration: shut ? 0.25 : 0.15, delay: shut ? 0.22 : 0 }}
            >
              <Image src={images.logo.src} alt="" width={154} height={32} className="h-8 w-auto" style={{ width: "auto" }} />
              <span className="relative block h-12 w-px overflow-hidden bg-datum-navy">
                <motion.span
                  className="absolute inset-x-0 bottom-0 bg-brass"
                  initial={{ height: "0%" }}
                  animate={{ height: shut ? "100%" : "0%" }}
                  transition={{ duration: 0.9, ease: EASE, repeat: phase === "closed" ? Infinity : 0, repeatType: "reverse" }}
                />
              </span>
              <span>
                <span className="t-label block text-[0.64rem] text-ivory-muted">Arriving</span>
                <span className="t-label mt-2 block text-brass">{label}</span>
              </span>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
