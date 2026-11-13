import { groupFigures, home, images, people, principles, projects } from "@/content/en";
import { pressStories } from "@/content/press";
import { BuildDrawing } from "@/components/site/build-drawing";
import { ButtonLink } from "@/components/site/button-link";
import { DirectoryBoard } from "@/components/site/directory-board";
import { FiguresLine } from "@/components/site/figures-line";
import { HomeHero } from "@/components/site/home-hero";
import { LevelSection } from "@/components/site/level-section";
import { PeopleRow } from "@/components/site/people-row";
import { Plate } from "@/components/site/plate";
import { PressList } from "@/components/site/press-list";
import { Reveal, RollingNumber, SplitText } from "@/components/site/reveal";
import { Parallax } from "@/components/site/scroll-fx";
import { VisitBand } from "@/components/site/visit-band";

export default function HomePage() {
  const founder = people[0];
  const beaumonte = projects[0];
  const realEstate = pressStories.filter((s) => s.category === "real-estate");
  const outlets = new Set(realEstate.flatMap((s) => s.outlets)).size;

  return (
    <>
      <HomeHero />

      {/* L01 Practice: the line that used to crowd the hero */}
      <LevelSection level="L01" label="Practice" tight meta="Rubics Realty, Mumbai">
        <div className="frame grid gap-8 lg:grid-cols-12">
          <Reveal kind="wipe" className="lg:col-span-3">
            <p className="t-label text-brass-deep">{home.hero.lineage}</p>
          </Reveal>
          <div className="lg:col-span-9">
            <p className="t-statement max-w-[34ch]">
              <SplitText>{home.hero.lede}</SplitText>
            </p>
            <Reveal delay={300} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <ButtonLink href="/about" variant="text">
                Our story
              </ButtonLink>
              <ButtonLink href="/projects" variant="text">
                All projects
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </LevelSection>

      {/* L02 Directory */}
      <LevelSection level="L02" label="Directory" tone="navy" id="projects" meta={`${projects.length} addresses`}>
        <div className="frame mb-10 grid gap-6 lg:mb-14 lg:grid-cols-12 lg:items-end">
          <h2 className="t-h2 lg:col-span-6">
            <SplitText>{home.directory.title}</SplitText>
          </h2>
          <Reveal delay={150} className="lg:col-span-5 lg:col-start-8">
            <p className="t-body text-ivory-muted">{home.directory.body}</p>
          </Reveal>
        </div>
        <DirectoryBoard projects={projects} />
      </LevelSection>

      {/* L03 How we build: the elevation sketch is the centrepiece. A full-height drawing sheet holds still
          while the principles pass, and the tower draws itself in floor by floor as the section arrives. */}
      <LevelSection level="L03" label="How we build" meta="Principles 01 to 03 of 06">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <BuildDrawing
              image={images.beaumonteSketch}
              storeys={beaumonte.facts[0].value}
              facts={beaumonte.facts}
              title="BeauMonté, Sion Circle"
            />
          </div>
          <div className="lg:col-span-5 lg:pt-4">
            <h2 className="t-h2">
              <SplitText>{home.build.title}</SplitText>
            </h2>
            <Reveal delay={150}>
              <p className="t-body mt-5 text-graphite-muted">{home.build.body}</p>
            </Reveal>
          <ol className="mt-10 lg:mt-14">
            {principles.slice(0, 3).map((p) => (
              <li key={p.code} className="grid grid-cols-[4.5rem_1fr] gap-x-5 border-t border-datum py-9 sm:grid-cols-[5.5rem_1fr] lg:py-[clamp(2.5rem,1rem+5svh,4.5rem)]">
                <span className="t-numeral text-[clamp(3rem,2.2rem+2.4vw,4.5rem)] text-brass-deep" aria-hidden>
                  <RollingNumber value={p.code} />
                </span>
                <div>
                  <h3 className="t-h3">
                    <SplitText delay={100}>{p.title}</SplitText>
                  </h3>
                  <Reveal delay={250}>
                    <p className="t-body mt-3 text-graphite-muted">{p.body}</p>
                  </Reveal>
                </div>
              </li>
            ))}
            <li className="border-t border-datum pt-6">
              <ButtonLink href="/about#principles" variant="text">
                All six principles
              </ButtonLink>
            </li>
          </ol>
          </div>
        </div>
      </LevelSection>

      {/* L04 Lineage */}
      <LevelSection level="L04" label="Lineage" tone="navy">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:items-end">
          <Parallax className="lg:col-span-5">
            <Plate
              image={founder.portrait}
              no="02"
              caption={`${founder.name}, ${founder.role}`}
              sizes="(min-width: 1024px) 34vw, 92vw"
              frameClassName="aspect-[600/790] max-h-[calc(100svh-var(--header-h)-9rem)] w-full"
              imageClassName="grayscale object-top"
            />
          </Parallax>
          <div className="lg:col-span-6 lg:col-start-7 lg:pb-8">
            <h2 className="t-h2">
              <SplitText>{home.lineage.title}</SplitText>
            </h2>
            <Reveal delay={150}>
              <p className="t-body mt-5 text-ivory-muted">{home.lineage.body}</p>
            </Reveal>
            <blockquote className="mt-10 border-t border-datum-navy pt-8 lg:mt-14">
              <span aria-hidden className="t-numeral block h-[0.5em] text-7xl leading-none text-brass">
                &ldquo;
              </span>
              <p className="t-statement mt-4 text-ivory">
                <SplitText delay={150}>{home.lineage.quote}</SplitText>
              </p>
              <Reveal kind="wipe" delay={500}>
                <footer className="t-label mt-6 text-brass">{home.lineage.quoteBy}</footer>
              </Reveal>
            </blockquote>
          </div>
        </div>
        <div className="frame mt-16 lg:mt-20">
          <FiguresLine figures={groupFigures} />
        </div>
      </LevelSection>

      {/* L05 Leadership */}
      <LevelSection level="L05" label="Leadership" meta={`${people.length} directors`}>
        <div className="frame mb-12 grid gap-6 lg:mb-14 lg:grid-cols-12 lg:items-end">
          <h2 className="t-h2 lg:col-span-7">
            <SplitText>The people who sign off every floor.</SplitText>
          </h2>
          <Reveal delay={150} className="lg:col-span-4 lg:col-start-9 lg:justify-self-end">
            <ButtonLink href="/about#leadership" variant="text">
              Full biographies
            </ButtonLink>
          </Reveal>
        </div>
        <PeopleRow people={people} />
      </LevelSection>

      {/* L06 Press */}
      <LevelSection level="L06" label="Press" tone="travertine-2">
        <div className="frame grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <h2 className="t-h2">
                <SplitText>In the news.</SplitText>
              </h2>
              <Reveal delay={150} className="mt-8">
                <dl className="tblock grid-cols-2 [&>*:first-child]:!ps-0">
                  <div>
                    <dt className="t-note text-graphite-muted">Stories</dt>
                    <dd className="t-numeral mt-1 text-4xl text-brass-deep">
                      <RollingNumber value={String(realEstate.length)} />
                    </dd>
                  </div>
                  <div>
                    <dt className="t-note text-graphite-muted">Publications</dt>
                    <dd className="t-numeral mt-1 text-4xl text-brass-deep">
                      <RollingNumber value={String(outlets)} delay={120} />
                    </dd>
                  </div>
                </dl>
                <ButtonLink href="/press" variant="text" className="mt-6">
                  All press
                </ButtonLink>
              </Reveal>
            </div>
          </div>
          <div className="lg:col-span-8">
            <PressList stories={realEstate.slice(0, 4)} />
          </div>
        </div>
      </LevelSection>

      <VisitBand level="L07" />
    </>
  );
}
