import Image from "next/image";
import Link from "next/link";
import type { Person } from "@/content/types";
import { Reveal } from "./reveal";

export function PeopleRow({ people, linkToBios = true }: { people: Person[]; linkToBios?: boolean }) {
  return (
    <ul className="frame grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((p, i) => (
        <Reveal as="li" key={p.slug} delay={i * 0.06}>
          <figure>
            <div className="relative aspect-[600/790] overflow-hidden bg-lacquer">
              <Image
                src={p.portrait.src}
                alt={p.portrait.alt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                className="object-cover grayscale"
              />
            </div>
            <figcaption className="mt-5">
              <p className="t-label text-brass-deep [.on-navy_&]:text-brass">{p.role}</p>
              <p className="t-h3 mt-2">{p.name}</p>
              <p className="t-body mt-2 text-sm opacity-80">{p.short}</p>
              {linkToBios ? (
                <Link href={`/about#${p.slug}`} className="t-label rule-grow mt-4 inline-flex min-h-11 items-center pb-0.5">
                  Read biography<span className="sr-only">: {p.name}</span>
                </Link>
              ) : null}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}
