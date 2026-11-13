"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { company, images, nav } from "@/content/en";
import { cn } from "@/lib/utils";
import { getLenis } from "./smooth-scroll";

/** Pages whose first section is a full-bleed film or image that the header floats over. */
const OVER_MEDIA = new Set(["/"]);
/** Scroll distance after which the desktop bar collapses into the floating pill. */
const COLLAPSE_AT = 120;

/**
 * Site header.
 * - Desktop (1024px+): the full bar at the top of the page. Once the page has moved, it collapses into a
 *   floating brass-framed pill (logo, Menu, current page, Book a visit). Menu expands the links inside the
 *   pill; Escape, a click outside or a navigation folds it again. It never hides.
 * - Below 1024px: a compact bar that tucks away while reading downwards and returns on any upward scroll;
 *   Menu opens the full-screen dialog.
 */
export function Header() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const pillToggleRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [wide, setWide] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  // Close menus on navigation.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 12);
      const c = wide && y > COLLAPSE_AT;
      setCollapsed(c);
      // The pill folds back when the full bar returns.
      if (!c) setOpen(false);
      if (wide) {
        setTucked(false);
      } else {
        const focusInside = headerRef.current?.contains(document.activeElement) ?? false;
        if (y < 160 || focusInside) setTucked(false);
        else if (y > last + 6) setTucked(true);
        else if (y < last - 6) setTucked(false);
      }
      last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname, wide]);

  useEffect(() => {
    document.documentElement.style.setProperty("--header-shift", tucked ? "calc(-1 * var(--header-h))" : "0px");
  }, [tucked]);

  // The pill folds back on Escape and on a click outside it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        pillToggleRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!pillRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // Longest matching nav href wins, so /projects/beaumonte-tower-c lights "BeauMonté", not "Projects" too.
  const activeHref = [...nav]
    .filter((n) => pathname === n.href || pathname.startsWith(`${n.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : href === activeHref);
  const activeLabel = nav.find((n) => n.href === activeHref)?.label ?? (pathname === "/" ? "Home" : null);
  const clear = OVER_MEDIA.has(pathname) && !scrolled;
  const pill = wide && collapsed;

  return (
    <header
      ref={headerRef}
      onFocus={() => setTucked(false)}
      className={cn(
        "sticky top-0 z-40 h-[var(--header-h)] border-b text-ivory transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out-expo)] [transform:translateY(var(--header-shift))]",
        // Collapsed: the bar itself disappears (and lets clicks through); only the pill remains.
        pill
          ? "pointer-events-none border-transparent bg-transparent"
          : clear
            ? // Over the film: lift text and logo off a bright sky.
              "border-transparent bg-transparent [text-shadow:0_1px_10px_rgb(0_0_0/0.55)] [&_img]:drop-shadow-[0_1px_8px_rgb(0_0_0/0.5)]"
            : "border-datum-navy bg-lacquer",
      )}
    >
      {/* Full bar */}
      <div
        inert={pill}
        className={cn(
          "frame flex h-full items-center gap-4 transition-[opacity,translate] duration-500 ease-[var(--ease-out-expo)]",
          pill && "-translate-y-3 opacity-0",
        )}
      >
        <Link href="/" className="me-auto flex min-h-11 items-center" aria-label="Rubics Realty, home">
          <Image src={images.logo.src} alt="" width={154} height={32} loading="eager" className="h-6 w-auto 2xl:h-7" style={{ width: "auto" }} />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "t-label rule-grow inline-flex min-h-11 items-center pb-0.5 text-[0.68rem] transition-colors hover:text-ivory",
                    clear ? "text-ivory/90" : "text-ivory/75",
                    isActive(item.href) && "bg-[length:100%_1px] text-ivory",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <span aria-hidden className="mx-1 hidden h-5 w-px bg-ivory/20 xl:block" />

        <a href={company.salesPhone.href} className="t-level hidden min-h-11 items-center text-[0.95rem] text-ivory xl:inline-flex">
          {company.salesPhone.display}
        </a>

        <Link
          href="/projects/beaumonte-tower-c?intent=visit#visit"
          className={cn(
            "group t-label hidden min-h-10 items-center gap-2 border px-4 text-[0.66rem] text-ivory transition-colors duration-300 hover:border-ivory hover:bg-ivory hover:text-lacquer hover:[text-shadow:none] md:inline-flex",
            clear ? "border-ivory/70 bg-lacquer/25 backdrop-blur-[2px]" : "border-ivory/40",
          )}
        >
          Book a visit
          <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>

        <button
          ref={triggerRef}
          type="button"
          className="-me-2 inline-flex size-11 items-center justify-center text-ivory lg:hidden"
          aria-haspopup="dialog"
          aria-controls="site-menu"
          onClick={() => {
            getLenis()?.stop();
            dialogRef.current?.showModal();
          }}
        >
          <Menu aria-hidden className="size-6" />
          <span className="sr-only">Open menu</span>
        </button>
      </div>

      {/* Collapsed pill (desktop, once scrolled) */}
      <div
        ref={pillRef}
        inert={!pill}
        className={cn(
          "pointer-events-auto absolute start-1/2 top-2.5 hidden w-max -translate-x-1/2 transition-[opacity,translate] duration-500 ease-[var(--ease-out-expo)] lg:block rtl:translate-x-1/2",
          pill ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0",
        )}
      >
        <div
          className="plaque flex h-12 items-center !py-0 !pe-1.5 !ps-5"
          style={{
            ["--chamfer" as string]: "10px",
            ["--plaque-line" as string]: "color-mix(in oklch, var(--brass) 55%, transparent)",
            ["--plaque-fill" as string]: "color-mix(in oklch, var(--lacquer) 96%, transparent)",
          }}
        >
          <Link href="/" className="flex min-h-11 items-center" aria-label="Rubics Realty, home">
            <Image src={images.logo.src} alt="" width={154} height={32} className="h-[1.15rem] w-auto" style={{ width: "auto" }} />
          </Link>
          <span aria-hidden className="mx-4 h-5 w-px bg-ivory/20" />

          <button
            ref={pillToggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="pill-nav"
            onClick={() => setOpen((o) => !o)}
            className="group flex min-h-11 items-center gap-2.5 pe-2 text-ivory"
          >
            <span className="relative block size-4">
              <Menu aria-hidden className={cn("absolute inset-0 size-4 transition-[opacity,rotate] duration-300", open ? "rotate-90 opacity-0" : "opacity-100")} />
              <X aria-hidden className={cn("absolute inset-0 size-4 text-brass transition-[opacity,rotate] duration-300", open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0")} />
            </span>
            <span className="t-label text-[0.66rem]">{open ? "Close" : "Menu"}</span>
            {!open && activeLabel ? (
              <span className="t-note flex items-center gap-2 text-ivory-muted">
                <span aria-hidden className="size-1 bg-brass" />
                {activeLabel}
              </span>
            ) : null}
          </button>

          {/* Links fold out inside the pill (grid column 0fr to 1fr) */}
          <nav
            id="pill-nav"
            aria-label="Main"
            inert={!open}
            className={cn(
              "grid transition-[grid-template-columns] duration-500 ease-[var(--ease-out-expo)]",
              open ? "grid-cols-[1fr]" : "grid-cols-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              <ul className="flex items-center gap-6 whitespace-nowrap ps-4 pe-5">
                {nav.map((item, i) => (
                  <li
                    key={item.href}
                    className={cn("transition-[opacity,translate] duration-500 ease-[var(--ease-out-expo)]", open ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")}
                    style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "t-label rule-grow inline-flex min-h-11 items-center pb-0.5 text-[0.66rem] text-ivory/75 transition-colors hover:text-ivory",
                        isActive(item.href) && "bg-[length:100%_1px] text-ivory",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <Link
            href="/projects/beaumonte-tower-c?intent=visit#visit"
            className="group t-label ms-2 inline-flex h-9 items-center gap-2 whitespace-nowrap bg-ivory px-4 text-[0.62rem] text-lacquer transition-colors duration-300 hover:bg-brass"
            // Chamfered like the pill around it: 6px inset from a 10px chamfer gives ~7.5px for parallel edges.
            style={{
              clipPath:
                "polygon(7.5px 0, calc(100% - 7.5px) 0, 100% 7.5px, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 7.5px 100%, 0 calc(100% - 7.5px), 0 7.5px)",
            }}
          >
            Book a visit
            <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </div>
      </div>

      <dialog
        id="site-menu"
        ref={dialogRef}
        aria-label="Menu"
        onClose={() => {
          getLenis()?.start();
          triggerRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="on-lacquer grain m-0 h-dvh max-h-none w-full max-w-none p-0 backdrop:bg-lacquer/80"
      >
        <div className="frame flex h-[var(--header-h)] items-center justify-between border-b border-datum-navy">
          <Image src={images.logo.src} alt="Rubics" width={154} height={32} className="h-6 w-auto" style={{ width: "auto" }} />
          <button
            type="button"
            className="-me-2 inline-flex size-11 items-center justify-center text-ivory"
            onClick={() => dialogRef.current?.close()}
          >
            <X aria-hidden className="size-6" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav aria-label="Main" className="frame pt-6">
          <ol className="border-t border-datum-navy">
            {[{ label: "Home", href: "/" }, ...nav].map((item, i) => (
              <li key={item.href} className="menu-row border-b border-datum-navy" style={{ ["--i" as string]: i } as CSSProperties}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex min-h-16 items-center gap-5 text-ivory"
                >
                  <span className="t-level w-8 text-brass" aria-hidden>
                    {i === 0 ? "G" : `L${String(i).padStart(2, "0")}`}
                  </span>
                  <span className="t-h2 flex-1 text-[2rem]">{item.label}</span>
                  <ArrowUpRight aria-hidden className="size-5 text-brass" />
                </Link>
              </li>
            ))}
          </ol>
          <div className="menu-row mt-8 grid gap-2" style={{ ["--i" as string]: 7 } as CSSProperties}>
            <p className="t-label text-ivory-muted">Sales</p>
            <a href={company.salesPhone.href} className="t-numeral w-fit text-4xl text-brass">
              {company.salesPhone.display}
            </a>
            <a href={`mailto:${company.salesEmail}`} className="min-h-11 w-fit py-2 text-ivory">
              {company.salesEmail}
            </a>
          </div>
        </nav>
      </dialog>
    </header>
  );
}
