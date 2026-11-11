import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { beaumonte, company, getProject, images } from "@/content/en";
import { absoluteUrl } from "@/lib/site";
import { ButtonLink } from "@/components/site/button-link";
import { ClubDirectory } from "@/components/site/club-directory";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { FiguresLine } from "@/components/site/figures-line";
import { ImpressionTag } from "@/components/site/impression-tag";
import { JsonLd } from "@/components/site/json-ld";
import { LevelSection } from "@/components/site/level-section";
import { LiftIndex, type LiftStop } from "@/components/site/lift-index";
import { MapOnRequest } from "@/components/site/map-on-request";
import { MobileActionBar } from "@/components/site/mobile-action-bar";
import { ReraPlaque } from "@/components/site/rera-plaque";
import { Reveal } from "@/components/site/reveal";
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
  return (
    <div className="accent-beaumonte">
      {/* L00 Overview / hero */}
      <section id="overview" data-level="L00" data-label="Overview" aria-labelledby="bm-title" tabIndex={-1} className="on-lacquer relative isolate overflow-hidden outline-none">
        <div className="absolute inset-0 -z-10">
          <Image
            src={images.beaumonteLobby.src}
            alt={images.beaumonteLobby.alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--lacquer)_5%,color-mix(in_oklch,var(--lacquer)_75%,transparent)_45%,color-mix(in_oklch,var(--lacquer)_35%,transparent)_100%)]" />
          <ImpressionTag className="!bottom-auto top-3" />
        </div>
        <div className="frame grid min-h-[calc(100svh-var(--header-h))] content-end gap-10 pb-12 pt-24 lg:grid-cols-12 lg:pb-16">
          <div className="lg:col-span-8">
            <Image src={images.beaumonteLogo.src} alt="" width={189} height={84} className="h-14 w-auto opacity-90" style={{ width: "auto" }} />
            <p className="t-label mt-8 text-accent-on-navy">{beaumonte.intro.kicker}</p>
            <h1 id="bm-title" className="t-display mt-4 text-ivory">
              {project.name}
            </h1>
            <p className="t-lead mt-5 max-w-[40ch] text-ivory-muted">{beaumonte.intro.title}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="?intent=visit#visit">Book a site visit</ButtonLink>
              <ButtonLink href="?intent=brochure#visit" variant="outline">
                Request the brochure
              </ButtonLink>
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-4 lg:items-end">
            <ReraPlaque project={project} />
          </div>
          <div className="lg:col-span-12">
            <FiguresLine figures={project.facts} size="md" />
          </div>
        </div>
      </section>

      <LiftIndex stops={stops} />

      {/* L01 Philosophy */}
      <LevelSection id="philosophy" level="L01" label="Philosophy">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <h2 className="t-h2 lg:col-span-6">{beaumonte.intro.lede}</h2>
          <div className="lg:col-span-5 lg:col-start-8">
            {beaumonte.intro.body.map((p, i) => (
              <p key={i} className={i === 0 ? "t-lead" : "t-body mt-5 text-graphite-muted"}>
                {p}
              </p>
            ))}
            <p className="t-h3 mt-10 border-t border-datum pt-6 font-normal text-accent-ink">&ldquo;{beaumonte.intro.quote}&rdquo;</p>
          </div>
        </div>
        <div className="frame mt-16 grid gap-6 md:grid-cols-12">
          <Reveal as="figure" className="relative aspect-[1280/668] overflow-hidden md:col-span-8">
            <Image src={images.beaumonteTowerCorner.src} alt={images.beaumonteTowerCorner.alt} fill sizes="(min-width: 768px) 60vw, 92vw" className="object-cover" />
            <ImpressionTag />
          </Reveal>
          <Reveal as="figure" delay={0.08} className="relative aspect-[442/540] bg-travertine-2 md:col-span-4">
            <Image src={images.beaumonteSketch.src} alt={images.beaumonteSketch.alt} fill sizes="(min-width: 768px) 30vw, 92vw" className="object-contain p-4 mix-blend-multiply" />
          </Reveal>
        </div>
      </LevelSection>

      {/* L02 Section explorer (signature) */}
      <LevelSection id="section" level="L02" label="Floor by floor" tone="navy">
        <div className="frame mb-12 grid gap-6 lg:grid-cols-12">
          <h2 className="t-h2 lg:col-span-7">Every level, labelled.</h2>
          <p className="t-body text-ivory-muted lg:col-span-5">
            Ride the tower from the basement to the crown. Each stop shows what that level holds and, on residential floors, the RERA carpet area of every home.
          </p>
        </div>
        <div className="frame">
          <SectionExplorer levels={beaumonte.levels} tables={beaumonte.unitTables} views={beaumonte.views} />
        </div>
      </LevelSection>

      {/* L03 Residences */}
      <LevelSection id="residences" level="L03" label="Residences">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="t-h2">{beaumonte.residences.title}</h2>
            <p className="t-body mt-6 text-graphite-muted">{beaumonte.residences.body}</p>
            <ButtonLink href="?intent=brochure#visit" variant="outline" className="mt-8">
              Floor plans with the brochure
            </ButtonLink>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <UnitTables tables={beaumonte.unitTables} note={beaumonte.residences.note} />
          </div>
        </div>
      </LevelSection>

      {/* L04 Amenities */}
      <LevelSection id="amenities" level="L04" label="Amenities" tone="travertine-2">
        <div className="frame mb-12 grid gap-6 lg:grid-cols-12">
          <h2 className="t-h2 lg:col-span-6">{beaumonte.amenities.title}</h2>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="t-body text-graphite-muted">{beaumonte.amenities.body}</p>
            <p className="t-label mt-5 text-accent-ink">{beaumonte.amenities.note}</p>
          </div>
        </div>
        <div className="frame">
          <ClubDirectory clubs={beaumonte.amenities.clubs} />
        </div>
        <div className="frame mt-14">
          <figure className="relative aspect-[1312/777] max-h-[34rem] w-full overflow-hidden">
            <Image src={images.beaumontePool.src} alt={images.beaumontePool.alt} fill sizes="92vw" className="object-cover" />
            <ImpressionTag />
          </figure>
        </div>
      </LevelSection>

      {/* L05 Views */}
      <LevelSection id="views" level="L05" label="Views" tone="lacquer">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <h2 className="t-h2 lg:col-span-5">Privacy is the new view.</h2>
          <ol className="grid gap-0 lg:col-span-7">
            {beaumonte.views.map((v, i) => (
              <Reveal as="li" key={v.dir} delay={i * 0.06} className="grid grid-cols-[6rem_1fr] gap-6 border-t border-datum-navy py-7">
                <span className="t-label pt-1 text-accent-on-navy">{v.dir}</span>
                <p className="t-body text-ivory-muted">{v.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </LevelSection>

      {/* L06 Location */}
      <LevelSection id="location" level="L06" label="Location" tone="navy">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="t-h2">{beaumonte.location.title}</h2>
            {beaumonte.location.body.map((p, i) => (
              <p key={i} className={i === 0 ? "t-lead mt-6 text-ivory" : "t-body mt-4 text-ivory-muted"}>
                {p}
              </p>
            ))}
            <div className="mt-10">
              <KeyConnections items={beaumonte.location.key} />
              <p className="mt-3 text-xs text-ivory-muted">{beaumonte.location.note}</p>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <MapOnRequest query="BeauMonte Sion Circle Mumbai 400022" label="BeauMonté, Sion Circle">
              <div className="relative mx-auto aspect-[1315/1878] max-h-[36rem] bg-[oklch(0.45_0.08_150)]">
                <Image src={images.beaumonteMap.src} alt={images.beaumonteMap.alt} fill sizes="(min-width: 1024px) 34vw, 92vw" className="object-contain" />
              </div>
            </MapOnRequest>
          </div>
        </div>
        <div className="frame mt-16">
          <h3 className="t-label mb-4 text-brass">The day looks after itself</h3>
          <TravelGroups groups={beaumonte.location.groups} />
        </div>
      </LevelSection>

      {/* L07 Architecture */}
      <LevelSection id="architecture" level="L07" label="Architecture & specifications">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="t-h2">{beaumonte.architecture.title}</h2>
            {beaumonte.architecture.body.map((p, i) => (
              <p key={i} className={i === 0 ? "t-lead mt-6" : "t-body mt-4 text-graphite-muted"}>
                {p}
              </p>
            ))}
            <dl className="mt-10 border-t border-datum">
              {beaumonte.partners.map((p) => (
                <div key={p.role} className="grid gap-1 border-b border-datum py-4 sm:grid-cols-[9rem_1fr]">
                  <dt className="t-label text-graphite-muted">{p.role}</dt>
                  <dd>{p.name}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <table className="w-full text-sm">
              <caption className="t-label pb-3 text-start text-accent-ink">Tower specifications</caption>
              <tbody>
                {beaumonte.specs.map((s) => (
                  <tr key={s.label} className="border-t border-datum">
                    <th scope="row" className="py-3.5 pe-4 text-start font-normal text-graphite-muted">
                      {s.label}
                    </th>
                    <td className="t-level py-3.5 text-end text-base">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-10">
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
            </div>
          </div>
        </div>
      </LevelSection>

      {/* L08 Visit */}
      <LevelSection id="visit" level="L08" label="Visit & enquire" tone="travertine-2">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="t-h2">This is an address you arrive at.</h2>
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
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Suspense fallback={<div className="h-[48rem]" aria-hidden />}>
              <EnquiryForm project={project.slug} projectName={project.name} />
            </Suspense>
          </div>
        </div>
        <div className="frame mt-20 border-t border-datum pt-6">
          <p className="max-w-[90ch] text-xs leading-relaxed text-graphite-muted">
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
