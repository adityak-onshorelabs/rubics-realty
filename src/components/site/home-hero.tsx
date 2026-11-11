import { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { home, images, projects } from "@/content/en";
import { ButtonLink } from "./button-link";
import { HeroVideo } from "./hero-video";
import { HeroLines } from "./hero-lines";

export function HomeHero() {
  const live = projects.find((p) => p.status === "launched");
  const common = { alt: "", sizes: "100vw", loading: "eager", fetchPriority: "high" } as const;
  const {
    props: { srcSet: mobileSrc },
  } = getImageProps({ ...common, src: images.heroPosterMobile.src, width: 600, height: 900, quality: 75 });
  const { props: desktopImg } = getImageProps({ ...common, src: images.heroPoster.src, width: 1600, height: 900, quality: 75 });
  return (
    <section data-level="L00" aria-labelledby="hero-title" className="on-lacquer relative isolate overflow-hidden">
      {/* Mobile: film fills the top of the screen and dissolves into lacquer; text sits on solid navy below.
          Desktop: film is full-bleed with scrims from the bottom and the start edge. */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[62svh] md:inset-0 md:h-auto">
        <picture>
          <source media="(max-width: 767px)" srcSet={mobileSrc} />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps (decorative, empty) */}
          <img {...desktopImg} className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
        </picture>
        <HeroVideo desktop="/media/hero-three-sixty-west.mp4" mobile="/media/hero-three-sixty-west-mobile.mp4" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--lacquer)_0%,color-mix(in_oklch,var(--lacquer)_80%,transparent)_22%,transparent_60%)] md:bg-[linear-gradient(to_top,var(--lacquer)_0%,color-mix(in_oklch,var(--lacquer)_70%,transparent)_35%,transparent_75%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--lacquer)_75%,transparent)_0%,transparent_60%)] max-md:hidden" />
      </div>

      <div className="frame flex min-h-[calc(100svh-var(--header-h))] flex-col justify-end pb-10 pt-[44svh] md:pt-28 lg:pb-14">
        <p className="t-label text-brass">{home.hero.lineage}</p>
        <h1 id="hero-title" className="t-display mt-5 max-w-[12ch] text-ivory">
          <HeroLines lines={home.hero.title} />
        </h1>
        <p className="t-lead mt-6 max-w-[44ch] text-ivory-muted">{home.hero.lede}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/projects">View projects</ButtonLink>
          {live ? (
            <ButtonLink href={`/projects/${live.slug}#visit`} variant="outline">
              Book a site visit
            </ButtonLink>
          ) : null}
        </div>

        {live?.rera ? (
          <Link
            href={`/projects/${live.slug}`}
            className="group mt-12 flex flex-col gap-2 border-t border-datum-navy pt-5 text-sm text-ivory-muted transition-colors hover:text-ivory sm:flex-row sm:items-center sm:gap-6"
          >
            <span className="t-label text-accent-on-navy accent-beaumonte">{live.statusLabel}</span>
            <span className="text-ivory">
              {live.name}, {live.locality}
            </span>
            <span className="t-level">MahaRERA {live.rera.number}</span>
            <span className="t-label ms-auto inline-flex items-center gap-2 max-sm:hidden">
              Explore the tower
              <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>
        ) : null}
        <p className="t-label mt-4 text-[0.62rem] text-ivory-muted">Film: {home.hero.videoCaption}</p>
      </div>
    </section>
  );
}
