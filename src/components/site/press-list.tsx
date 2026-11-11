import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PressStory } from "@/content/types";
import { formatDate } from "@/lib/site";

/** Press ledger: one row per story, outlets listed once (the old site repeated each story up to 18 times). */
export function PressList({ stories }: { stories: PressStory[] }) {
  return (
    <ol className="border-t border-border">
      {stories.map((s) => (
        <li key={s.slug} className="border-b border-border">
          <Link
            href={`/press/${s.slug}`}
            className="group grid gap-x-8 gap-y-3 py-7 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline"
          >
            <time dateTime={s.date} className="t-level text-brass-deep [.on-navy_&]:text-brass">
              {formatDate(s.date)}
            </time>
            <span className="min-w-0">
              <span className="t-h3 block font-normal">{s.title}</span>
              <span className="mt-3 block text-sm opacity-75">
                Covered by {s.outlets.slice(0, 5).join(", ")}
                {s.outlets.length > 5 ? ` and ${s.outlets.length - 5} more` : ""}
              </span>
            </span>
            <ArrowUpRight
              aria-hidden
              className="size-5 text-brass-deep transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 max-sm:hidden"
            />
          </Link>
        </li>
      ))}
    </ol>
  );
}
