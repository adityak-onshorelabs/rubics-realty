import { ButtonLink } from "@/components/site/button-link";

export default function NotFound() {
  return (
    <section data-level="L404" className="on-lacquer grain">
      <div className="frame flex min-h-[70svh] flex-col justify-center py-24">
        <p className="t-numeral text-[clamp(6rem,4rem+10vw,12rem)] text-brass" aria-hidden>
          404
        </p>
        <h1 className="t-h2 mt-4">This floor isn&apos;t on the plans.</h1>
        <p className="t-body mt-4 text-ivory-muted">The page you asked for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to the lobby</ButtonLink>
          <ButtonLink href="/projects" variant="outline">
            View projects
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
