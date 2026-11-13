import type { Metadata } from "next";
import { Suspense } from "react";
import { getProject, images } from "@/content/en";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { LevelSection } from "@/components/site/level-section";
import { PageHeader } from "@/components/site/page-header";
import { Plate } from "@/components/site/plate";
import { Reveal, SplitText } from "@/components/site/reveal";

const project = getProject("lalbaug")!;

export const metadata: Metadata = {
  title: "Lalbaug, Mumbai | Rising soon",
  description: "A new Rubics Realty residence rising soon at Lalbaug, one of Mumbai's most iconic neighbourhoods. Register your interest.",
  alternates: { canonical: "/projects/lalbaug" },
};

// TODO(client): this page stays a teaser (no configurations, sizes or prices) until MahaRERA registration is confirmed.
export default function LalbaugPage() {
  return (
    <div className="accent-lalbaug">
      <PageHeader level="L00" label={`${project.statusLabel} · Lalbaug, Mumbai`} title="Lalbaug." lede={project.oneLine} />

      <LevelSection level="L01" label="The first sketch">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <Plate
            className="lg:col-span-7"
            image={images.lalbaugSketch}
            no="01"
            caption="Concept sketch. Design subject to approvals."
            sizes="(min-width: 1024px) 55vw, 92vw"
            contain
            frameClassName="aspect-[1212/704] max-h-[calc(100svh-var(--header-h)-9rem)] w-full"
          />
          <div className="lg:col-span-4 lg:col-start-9">
            <h2 className="t-h2">
              <SplitText>A future landmark, built to compel.</SplitText>
            </h2>
            <Reveal delay={150}>
              <p className="t-body mt-6 text-graphite-muted">{project.summary}</p>
              <p className="t-body mt-4 text-graphite-muted">
                Details, configurations and registration will be published here at launch. Leave your number and we will call you first.
              </p>
            </Reveal>
            <Reveal delay={300} className="mt-8">
              <dl className="tblock grid-cols-2 [&>*:first-child]:!ps-0">
                <div>
                  <dt className="t-note text-graphite-muted">Status</dt>
                  <dd className="t-label mt-1.5 text-accent-ink">{project.statusLabel}</dd>
                </div>
                <div>
                  <dt className="t-note text-graphite-muted">MahaRERA</dt>
                  <dd className="mt-1 text-sm">Details on launch</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </LevelSection>

      <LevelSection id="visit" level="L02" label="Register interest" tone="travertine-2">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <h2 className="t-h2 lg:col-span-4">
            <SplitText>Hear about Lalbaug first.</SplitText>
          </h2>
          <Reveal delay={200} className="lg:col-span-7 lg:col-start-6">
            <Suspense fallback={<div className="h-[36rem]" aria-hidden />}>
              <EnquiryForm project={project.slug} projectName="the Lalbaug residence" options={["callback"]} showConfig={false} />
            </Suspense>
          </Reveal>
        </div>
        <p className="frame mt-16 text-xs text-graphite-muted">
          This page is for information only and does not constitute an offer. Project details will be shared after registration with MahaRERA.
        </p>
      </LevelSection>
    </div>
  );
}
