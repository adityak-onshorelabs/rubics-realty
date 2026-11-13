import type { LegalSection } from "@/content/legal";
import { PageHeader } from "./page-header";

export function LegalPage({ title, label, sections, children }: { title: string; label: string; sections: LegalSection[]; children?: React.ReactNode }) {
  return (
    <>
      <PageHeader level="L00" label={label} title={title} />
      <div className="stone">
      <div className="frame section-y grid lg:grid-cols-12">
        <div className="lg:col-span-8 lg:col-start-3">
          {children}
          {sections.map((s, i) => (
            <section key={i} className="border-t border-datum py-8 first:border-t-0 first:pt-0">
              {s.heading ? <h2 className="t-h3">{s.heading}</h2> : null}
              {s.paras.map((p, k) =>
                p.endsWith(":") ? (
                  <h3 key={k} className="t-label mt-6 text-brass-deep">
                    {p.slice(0, -1)}
                  </h3>
                ) : (
                  <p key={k} className="t-body mt-3 text-graphite-muted">
                    {p}
                  </p>
                ),
              )}
            </section>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}
