import Image from "next/image";
import Link from "next/link";
import type { Person } from "@/content/types";
import { cn } from "@/lib/utils";

/** Leadership as portrait plates. Each portrait rises into its frame; hover warms it from greyscale. */
export function PeopleRow({ people, linkToBios = true }: { people: Person[]; linkToBios?: boolean }) {
  return (
    <ul className="frame grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((p, i) => {
        const inner = (
          <>
            <span className="relative block">
              <span aria-hidden className="plate-crop" />
              <span
                suppressHydrationWarning data-reveal="plate"
                style={{ ["--d" as string]: `${i * 120}ms` }}
                className="relative block aspect-[600/790] max-h-[min(34rem,calc(100svh-var(--header-h)-12rem))] max-sm:max-h-[26rem] w-full overflow-hidden bg-lacquer"
              >
                <Image
                  src={p.portrait.src}
                  alt={p.portrait.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                  className="plate-media object-cover object-top grayscale transition-[filter,scale] duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-[1.03] group-hover:grayscale-[35%]"
                />
              </span>
            </span>
            <span suppressHydrationWarning data-reveal="fade" style={{ ["--d" as string]: `${i * 120 + 250}ms` }} className="block">
            <span className="mt-5 flex items-baseline gap-3">
              <span className="t-note text-brass-deep">Pl. {String(i + 1).padStart(2, "0")}</span>
              <span className="t-label text-brass-deep">{p.role}</span>
            </span>
            <span className="t-h3 mt-2 block">{p.name}</span>
            <span className="t-body mt-2 block text-sm text-graphite-muted">{p.short}</span>
            {linkToBios ? (
              <span className="t-label rule-grow mt-4 inline-flex min-h-11 items-center pb-0.5">
                Read biography<span className="sr-only">: {p.name}</span>
              </span>
            ) : null}
            </span>
          </>
        );
        return (
          <li key={p.slug}>
            {linkToBios ? (
              <Link href={`/about#${p.slug}`} className={cn("group block")}>
                {inner}
              </Link>
            ) : (
              <div className="group">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
