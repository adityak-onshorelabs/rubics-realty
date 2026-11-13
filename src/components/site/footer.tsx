import Image from "next/image";
import Link from "next/link";
import { company, images, nav, offices, projects } from "@/content/en";

export async function Footer() {
  "use cache";
  // Cached at build, so the copyright year is the deploy year.
  const year = new Date().getFullYear();
  return (
    <footer className="on-lacquer grain border-t border-datum-navy">
      <div className="frame grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Image src={images.logo.src} alt="Rubics" width={154} height={32} className="h-8 w-auto" style={{ width: "auto" }} />
          <p className="t-label mt-5 text-brass">{company.motto}</p>
          <div className="mt-8 grid gap-1">
            <a href={company.salesPhone.href} className="t-numeral w-fit py-1 text-4xl text-ivory hover:text-brass">
              {company.salesPhone.display}
            </a>
            <a href={company.officePhone.href} className="w-fit py-2 text-ivory-muted hover:text-ivory">
              Office {company.officePhone.display}
            </a>
            <a href={`mailto:${company.salesEmail}`} className="w-fit py-2 text-ivory-muted hover:text-ivory">
              {company.salesEmail}
            </a>
            <a href={`mailto:${company.generalEmail}`} className="w-fit py-2 text-ivory-muted hover:text-ivory">
              {company.generalEmail}
            </a>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5">
          {offices.map((o) => (
            <address key={o.label} className="not-italic">
              <p className="t-label text-brass">{o.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-ivory-muted">
                {o.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </p>
            </address>
          ))}
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 lg:col-span-3">
          <div>
            <p className="t-label text-brass">Site</p>
            <ul className="mt-3 grid">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="inline-flex min-h-10 items-center text-sm text-ivory-muted hover:text-ivory">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-label text-brass">Projects</p>
            <ul className="mt-3 grid">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="inline-flex min-h-10 items-center text-sm text-ivory-muted hover:text-ivory"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="t-label mt-6 text-brass">Follow</p>
            <ul className="mt-3 grid">
              {company.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center text-sm text-ivory-muted hover:text-ivory"
                  >
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t border-datum-navy">
        <div className="frame flex flex-col gap-3 py-6 text-xs text-ivory-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. A {company.group} company.
          </p>
          <p className="flex flex-wrap items-center gap-x-5">
            {projects
              .filter((p) => p.rera)
              .map((p) => (
                <span key={p.slug}>
                  {p.name}: MahaRERA {p.rera!.number}
                </span>
              ))}
            <Link href="/privacy" className="inline-flex min-h-11 items-center underline-offset-4 hover:text-ivory hover:underline">
              Privacy
            </Link>
            <Link href="/disclaimer" className="inline-flex min-h-11 items-center underline-offset-4 hover:text-ivory hover:underline">
              Disclaimer
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
