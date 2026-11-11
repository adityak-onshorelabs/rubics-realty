import type { Metadata } from "next";
import { projects } from "@/content/en";
import { DirectoryBoard } from "@/components/site/directory-board";
import { PageHeader } from "@/components/site/page-header";
import { VisitBand } from "@/components/site/visit-band";

export const metadata: Metadata = {
  title: "Projects | Residences in Sion and Lalbaug, Mumbai",
  description: "Rubics Realty projects in Mumbai: BeauMonté Tower C at Sion Circle, now selling (MahaRERA P51900050715), and a new residence rising soon at Lalbaug.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        level="L01"
        label="Directory"
        title="Addresses."
        lede="Mumbai neighbourhoods with long memories. One tower now selling, one rising soon."
      />
      <section data-level="L01" data-label="Directory" className="on-navy grain section-y !pt-10">
        <DirectoryBoard projects={projects} filter />
      </section>
      {/* TODO(client): add completed and landmark projects here once attribution wording is approved. */}
      <VisitBand level="L02" />
    </>
  );
}
