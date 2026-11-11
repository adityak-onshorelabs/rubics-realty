import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PressStory } from "@/content/types";
import { formatDate } from "@/lib/site";

/** Press ledger: one row per story, cover thumbnail, outlets listed once (the old site repeated stories up to 18 times). */
export function PressList({ stories }: { stories: PressStory[] }) {
  return (
    <ol className="border-t border-border">
      {stories.map((s) => (
        <li key={s.slug} className="border-b border-border">
          <Link
            href={`/press/${s.slug}`}
            className="group grid grid-cols-[6.5rem_1fr] items-start gap-x-5 gap-y-3 py-6 sm:grid-cols-[11rem_1fr_auto] sm:gap-x-8 sm:py-7"
          >
            <span className="relative block aspect-[4/3] overflow-hidden bg-lacquer">
              <Image
                src={s.image.src}
                alt=""
                fill
                sizes="(min-width: 640px) 11rem, 6.5rem"
                className="object-cover transition-transform duration-500 ease-[var(--ease-lift)] group-hover:scale-[1.04]"
              />
            </span>
            <span className="min-w-0">
              <time dateTime={s.date} className="t-level block text-brass-deep [.on-navy_&]:text-brass">
                {formatDate(s.date)}
              </time>
              <span className="t-h3 mt-2 block font-normal">{s.title}</span>
              <span className="mt-3 block text-sm opacity-75 max-sm:line-clamp-2">
                Covered by {s.outlets.slice(0, 5).join(", ")}
                {s.outlets.length > 5 ? ` and ${s.outlets.length - 5} more` : ""}
              </span>
            </span>
            <ArrowUpRight
              aria-hidden
              className="mt-1 size-5 text-brass-deep transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 max-sm:hidden"
            />
          </Link>
        </li>
      ))}
    </ol>
  );
}
