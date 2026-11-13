import { company, images, offices } from "@/content/en";
import { ButtonLink } from "./button-link";
import { LevelSection, StepRule } from "./level-section";
import { Plate } from "./plate";
import { Reveal, SplitText } from "./reveal";
import { Drift, Parallax } from "./scroll-fx";

/** Closing floor on group pages: the invitation, the sales centre's facts, and the lobby it opens onto. */
export function VisitBand({
  level,
  title = "See it from the inside.",
  body = "Visit the Sales Experience Centre at Sion Circle. Our team will walk you through the tower, the floor plates and the views.",
  href = "/projects/beaumonte-tower-c?intent=visit#visit",
}: {
  level: string;
  title?: string;
  body?: string;
  href?: string;
}) {
  return (
    <LevelSection level={level} label="Visit" tone="lacquer" meta="Sales Experience Centre, Sion Circle" className="overflow-x-clip">
      <div className="frame grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <Drift from={4} to={-4}>
            <h2 className="t-display">
              <SplitText>{title}</SplitText>
            </h2>
          </Drift>
          <Reveal delay={200}>
            <p className="t-lead mt-7 max-w-[42ch] text-ivory-muted">{body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={href}>Book a site visit</ButtonLink>
              <ButtonLink href={company.salesPhone.href} variant="outline" arrow={false}>
                Call {company.salesPhone.display}
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={350} className="mt-10">
            <dl className="tblock grid-cols-2 [&>*:first-child]:!ps-0 [&>*+*]:!ps-5">
              <div>
                <dt className="t-note text-ivory-muted">Address</dt>
                <dd className="mt-1.5 text-sm">
                  {offices[0].lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="t-note text-ivory-muted">Write</dt>
                <dd className="mt-1.5 text-sm">
                  <a href={`mailto:${company.salesEmail}`} className="rule-grow pb-0.5">
                    {company.salesEmail}
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Parallax>
          <Plate
            image={images.beaumonteLobby}
            no="V1"
            caption="BeauMonté arrival lobby"
            sizes="(min-width: 1024px) 36vw, 92vw"
            frameClassName="aspect-[4/5] max-h-[calc(100svh-var(--header-h)-9rem)] w-full"
          />
          </Parallax>
        </div>
      </div>
      <div className="frame mt-14 lg:mt-20">
        <StepRule />
      </div>
    </LevelSection>
  );
}
