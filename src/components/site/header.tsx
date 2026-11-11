"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { company, images, nav } from "@/content/en";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close the menu on navigation.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  // Longest matching nav href wins, so /projects/beaumonte-tower-c lights "BeauMonté", not "Projects" too.
  const activeHref = [...nav]
    .filter((n) => pathname === n.href || pathname.startsWith(`${n.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : href === activeHref);

  return (
    <header className="on-lacquer sticky top-0 z-40 h-[var(--header-h)] border-b border-datum-navy">
      <div className="frame flex h-full items-center gap-4">
        <Link href="/" className="me-auto flex min-h-11 items-center" aria-label="Rubics Realty, home">
          <Image src={images.logo.src} alt="" width={154} height={32} loading="eager" className="h-7 w-auto sm:h-8" style={{ width: "auto" }} />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "t-label rule-grow inline-flex min-h-11 items-center pb-0.5 text-ivory-muted transition-colors hover:text-ivory",
                    isActive(item.href) && "bg-[length:100%_1px] text-ivory",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>


        <a
          href={company.salesPhone.href}
          className="t-label hidden min-h-11 items-center px-1 text-ivory xl:inline-flex"
        >
          {company.salesPhone.display}
        </a>

        <button
          ref={triggerRef}
          type="button"
          className="inline-flex size-11 items-center justify-center text-ivory lg:hidden"
          aria-haspopup="dialog"
          aria-controls="site-menu"
          onClick={() => dialogRef.current?.showModal()}
        >
          <Menu aria-hidden className="size-6" />
          <span className="sr-only">Open menu</span>
        </button>
      </div>

      <dialog
        id="site-menu"
        ref={dialogRef}
        aria-label="Menu"
        onClose={() => triggerRef.current?.focus()}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="on-lacquer m-0 h-dvh max-h-none w-full max-w-none p-0 backdrop:bg-lacquer/80"
      >
        <div className="frame flex h-[var(--header-h)] items-center justify-between border-b border-datum-navy">
          <Image src={images.logo.src} alt="Rubics" width={154} height={32} className="h-7 w-auto" style={{ width: "auto" }} />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center text-ivory"
            onClick={() => dialogRef.current?.close()}
          >
            <X aria-hidden className="size-6" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav aria-label="Main" className="frame pt-6">
          <ol className="divide-y divide-datum-navy border-y border-datum-navy">
            {[{ label: "Home", href: "/" }, ...nav].map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex min-h-16 items-center gap-5 text-ivory"
                >
                  <span className="t-level w-8 text-brass" aria-hidden>
                    L{String(i).padStart(2, "0")}
                  </span>
                  <span className="t-h3 font-normal">{item.label}</span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="mt-8 grid gap-2">
            <p className="t-label text-ivory-muted">Sales</p>
            <a href={company.salesPhone.href} className="t-numeral text-4xl text-brass">
              {company.salesPhone.display}
            </a>
            <a href={`mailto:${company.salesEmail}`} className="min-h-11 py-2 text-ivory">
              {company.salesEmail}
            </a>
          </div>
        </nav>
      </dialog>
    </header>
  );
}
