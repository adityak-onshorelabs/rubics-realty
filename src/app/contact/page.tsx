import type { Metadata } from "next";
import { Suspense } from "react";
import { company, offices } from "@/content/en";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { LevelSection } from "@/components/site/level-section";
import { MapOnRequest } from "@/components/site/map-on-request";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Contact | Sales Experience Centre, Sion Circle",
  description: "Call 1800 209 6363, write to sales@rubics.co, or visit the Rubics Sales Experience Centre at Sion Circle, Mumbai 400 022.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        level="L00"
        label="Contact"
        title="Come and see."
        lede={
          <>
            <a href={company.salesPhone.href} className="t-numeral block text-6xl text-brass">
              {company.salesPhone.display}
            </a>
            <a href={`mailto:${company.salesEmail}`} className="mt-3 inline-block underline-offset-4 hover:underline">
              {company.salesEmail}
            </a>
          </>
        }
      />

      <LevelSection level="L01" label="Where we are">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-6 lg:grid-cols-1">
            {offices.map((o) => (
              <address key={o.label} className="border-t border-datum pt-5 not-italic">
                <p className="t-label text-brass-deep">{o.label}</p>
                <p className="mt-3">
                  {o.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-label rule-grow mt-3 inline-flex min-h-11 items-center pb-0.5"
                >
                  Directions<span className="sr-only"> to {o.label} (opens Google Maps in a new tab)</span>
                </a>
              </address>
            ))}
            <div className="border-t border-datum pt-5">
              <p className="t-label text-brass-deep">Office line</p>
              <a href={company.officePhone.href} className="mt-3 block">
                {company.officePhone.display}
              </a>
              <a href={`mailto:${company.generalEmail}`} className="mt-1 block">
                {company.generalEmail}
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <MapOnRequest query={offices[0].mapQuery} label={offices[0].label}>
              <div className="plaque">
                <p className="t-label text-brass-deep">{offices[0].label}</p>
                <p className="t-h3 mt-3">Sion Circle, Sion East</p>
                <p className="t-body mt-2 text-graphite-muted">Near PVR Cinema, opposite the Croma showroom. Three minutes from the Eastern Express Highway.</p>
              </div>
            </MapOnRequest>
          </div>
        </div>
      </LevelSection>

      <LevelSection id="visit" level="L02" label="Enquire" tone="travertine-2">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <h2 className="t-h2 lg:col-span-4">Tell us what you are looking for.</h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <Suspense fallback={<div className="h-[48rem]" aria-hidden />}>
              <EnquiryForm />
            </Suspense>
          </div>
        </div>
      </LevelSection>
    </>
  );
}
