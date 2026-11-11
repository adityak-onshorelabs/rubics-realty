import type { Metadata } from "next";
import { projects } from "@/content/en";
import { disclaimer } from "@/content/legal";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Terms covering information, images and plans shown on rubicsrealty.com, and MahaRERA registration details.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer." label="Legal" sections={disclaimer}>
      <div className="plaque mb-10 text-sm">
        <p className="t-label text-brass-deep">MahaRERA registration</p>
        <ul className="mt-2">
          {projects
            .filter((p) => p.rera)
            .map((p) => (
              <li key={p.slug}>
                {p.name}: {p.rera!.number}, available at maharera.maharashtra.gov.in
              </li>
            ))}
        </ul>
        <p className="mt-2 text-graphite-muted">
          This is an authorised digital platform for Rubics Realty. Please rely on authorised channels and take care with third-party websites that use the
          company&apos;s name, logo or brand without authorisation.
        </p>
      </div>
    </LegalPage>
  );
}
