import type { Metadata } from "next";
import Image from "next/image";
import { Suspense, type CSSProperties } from "react";
import { beaumonte, company, getProject, images } from "@/content/en";
import { absoluteUrl } from "@/lib/site";
import { ButtonLink } from "@/components/site/button-link";
import { ClubDirectory } from "@/components/site/club-directory";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { ImpressionTag } from "@/components/site/impression-tag";
import { JsonLd } from "@/components/site/json-ld";
import { LevelSection, StepRule } from "@/components/site/level-section";
import { LiftIndex, type LiftStop } from "@/components/site/lift-index";
import { MapOnRequest } from "@/components/site/map-on-request";
import { MobileActionBar } from "@/components/site/mobile-action-bar";
import { OrientationDiagram } from "@/components/site/orientation-diagram";
import { Plate } from "@/components/site/plate";
import { ReraPlaque } from "@/components/site/rera-plaque";
import { Reveal, RollingNumber, SplitText } from "@/components/site/reveal";
import { HeroScroll, Parallax } from "@/components/site/scroll-fx";
import { SectionExplorer } from "@/components/site/section-explorer";
import { KeyConnections, TravelGroups } from "@/components/site/travel-times";
import { UnitTables } from "@/components/site/unit-tables";

const project = getProject("beaumonte-tower-c")!;

export const metadata: Metadata = {
  title: "BeauMonté Tower C, Sion Circle | 2 & 3 BHK and jodi residences",
  description:
    "41 storeys above Sion Circle, seven residences to a floor, 2.7 acres of recreation and 50+ amenities. RERA carpet areas, location and site visits. MahaRERA P51900050715.",
  alternates: { canonical: "/projects/beaumonte-tower-c" },
  openGraph: { images: [{ url: images.beaumonteTowerSky.src, width: 1280, height: 768, alt: images.beaumonteTowerSky.alt }] },
};

const stops: LiftStop[] = [
  { id: "overview", code: "L00", label: "Overview" },
  { id: "philosophy", code: "L01", label: "Philosophy" },
  { id: "section", code: "L02", label: "Floor by floor" },
  { id: "residences", code: "L03", label: "Residences" },
  { id: "amenities", code: "L04", label: "Amenities" },
  { id: "views", code: "L05", label: "Views" },
  { id: "location", code: "L06", label: "Location" },
  { id: "architecture", code: "L07", label: "Architecture" },
  { id: "visit", code: "L08", label: "Visit" },
];

const ld = {
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  name: project.name,
  description: project.summary,
  url: absoluteUrl("/projects/beaumonte-tower-c"),
  image: absoluteUrl(images.beaumonteTowerSky.src),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sion Circle, Sion East",
    addressLocality: "Mumbai",
    postalCode: "400022",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  amenityFeature: beaumonte.amenities.clubs.map((c) => ({ "@type": "LocationFeatureSpecification", name: c.name, value: true })),
  identifier: { "@type": "PropertyValue", propertyID: "MahaRERA", value: project.rera!.number },
  provider: { "@id": absoluteUrl("/#organization") },
};

export default function BeauMontePage() {
  const storeys = `${project.facts[0].value} ${project.facts[0].label}`;
  return (
    <div className="accent-beaumonte">
      {/* L00 Overview: the arrival lobby, the name, the registration, the four facts */}
      <section
        id="overview"
        data-level="L00"
        data-label="Overview"
        aria-labelledby="bm-title"
        tabIndex={-1}
        className="on-lacquer relative isolate flex min-h-[calc(100svh-var(--header-h))] flex-col overflow-hidden outline-none"
      >
        <HeroScroll />
        <div className="absolute inset-0 -z-10">
          <div data-hero-media className="absolute inset-0 origin-top">
            <Image
              src={images.beaumonteLobby.src}
              alt={images.beaumonteLobby.alt}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[78%] bg-[linear-gradient(to_top,var(--lacquer)_0%,color-mix(in_oklch,var(--lacquer)_82%,transparent)_38%,transparent_100%)]" />
          <div className="absolute inset-y-0 start-0 w-2/3 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--lacquer)_55%,transparent),transparent)] max-lg:hidden" />
          {/* Phones: the copy stacks over the bright ceiling, so the whole render takes a lacquer shade */}
          <div className="absolute inset-0 bg-lacquer/60 lg:hidden" />
          <ImpressionTag className="!bottom-auto !start-auto end-3 top-3" />
        </div>

        <div className="flex-1" />

        <div data-hero-content className="frame pb-6 pt-16 lg:pb-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Reveal>
                <Image src={images.beaumonteLogo.src} alt="" width={189} height={84} className="h-11 w-auto opacity-90" style={{ width: "auto" }} />
              </Reveal>
              <Reveal kind="wipe" delay={150} className="mt-6">
                <p className="t-label text-accent-on-navy">{beaumonte.intro.kicker}</p>
              </Reveal>
              <h1 id="bm-title" className="t-display mt-3 text-ivory">
                <SplitText delay={250}>{project.name}</SplitText>
              </h1>
              <Reveal delay={550}>
                <p className="t-lead mt-4 max-w-[40ch] text-ivory-muted">{beaumonte.intro.title}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ButtonLink href="?intent=visit#visit">Book a site visit</ButtonLink>
                  <ButtonLink href="?intent=brochure#visit" variant="outline">
                    Request the brochure
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
            <Reveal delay={700} className="lg:col-span-4 lg:justify-self-end">
              <ReraPlaque project={project} />
            </Reveal>
          </div>

          {/* Facts as a title-block strip */}
          <Reveal delay={800} className="mt-8 lg:mt-10">
            <dl className="tblock grid-cols-2 sm:grid-cols-4 [&>*:first-child]:!ps-0 max-sm:[&>*:nth-child(3)]:!border-s-0 max-sm:[&>*:nth-child(3)]:!ps-0 max-sm:[&>*:nth-child(n+3)]:border-t max-sm:[&>*:nth-child(n+3)]:border-datum-navy">
              {project.facts.map((f, i) => (
                <div key={f.label} className="flex flex-col-reverse gap-2">
                  <dt className="t-note text-ivory-muted">{f.label}</dt>
                  <dd className="t-numeral text-[clamp(2.2rem,1.6rem+1.6vw,3.25rem)] text-brass">
                    <RollingNumber value={f.value} delay={900 + i * 100} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <LiftIndex stops={stops} />

      {/* L01 Philosophy */}
      <LevelSection id="philosophy" level="L01" label="Philosophy" meta="Tower C, Sion Circle">
        <div className="frame grid gap-10 lg:grid-cols-12">
          <h2 className="t-h2 lg:col-span-6">
            <SplitText>{beaumonte.intro.lede}</SplitText>
          </h2>
          <Reveal delay={150} className="lg:col-span-5 lg:col-start-8">
            {beaumonte.intro.body.map((p, i) => (
              <p key={i} className={i === 0 ? "t-lead" : "t-body mt-5 text-graphite-muted"}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>
        <div className="frame mt-14 grid gap-10 md:grid-cols-12 md:gap-6">
          <Parallax className="md:col-span-8">
          <Plate
            image={images.beaumonteTowerCorner}
            no="01"
            caption="Tower C, corner view from below"
            sizes="(min-width: 768px) 60vw, 92vw"
            frameClassName="aspect-[1280/668] md:aspect-auto md:h-[clamp(17rem,30vw,27rem)]"
          />
          </Parallax>
          <Plate
            className="md:col-span-4"
            image={images.beaumonteSketch}
            no="02"
            caption="Pencil elevation of the BeauMonté towers"
            sizes="(min-width: 768px) 30vw, 92vw"
            contain
            delay={120}
            frameClassName="aspect-[442/540] bg-[var(--paper)] md:aspect-auto md:h-[clamp(17rem,30vw,27rem)]"
            imageClassName="mix-blend-normal"
          />
        </div>
        <Reveal className="frame mt-14 lg:mt-20">
          <blockquote className="grid gap-6 border-t border-datum pt-8 lg:grid-cols-12">
            <span aria-hidden className="t-numeral text-7xl leading-[0.6] text-accent-ink lg:col-span-1">
              &ldquo;
            </span>
            <p className="t-statement text-accent-ink lg:col-span-9">
              <SplitText>{beaumonte.intro.quote}</SplitText>
            </p>
          </blockquote>
        </Reveal>
      </LevelSection>

      {/* L02 Section explorer (signature) */}
      <LevelSection id="section" level="L02" label="Floor by floor" tone="navy" meta="Section A–A, Tower C">
        <div className="frame mb-10 grid gap-6 lg:mb-12 lg:grid-cols-12 lg:items-end">
          <h2 className="t-h2 lg:col-span-7">
            <SplitText>Every level, labelled.</SplitText>
          </h2>
          <Reveal delay={150} className="lg:col-span-5">
            <p className="t-body text-ivory-muted">
              Ride the tower from the basement to the crown. Each stop shows what that level holds and, on residential floors, the RERA carpet area of every home.
            </p>
          </Reveal>
        </div>
        <Reveal delay={200} className="frame">
          <SectionExplorer levels={beaumonte.levels} tables={beaumonte.unitTables} views={beaumonte.views} />
        </Reveal>
      </LevelSection>

      {/* L03 Residences */}
      <LevelSection id="residences" level="L03" label="Residences" meta="RERA carpet areas, sq ft">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <h2 className="t-h2">
                <SplitText>{beaumonte.residences.title}</SplitText>
              </h2>
              <Reveal delay={150}>
                <p className="t-body mt-6 text-graphite-muted">{beaumonte.residences.body}</p>
                <ButtonLink href="?intent=brochure#visit" variant="outline" className="mt-8">
                  Floor plans with the brochure
                </ButtonLink>
              </Reveal>
            </div>
          </div>
          <Reveal delay={200} className="min-w-0 lg:col-span-8">
            <UnitTables tables={beaumonte.unitTables} note={beaumonte.residences.note} />
          </Reveal>
        </div>
      </LevelSection>

      {/* L04 Amenities */}
      <LevelSection id="amenities" level="L04" label="Amenities" tone="travertine-2" meta={`${beaumonte.amenities.clubs.length} clubs`}>
        <div className="frame mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="t-h2 lg:col-span-6">
            <SplitText>{beaumonte.amenities.title}</SplitText>
          </h2>
          <Reveal delay={150} className="lg:col-span-5 lg:col-start-8">
            <p className="t-body text-graphite-muted">{beaumonte.amenities.body}</p>
            <p className="t-label mt-5 text-accent-ink">{beaumonte.amenities.note}</p>
          </Reveal>
        </div>
        <Parallax className="frame mb-14" amount={6}>
          <Plate
            image={images.beaumontePool}
            no="03"
            caption="Podium pool deck at dusk"
            sizes="(min-width: 1360px) 1280px, 92vw"
            frameClassName="aspect-[1312/777] max-h-[min(34rem,calc(100svh-var(--header-h)-8rem))] w-full"
          />
        </Parallax>
        <Reveal className="frame">
          <ClubDirectory clubs={beaumonte.amenities.clubs} />
        </Reveal>
      </LevelSection>

      {/* L05 Views */}
      <LevelSection id="views" level="L05" label="Views" tone="lacquer" meta="Orientation">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <h2 className="t-h2">
              <SplitText>Privacy is the new view.</SplitText>
            </h2>
            <div className="mt-10 max-w-[20rem] lg:mt-12">
              <OrientationDiagram views={beaumonte.views} storeys={storeys} />
            </div>
          </div>
          <ol suppressHydrationWarning data-reveal="stagger" className="lg:col-span-7">
            {beaumonte.views.map((v, i) => (
              <li key={v.dir} style={{ ["--i" as string]: i } as CSSProperties} className="grid grid-cols-[5.5rem_1fr] gap-6 border-t border-datum-navy py-7 last:border-b">
                <span className="t-label pt-1 text-accent-on-navy">{v.dir}</span>
                <p className="t-body text-ivory-muted">{v.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </LevelSection>

      {/* L06 Location */}
      <LevelSection id="location" level="L06" label="Location" tone="navy" meta="Sion Circle, Mumbai 400 022">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="t-h2">
              <SplitText>{beaumonte.location.title}</SplitText>
            </h2>
            <Reveal delay={150}>
              {beaumonte.location.body.map((p, i) => (
                <p key={i} className={i === 0 ? "t-lead mt-6 text-ivory" : "t-body mt-4 text-ivory-muted"}>
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
          <Reveal delay={200} className="lg:col-span-5 lg:col-start-8">
            <MapOnRequest query="BeauMonte Sion Circle Mumbai 400022" label="BeauMonté, Sion Circle">
              <div className="relative mx-auto aspect-[1315/1878] max-h-[min(34rem,calc(100svh-var(--header-h)-10rem))] bg-[oklch(0.45_0.08_150)]">
                <Image src={images.beaumonteMap.src} alt={images.beaumonteMap.alt} fill sizes="(min-width: 1024px) 34vw, 92vw" className="object-contain" />
              </div>
            </MapOnRequest>
          </Reveal>
        </div>
        <div className="frame mt-16 lg:mt-20">
          <h3 className="t-label mb-6 text-brass">Key connections</h3>
          <KeyConnections items={beaumonte.location.key} />
          <p className="mt-3 text-xs text-ivory-muted">{beaumonte.location.note}</p>
        </div>
        <div className="frame mt-14">
          <h3 className="t-label mb-4 text-brass">The day looks after itself</h3>
          <TravelGroups groups={beaumonte.location.groups} />
        </div>
      </LevelSection>

      {/* L07 Architecture */}
      <LevelSection id="architecture" level="L07" label="Architecture & specifications" meta="Schedule">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="t-h2">
              <SplitText>{beaumonte.architecture.title}</SplitText>
            </h2>
            <Reveal delay={150}>
              {beaumonte.architecture.body.map((p, i) => (
                <p key={i} className={i === 0 ? "t-lead mt-6" : "t-body mt-4 text-graphite-muted"}>
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal delay={250}>
              <dl className="mt-10 border-t border-datum">
                {beaumonte.partners.map((p) => (
                  <div key={p.role} className="grid gap-1 border-b border-datum py-4 sm:grid-cols-[9rem_1fr]">
                    <dt className="t-label text-graphite-muted">{p.role}</dt>
                    <dd>{p.name}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            {/* Specifications as a drawing schedule: ruled cells, small label over value */}
            <Reveal>
              <p className="t-label pb-3 text-accent-ink">Tower specifications</p>
              <div aria-hidden className="inlay" />
              <dl className="grid grid-cols-2 border-b border-datum sm:grid-cols-3">
                {beaumonte.specs.map((s) => (
                  <div key={s.label} className="border-t border-datum py-4 pe-4 [&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(-n+3)]:border-t-0">
                    <dt className="t-note text-graphite-muted">{s.label}</dt>
                    <dd className="t-level mt-1.5 text-lg">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={150} className="mt-10">
              <p className="t-label text-graphite-muted">The developer</p>
              <p className="t-h3 mt-2">{beaumonte.developer.title}</p>
              {beaumonte.developer.body.map((p) => (
                <p key={p} className="t-body mt-3 text-sm text-graphite-muted">
                  {p}
                </p>
              ))}
              <p className="mt-4 text-sm">{beaumonte.developer.credit}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {beaumonte.promise.map((p) => (
                  <li key={p} className="t-label border border-datum px-3 py-2 text-[0.64rem]">
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </LevelSection>

      {/* L08 Visit */}
      <LevelSection id="visit" level="L08" label="Visit & enquire" tone="travertine-2" meta="Sales Experience Centre">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <h2 className="t-h2">
                <SplitText>This is an address you arrive at.</SplitText>
              </h2>
              <Reveal delay={150}>
                <p className="t-body mt-6 text-graphite-muted">
                  Tell us when you would like to come. Our team will call to confirm and walk you through the floor plates.
                </p>
                <div className="mt-10 grid gap-1">
                  <p className="t-label text-graphite-muted">Sales</p>
                  <a href={company.salesPhone.href} className="t-numeral w-fit py-1 text-5xl text-accent-ink">
                    {company.salesPhone.display}
                  </a>
                  <a href={`mailto:${company.salesEmail}`} className="w-fit py-2 underline-offset-4 hover:underline">
                    {company.salesEmail}
                  </a>
                  <address className="mt-4 text-sm not-italic text-graphite-muted">
                    Sales Experience Centre
                    <br />
                    Near PVR Cinema, opp. Croma Showroom
                    <br />
                    Sion Circle, Sion East, Mumbai 400 022
                  </address>
                </div>
              </Reveal>
            </div>
          </div>
          <Reveal delay={200} className="lg:col-span-7 lg:col-start-6">
            <Suspense fallback={<div className="h-[48rem]" aria-hidden />}>
              <EnquiryForm project={project.slug} projectName={project.name} />
            </Suspense>
          </Reveal>
        </div>
        <div className="frame mt-20">
          <StepRule />
          <p className="mt-6 max-w-[90ch] text-xs leading-relaxed text-graphite-muted">
            MahaRERA registration {project.rera!.number}, available at maharera.maharashtra.gov.in. {beaumonte.disclaimer} Images marked
            &ldquo;Artist&apos;s impression&rdquo; are computer-generated and indicative.
          </p>
        </div>
      </LevelSection>

      <MobileActionBar />
      <JsonLd data={ld} />
    </div>
  );
}
