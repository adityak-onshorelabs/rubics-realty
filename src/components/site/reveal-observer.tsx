"use client";

import { useEffect } from "react";

/** Fired by LiftDoors when the doors begin to open, so the arriving page's reveals play in view. */
export const DOORS_OPEN_EVENT = "rubics:doors-open";

/**
 * One IntersectionObserver for every [data-reveal] element on the page, including ones added later
 * (route changes, tab panels). Sets data-in once; CSS does the rest. While the lift doors are shut
 * (html[data-doors]) reveals queue up and play as the doors open.
 * data-in belongs to this observer, not React: every reveal element is rendered with
 * suppressHydrationWarning, so marking one before React has hydrated it is harmless.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");

    let queue: Element[] = [];
    const show = (el: Element) => {
      if (root.dataset.doors) queue.push(el);
      else el.setAttribute("data-in", "");
    };
    const flush = () => {
      // Each element carries its own delay, so the queue can be released at once.
      queue.forEach((el) => el.setAttribute("data-in", ""));
      queue = [];
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          show(e.target);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.01 },
    );

    const seen = new WeakSet<Element>();
    const scan = () => {
      const vh = window.innerHeight;
      document.querySelectorAll("[data-reveal]:not([data-in])").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // Anything already on screen when it is found plays now (on arrival and on route changes),
        // including the bottom edge that the root margin trims.
        const r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) show(el);
        else io.observe(el);
      });
    };
    scan();

    let raf = 0;
    const mo = new MutationObserver(() => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          scan();
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener(DOORS_OPEN_EVENT, flush);

    return () => {
      io.disconnect();
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener(DOORS_OPEN_EVENT, flush);
    };
  }, []);

  return null;
}
