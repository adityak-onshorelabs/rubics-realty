import type { Metadata } from "next";
import Image from "next/image";
import { about, groupFigures, home, people, principles } from "@/content/en";
import { FiguresLine } from "@/components/site/figures-line";
import { LevelSection } from "@/components/site/level-section";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { VisitBand } from "@/components/site/visit-band";

export const metadata: Metadata = {
  title: "About Rubics Realty | Founder, leadership and principles",
  description:
    "Rubics Realty is the residential arm of Rubics Group, founded by Suhan Shetty. Meet the leadership and read the six principles behind every Rubics building.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader level="L00" label="About Rubics" title={about.title} lede={about.lede} />

      <LevelSection level="L01" label="Story">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {about.body.map((p, i) => (
              <p key={i} className={i === 0 ? "t-lead" : "t-body mt-5 text-graphite-muted"}>
                {p}
              </p>
            ))}
          </div>
          <dl className="grid gap-8 lg:col-span-5 lg:col-start-8">
            <div className="border-t border-datum pt-5">
              <dt className="t-label text-brass-deep">Vision</dt>
              <dd className="t-body mt-3">{about.vision}</dd>
            </div>
            <div className="border-t border-datum pt-5">
              <dt className="t-label text-brass-deep">Mission</dt>
              <dd className="t-body mt-3">{about.mission}</dd>
            </div>
          </dl>
        </div>
        <div className="frame mt-16">
          <FiguresLine figures={groupFigures} />
        </div>
      </LevelSection>

      <LevelSection id="principles" level="L02" label="Principles" tone="navy">
        <div className="frame mb-12">
          <h2 className="t-h2 max-w-[18ch]">{home.build.title}</h2>
        </div>
        <ol className="frame grid gap-x-12 md:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.code} delay={(i % 2) * 0.06} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-datum-navy py-8">
              <span className="t-level text-brass" aria-hidden>
                {p.code}
              </span>
              <div>
                <h3 className="t-h3 text-ivory">{p.title}</h3>
                <p className="t-body mt-3 text-ivory-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </LevelSection>

      <LevelSection id="leadership" level="L03" label="Leadership">
        <div className="frame">
          <h2 className="t-h2 max-w-[18ch]">The people who sign off every floor.</h2>
        </div>
        <div className="frame mt-14 grid gap-20">
          {people.map((p, i) => (
            <article key={p.slug} id={p.slug} tabIndex={-1} className="grid gap-8 outline-none md:grid-cols-12">
              <div className={i % 2 ? "md:order-2 md:col-span-4 md:col-start-9" : "md:col-span-4"}>
                <div className="relative aspect-[600/790] overflow-hidden bg-lacquer">
                  <Image src={p.portrait.src} alt={p.portrait.alt} fill sizes="(min-width: 768px) 30vw, 92vw" className="object-cover grayscale" />
                </div>
              </div>
              <div className={i % 2 ? "md:col-span-7" : "md:col-span-7 md:col-start-6"}>
                <p className="t-label text-brass-deep">{p.role}</p>
                <h3 className="t-h2 mt-3">{p.name}</h3>
                {p.bio.map((b, k) => (
                  <p key={k} className={k === 0 ? "t-lead mt-6" : "t-body mt-4 text-graphite-muted"}>
                    {b}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </LevelSection>

      <LevelSection level="L04" label="In his words" tone="travertine-2">
        <figure className="frame">
          <span aria-hidden className="block h-px w-16 bg-brass-deep" />
          <blockquote className="t-h2 mt-8 max-w-[22ch]">&ldquo;{home.lineage.quote}&rdquo;</blockquote>
          <figcaption className="t-label mt-6 text-graphite-muted">{home.lineage.quoteBy}</figcaption>
        </figure>
      </LevelSection>

      <VisitBand level="L05" />
    </>
  );
}
