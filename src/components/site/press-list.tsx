import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { PressStory } from "@/content/types";
import { formatDate } from "@/lib/site";

/** Press ledger: one row per story, cover thumbnail, outlets listed once. Rows arrive in order. */
export function PressList({ stories }: { stories: PressStory[] }) {
  return (
    <ol suppressHydrationWarning data-reveal="stagger" className="border-t border-border">
      {stories.map((s, i) => (
        <li key={s.slug} className="border-b border-border" style={{ ["--i" as string]: Math.min(i, 8) } as CSSProperties}>
          <Link
            href={`/press/${s.slug}`}
            className="group grid grid-cols-[6.5rem_1fr] items-start gap-x-5 gap-y-3 py-6 sm:grid-cols-[10rem_1fr_auto] sm:gap-x-8 sm:py-7"
          >
            <span className="relative block aspect-[4/3] overflow-hidden bg-lacquer">
              <Image
                src={s.image.src}
                alt=""
                fill
                sizes="(min-width: 640px) 10rem, 6.5rem"
                className="object-cover transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
              />
            </span>
            <span className="min-w-0">
              <time dateTime={s.date} className="t-level block text-brass-deep [.on-navy_&]:text-brass">
                {formatDate(s.date)}
              </time>
              <span className="t-h3 mt-2 block font-normal">
                <span className="rule-grow pb-0.5">{s.title}</span>
              </span>
              <span className="mt-3 block text-sm opacity-75 max-sm:line-clamp-2">
                Covered by {s.outlets.slice(0, 5).join(", ")}
                {s.outlets.length > 5 ? ` and ${s.outlets.length - 5} more` : ""}
              </span>
            </span>
            <span className="mt-1 hidden size-10 items-center justify-center border border-brass-deep/40 text-brass-deep transition-colors duration-300 group-hover:border-brass-deep group-hover:bg-brass-deep group-hover:text-travertine sm:flex">
              <ArrowUpRight aria-hidden className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45" />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
