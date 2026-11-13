import type { Metadata } from "next";
import { Suspense, type CSSProperties } from "react";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { company, offices } from "@/content/en";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { LevelSection } from "@/components/site/level-section";
import { MapOnRequest } from "@/components/site/map-on-request";
import { PageHeader } from "@/components/site/page-header";
import { Reveal, SplitText } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Contact | Sales Experience Centre, Sion Circle",
  description: "Call 1800 209 6363, write to sales@rubics.co, or visit the Rubics Sales Experience Centre at Sion Circle, Mumbai 400 022.",
  alternates: { canonical: "/contact" },
};

const directions = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export default function ContactPage() {
  const [salesCentre, ...otherOffices] = offices;

  const channels = [
    {
      label: "Call sales",
      value: company.salesPhone.display,
      note: "Toll-free in India",
      href: company.salesPhone.href,
      Icon: Phone,
      numeral: true,
      external: false,
    },
    ...(company.whatsapp
      ? [{ label: "WhatsApp", value: company.whatsapp.display, note: "Chat with the sales team", href: company.whatsapp.href, Icon: MessageCircle, numeral: true, external: true }]
      : []),
    {
      label: "Write",
      value: company.salesEmail,
      note: "Sales and brochure requests",
      href: `mailto:${company.salesEmail}`,
      Icon: Mail,
      numeral: false,
      external: false,
    },
    {
      label: "Visit",
      value: "Sion Circle, Sion East",
      note: "Sales Experience Centre",
      href: directions(salesCentre.mapQuery),
      Icon: MapPin,
      numeral: false,
      external: true,
    },
  ];

  return (
    <>
      <PageHeader
        level="L00"
        label="Contact"
        title="Come and see."
        lede="Call the sales team, write to us, or walk into the Sales Experience Centre at Sion Circle."
      >
        <ul suppressHydrationWarning data-reveal="stagger" style={{ ["--d" as string]: "400ms" } as CSSProperties} className="mt-12 grid border-t border-datum-navy lg:mt-14 lg:grid-cols-3 lg:divide-x lg:divide-datum-navy">
          {channels.map(({ label, value, note, href, Icon, numeral, external }, i) => (
            <li key={label} style={{ ["--i" as string]: i } as CSSProperties} className="border-b border-datum-navy lg:border-b-0 lg:[&:first-child>a]:ps-0 lg:[&:last-child>a]:pe-0">
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full flex-col gap-3 py-7 transition-colors hover:bg-navy-2/40 lg:px-8"
              >
                <span className="t-label flex items-center gap-2 text-brass">
                  <Icon aria-hidden className="size-4" />
                  {label}
                  <ArrowUpRight
                    aria-hidden
                    className="ms-auto size-4 text-ivory-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
                <span className={numeral ? "t-numeral text-5xl text-ivory" : "t-h3 font-normal text-ivory"}>{value}</span>
                <span className="text-sm text-ivory-muted">
                  {note}
                  {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </PageHeader>

      <LevelSection id="visit" level="L01" label="Enquire" meta="Visits, brochures, call backs">
        <div className="frame grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Form first: it is the main job of this page */}
          <div className="lg:col-span-7">
            <h2 className="t-h2 max-w-[16ch]">
              <SplitText>Tell us what you are looking for.</SplitText>
            </h2>
            <Reveal delay={150}>
              <p className="t-body mt-4 text-graphite-muted">
                Book a visit, ask for the brochure, or request a call back. The sales team will be in touch.
              </p>
            </Reveal>
            <Reveal delay={250} className="mt-10">
              <Suspense fallback={<div className="h-[48rem]" aria-hidden />}>
                <EnquiryForm />
              </Suspense>
            </Reveal>
          </div>

          {/* Places: sticky on desktop */}
          <aside aria-label="Our addresses" className="lg:col-span-4 lg:col-start-9">
            <div className="grid gap-10 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <div className="on-lacquer grain p-6 sm:p-8">
                <p className="t-label text-brass">{salesCentre.label}</p>
                <p className="t-h3 mt-3 text-ivory">Sion Circle, Sion East</p>
                <address className="mt-3 text-sm not-italic text-ivory-muted">
                  {salesCentre.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <p className="mt-4 text-sm text-ivory-muted">Three minutes from the Eastern Express Highway.</p>
                <div className="mt-6">
                  <MapOnRequest query={salesCentre.mapQuery} label={salesCentre.label}>
                    <a
                      href={directions(salesCentre.mapQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-label inline-flex min-h-[52px] items-center gap-3 bg-ivory px-6 text-lacquer hover:bg-travertine-2"
                    >
                      Get directions <ArrowUpRight aria-hidden className="size-4" />
                      <span className="sr-only"> (opens Google Maps in a new tab)</span>
                    </a>
                  </MapOnRequest>
                </div>
              </div>

              <dl className="border-t border-datum">
                {otherOffices.map((o) => (
                  <div key={o.label} className="border-b border-datum py-5">
                    <dt className="t-label text-brass-deep">{o.label}</dt>
                    <dd className="mt-2 text-sm">
                      <address className="not-italic">
                        {o.lines.map((l) => (
                          <span key={l} className="block">
                            {l}
                          </span>
                        ))}
                      </address>
                      <a
                        href={directions(o.mapQuery)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t-label rule-grow mt-2 inline-flex min-h-11 items-center pb-0.5"
                      >
                        Directions<span className="sr-only"> to {o.label} (opens Google Maps in a new tab)</span>
                      </a>
                    </dd>
                  </div>
                ))}
                <div className="border-b border-datum py-5">
                  <dt className="t-label text-brass-deep">Office line</dt>
                  <dd className="mt-2 grid gap-1 text-sm">
                    <a href={company.officePhone.href} className="inline-flex min-h-11 w-fit items-center underline-offset-4 hover:underline">
                      {company.officePhone.display}
                    </a>
                    <a href={`mailto:${company.generalEmail}`} className="inline-flex min-h-11 w-fit items-center underline-offset-4 hover:underline">
                      {company.generalEmail}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </LevelSection>
    </>
  );
}
