import Image from "next/image";
import { groupFigures, home, images, people, principles, projects } from "@/content/en";
import { pressStories } from "@/content/press";
import { ButtonLink } from "@/components/site/button-link";
import { DirectoryBoard } from "@/components/site/directory-board";
import { FiguresLine } from "@/components/site/figures-line";
import { HomeHero } from "@/components/site/home-hero";
import { LevelSection } from "@/components/site/level-section";
import { PeopleRow } from "@/components/site/people-row";
import { PressList } from "@/components/site/press-list";
import { Reveal } from "@/components/site/reveal";
import { VisitBand } from "@/components/site/visit-band";

export default function HomePage() {
  const founder = people[0];
  return (
    <>
      <HomeHero />

      {/* L01 Directory */}
      <LevelSection level="L01" label="Directory" tone="navy" id="projects">
        <div className="frame mb-10 grid gap-6 lg:grid-cols-12">
          <h2 className="t-h2 lg:col-span-6">{home.directory.title}</h2>
          <p className="t-body text-ivory-muted lg:col-span-5 lg:col-start-8">{home.directory.body}</p>
        </div>
        <DirectoryBoard projects={projects} />
      </LevelSection>

      {/* L02 How we build */}
      <LevelSection level="L02" label="How we build">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="t-h2">{home.build.title}</h2>
            <p className="t-body mt-6 text-graphite-muted">{home.build.body}</p>
            <figure className="mt-10 max-w-sm">
              <Image
                src={images.beaumonteSketch.src}
                alt={images.beaumonteSketch.alt}
                width={images.beaumonteSketch.width}
                height={images.beaumonteSketch.height}
                sizes="(min-width: 1024px) 24rem, 80vw"
                className="mix-blend-multiply"
              />
              <figcaption className="t-label mt-3 text-graphite-muted">BeauMonté, Sion Circle. Elevation sketch</figcaption>
            </figure>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {principles.slice(0, 3).map((p, i) => (
              <Reveal as="li" key={p.code} delay={i * 0.05} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-datum py-8">
                <span className="t-level text-brass-deep" aria-hidden>
                  {p.code}
                </span>
                <div>
                  <h3 className="t-h3">{p.title}</h3>
                  <p className="t-body mt-3 text-graphite-muted">{p.body}</p>
                </div>
              </Reveal>
            ))}
            <li className="border-t border-datum pt-6">
              <ButtonLink href="/about#principles" variant="text">
                All six principles
              </ButtonLink>
            </li>
          </ol>
        </div>
      </LevelSection>

      {/* L03 Lineage */}
      <LevelSection level="L03" label="Lineage" tone="navy">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="t-h2">{home.lineage.title}</h2>
            <p className="t-body mt-6 text-ivory-muted">{home.lineage.body}</p>
            <blockquote className="mt-12">
              <span aria-hidden className="block h-px w-16 bg-brass" />
              <p className="t-h3 mt-6 font-normal text-ivory">&ldquo;{home.lineage.quote}&rdquo;</p>
              <footer className="t-label mt-4 text-brass">{home.lineage.quoteBy}</footer>
            </blockquote>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="relative aspect-[600/790] overflow-hidden bg-lacquer">
              <Image src={founder.portrait.src} alt={founder.portrait.alt} fill sizes="(min-width: 1024px) 28vw, 92vw" className="object-cover grayscale" />
            </div>
          </div>
        </div>
        <div className="frame mt-16">
          <FiguresLine figures={groupFigures} />
        </div>
      </LevelSection>

      {/* L04 Leadership */}
      <LevelSection level="L04" label="Leadership">
        <div className="frame mb-12 grid gap-6 lg:grid-cols-12">
          <h2 className="t-h2 lg:col-span-7">The people who sign off every floor.</h2>
        </div>
        <PeopleRow people={people} />
      </LevelSection>

      {/* L05 Press */}
      <LevelSection level="L05" label="Press" tone="travertine-2">
        <div className="frame grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="t-h2">In the news.</h2>
            <ButtonLink href="/press" variant="text" className="mt-6">
              All press
            </ButtonLink>
          </div>
          <div className="lg:col-span-8">
            <PressList stories={pressStories.filter((s) => s.category === "real-estate").slice(0, 4)} />
          </div>
        </div>
      </LevelSection>

      <VisitBand level="L06" />
    </>
  );
}
