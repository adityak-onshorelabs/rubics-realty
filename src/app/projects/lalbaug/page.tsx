import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { getProject, images } from "@/content/en";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { LevelSection } from "@/components/site/level-section";
import { PageHeader } from "@/components/site/page-header";

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
          <figure className="lg:col-span-7">
            <div className="relative aspect-[1212/704] bg-travertine">
              <Image src={images.lalbaugSketch.src} alt={images.lalbaugSketch.alt} fill sizes="(min-width: 1024px) 55vw, 92vw" className="object-contain mix-blend-multiply" />
            </div>
            <figcaption className="t-label mt-3 text-graphite-muted">Concept sketch. Design subject to approvals.</figcaption>
          </figure>
          <div className="lg:col-span-4 lg:col-start-9">
            <h2 className="t-h2">A future landmark, built to compel.</h2>
            <p className="t-body mt-6 text-graphite-muted">{project.summary}</p>
            <p className="t-body mt-4 text-graphite-muted">
              Details, configurations and registration will be published here at launch. Leave your number and we will call you first.
            </p>
          </div>
        </div>
      </LevelSection>

      <LevelSection id="visit" level="L02" label="Register interest" tone="travertine-2">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <h2 className="t-h2 lg:col-span-4">Hear about Lalbaug first.</h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <Suspense fallback={<div className="h-[36rem]" aria-hidden />}>
              <EnquiryForm project={project.slug} projectName="the Lalbaug residence" options={["callback"]} showConfig={false} />
            </Suspense>
          </div>
        </div>
        <p className="frame mt-16 text-xs text-graphite-muted">
          This page is for information only and does not constitute an offer. Project details will be shared after registration with MahaRERA.
        </p>
      </LevelSection>
    </div>
  );
}
