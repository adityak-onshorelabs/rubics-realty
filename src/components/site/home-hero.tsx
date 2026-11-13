import { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { home, images, projects } from "@/content/en";
import { HeroFilm, HeroFilmToggle, HeroFilmVideo } from "./hero-video";
import { Reveal, SplitText } from "./reveal";
import { HeroScroll } from "./scroll-fx";

/**
 * Home arrival. The film is the hero: full-bleed under a transparent header, kept to a headline, one link and
 * the film control. Shade stays at the top edge (nav) and bottom edge (headline); type carries its own shadow.
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
          <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(to_top,color-mix(in_oklch,var(--lacquer)_72%,transparent)_0%,color-mix(in_oklch,var(--lacquer)_32%,transparent)_45%,transparent_100%)] md:h-[34%]" />
        </div>

        <div className="flex-1" />

        {/* Minimal by brief: the film leads. One headline, one way in, and the film control. */}
        <div data-hero-content className="frame pb-6 sm:pb-8">
          <h1
            id="hero-title"
            className="t-hero max-w-[14ch] font-[450] text-ivory [text-shadow:0_2px_28px_rgb(0_0_0/0.45),0_1px_2px_rgb(0_0_0/0.35)]"
          >
            <SplitText lines={home.hero.title} delay={350} />
          </h1>

          <Reveal delay={750} className="mt-6 flex items-center justify-between gap-4 lg:mt-8">
            {live ? (
              <Link
                href={`/projects/${live.slug}`}
                className="group t-label inline-flex min-h-11 items-center gap-3 text-[0.68rem] text-ivory [text-shadow:0_1px_10px_rgb(0_0_0/0.5)]"
              >
                <span className="flex size-10 items-center justify-center border border-ivory/60 bg-lacquer/20 backdrop-blur-[2px] transition-colors duration-300 group-hover:border-ivory group-hover:bg-ivory group-hover:text-lacquer">
                  <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                </span>
                Explore {live.name}
              </Link>
            ) : (
              <span />
            )}
            <HeroFilmToggle className="[text-shadow:0_1px_10px_rgb(0_0_0/0.5)]" />
          </Reveal>
        </div>
      </section>
    </HeroFilm>
  );
}
