import { company } from "@/content/en";
import { ButtonLink } from "./button-link";
import { LevelSection } from "./level-section";

export function VisitBand({
  level,
  title = "See it from the inside.",
  body = "Visit the Sales Experience Centre at Sion Circle. Our team will walk you through the tower, the floor plates and the views.",
  href = "/projects/beaumonte-tower-c#visit",
}: {
  level: string;
  title?: string;
  body?: string;
  href?: string;
}) {
  return (
    <LevelSection level={level} label="Visit" tone="lacquer">
      <div className="frame grid gap-10 lg:grid-cols-12">
        <h2 className="t-h2 lg:col-span-7">{title}</h2>
        <div className="lg:col-span-5">
          <p className="t-body text-ivory-muted">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={href}>Book a site visit</ButtonLink>
            <ButtonLink href={company.salesPhone.href} variant="outline" arrow={false}>
              Call {company.salesPhone.display}
            </ButtonLink>
          </div>
        </div>
      </div>
    </LevelSection>
  );
}
