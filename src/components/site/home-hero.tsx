import { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { home, images, projects } from "@/content/en";
import { HeroFilm, HeroFilmToggle, HeroFilmVideo } from "./hero-video";
import { Reveal, SplitText } from "./reveal";
import { HeroScroll } from "./scroll-fx";

/**
 * Home arrival. The film is the hero: full-bleed under a transparent header, a light shade only along the
 * bottom edge (behind the headline and the title-block strip) and a thin one at the top for the nav.
 */
export function HomeHero() {
  const live = projects.find((p) => p.status === "launched");
  const common = { alt: "", sizes: "100vw", loading: "eager", fetchPriority: "high" } as const;
  const {
    props: { srcSet: mobileSrc },
  } = getImageProps({ ...common, src: images.heroPosterMobile.src, width: 600, height: 900, quality: 75 });
  const { props: desktopImg } = getImageProps({ ...common, src: images.heroPoster.src, width: 1600, height: 900, quality: 75 });

  return (
    <HeroFilm desktop="/media/hero-three-sixty-west.mp4" mobile="/media/hero-three-sixty-west-mobile.mp4">
      <section
        id="arrival"
        data-level="L00"
        data-label="Arrival"
        aria-labelledby="hero-title"
        tabIndex={-1}
        className="on-lacquer relative isolate -mt-[var(--header-h)] flex min-h-[100svh] flex-col overflow-hidden outline-none"
      >
        <HeroScroll />
        <div className="absolute inset-0 -z-10">
          <div data-hero-media className="absolute inset-0 origin-top">
            <picture>
              <source media="(max-width: 767px)" srcSet={mobileSrc} />
              {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps (decorative, empty) */}
              <img {...desktopImg} className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
            </picture>
            <HeroFilmVideo />
          </div>
          {/* Top: just enough for the transparent header to read */}
          <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,color-mix(in_oklch,var(--lacquer)_78%,transparent)_0%,color-mix(in_oklch,var(--lacquer)_40%,transparent)_55%,transparent_100%)]" />
          {/* Bottom: behind the headline and strip only */}
          <div className="absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(to_top,color-mix(in_oklch,var(--lacquer)_86%,transparent)_0%,color-mix(in_oklch,var(--lacquer)_50%,transparent)_42%,transparent_100%)] md:h-[40%]" />
        </div>

        <div className="flex-1" />

        <div data-hero-content className="frame pb-3 sm:pb-4">
          <h1 id="hero-title" className="t-hero max-w-[14ch] text-ivory">
            <SplitText lines={home.hero.title} delay={350} />
          </h1>

          {live?.rera ? (
            <Reveal delay={750} className="mt-6 lg:mt-8">
              <Link
                href={`/projects/${live.slug}`}
                className="tblock group grid grid-cols-[minmax(0,1fr)_auto] text-ivory [--tblock-line:color-mix(in_oklch,var(--ivory)_24%,transparent)] sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)_auto] [&>*]:!pe-0 [&>*:first-child]:!ps-0 sm:[&>*+*]:!ps-5 lg:[&>*+*]:!ps-6"
              >
                <span className="hidden lg:block">
                  <span className="t-note block text-ivory/60">Status</span>
                  <span className="t-label mt-1.5 block text-accent-on-navy accent-beaumonte">{live.statusLabel}</span>
                </span>
                <span className="max-lg:!border-s-0 max-lg:!ps-0">
                  <span className="t-note block text-ivory/60">
                    <span className="lg:hidden">{live.statusLabel} · </span>Project
                  </span>
                  <span className="mt-1 block truncate">
                    {live.name}, {live.locality}
                  </span>
                </span>
                <span className="hidden sm:block">
                  <span className="t-note block text-ivory/60">MahaRERA</span>
                  <span className="t-level mt-1 block">{live.rera.number}</span>
                </span>
                <span className="flex items-center gap-3 !ps-5 lg:!ps-8">
                  <span className="t-label hidden text-[0.66rem] md:inline">Explore the tower</span>
                  <span className="flex size-10 items-center justify-center border border-ivory/35 transition-colors duration-300 group-hover:border-ivory group-hover:bg-ivory group-hover:text-lacquer">
                    <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                  <span className="sr-only md:hidden">Explore the tower</span>
                </span>
              </Link>
            </Reveal>
          ) : null}

          <Reveal delay={950} className="mt-1 flex items-center justify-between gap-4">
            <p className="t-note text-ivory/70">
              Film <span className="mx-1.5 text-brass">/</span> {home.hero.videoCaption}
            </p>
            <HeroFilmToggle />
          </Reveal>
        </div>
      </section>
    </HeroFilm>
  );
}
