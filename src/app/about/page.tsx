import type { Metadata } from "next";
import { about, groupFigures, home, images, people, principles } from "@/content/en";
import { FiguresLine } from "@/components/site/figures-line";
import { LevelSection, StepRule } from "@/components/site/level-section";
import { PageHeader } from "@/components/site/page-header";
import { Plate } from "@/components/site/plate";
import { Reveal, RollingNumber, SplitText } from "@/components/site/reveal";
import { Parallax } from "@/components/site/scroll-fx";
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

      <LevelSection level="L01" label="Story" meta="Rubics Group, est. by Suhan Shetty">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <p className="t-statement">
              <SplitText>{about.body[0]}</SplitText>
            </p>
            <Reveal delay={200}>
              {about.body.slice(1).map((p, i) => (
                <p key={i} className="t-body mt-6 text-graphite-muted">
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal delay={300} className="mt-12">
              <dl className="grid gap-8 sm:grid-cols-2">
                <div className="border-t border-datum pt-5">
                  <dt className="t-label text-brass-deep">Vision</dt>
                  <dd className="t-body mt-3 text-sm">{about.vision}</dd>
                </div>
                <div className="border-t border-datum pt-5">
                  <dt className="t-label text-brass-deep">Mission</dt>
                  <dd className="t-body mt-3 text-sm">{about.mission}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
          <Parallax className="lg:col-span-5 lg:col-start-8">
          <Plate
            image={images.heroPoster}
            no="01"
            caption="Three Sixty West, Worli. A landmark the founder helmed."
            sizes="(min-width: 1024px) 36vw, 92vw"
            frameClassName="aspect-[4/5] max-h-[calc(100svh-var(--header-h)-8rem)] w-full"
            imageClassName="object-[62%_center]"
          />
          </Parallax>
        </div>
        <div className="frame mt-16 lg:mt-20">
          <FiguresLine figures={groupFigures} />
        </div>
      </LevelSection>

      <LevelSection id="principles" level="L02" label="Principles" tone="navy" meta="Six, in order">
        <div className="frame mb-12 lg:mb-14">
          <h2 className="t-h2 max-w-[18ch]">
            <SplitText>{home.build.title}</SplitText>
          </h2>
        </div>
        <ol className="frame grid gap-x-12 md:grid-cols-2">
          {principles.map((p, i) => (
            <li key={p.code} className="grid grid-cols-[4.5rem_1fr] gap-x-5 border-t border-datum-navy py-9 sm:grid-cols-[5.5rem_1fr]">
              <span className="t-numeral text-[clamp(2.75rem,2rem+2vw,4rem)] text-brass" aria-hidden>
                <RollingNumber value={p.code} delay={(i % 2) * 100} />
              </span>
              <div>
                <h3 className="t-h3 text-ivory">
                  <SplitText delay={(i % 2) * 100 + 100}>{p.title}</SplitText>
                </h3>
                <Reveal delay={(i % 2) * 100 + 250}>
                  <p className="t-body mt-3 text-ivory-muted">{p.body}</p>
                </Reveal>
              </div>
            </li>
          ))}
        </ol>
      </LevelSection>

      <LevelSection id="leadership" level="L03" label="Leadership" meta={`${people.length} directors`}>
        <div className="frame">
          <h2 className="t-h2 max-w-[18ch]">
            <SplitText>The people who sign off every floor.</SplitText>
          </h2>
        </div>
        <div className="frame mt-14 grid gap-20 lg:gap-28">
          {people.map((p, i) => (
            <article key={p.slug} id={p.slug} tabIndex={-1} className="grid gap-8 outline-none md:grid-cols-12 md:items-start">
              <Plate
                className={i % 2 ? "md:order-2 md:col-span-4 md:col-start-9" : "md:col-span-4"}
                image={p.portrait}
                no={String(i + 1).padStart(2, "0")}
                caption={p.name}
                sizes="(min-width: 768px) 30vw, 92vw"
                frameClassName="aspect-[600/790] max-h-[calc(100svh-var(--header-h)-8rem)] w-full"
                imageClassName="grayscale object-top"
              />
              <div className={i % 2 ? "md:col-span-7" : "md:col-span-7 md:col-start-6"}>
                <Reveal kind="wipe">
                  <p className="t-label text-brass-deep">{p.role}</p>
                </Reveal>
                <h3 className="t-h2 mt-3">
                  <SplitText delay={100}>{p.name}</SplitText>
                </h3>
                <Reveal delay={250}>
                  {p.bio.map((b, k) => (
                    <p key={k} className={k === 0 ? "t-lead mt-6" : "t-body mt-4 text-graphite-muted"}>
                      {b}
                    </p>
                  ))}
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </LevelSection>

      <LevelSection level="L04" label="In his words" tone="travertine-2">
        <figure className="frame">
          <span aria-hidden className="t-numeral block text-8xl leading-[0.5] text-brass-deep">
            &ldquo;
          </span>
          <blockquote className="t-display mt-8 max-w-[18ch] text-[clamp(2.4rem,min(1.4rem+3.8vw,0.8rem+7svh),5rem)]">
            <SplitText>{home.lineage.quote}</SplitText>
          </blockquote>
          <Reveal kind="wipe" delay={600}>
            <figcaption className="t-label mt-8 text-graphite-muted">{home.lineage.quoteBy}</figcaption>
          </Reveal>
          <StepRule className="mt-14" />
        </figure>
      </LevelSection>

      <VisitBand level="L05" />
    </>
  );
}
