import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { pressStories } from "@/content/press";
import { absoluteUrl, formatDate } from "@/lib/site";
import { JsonLd } from "@/components/site/json-ld";
import { PageHeader } from "@/components/site/page-header";

export function generateStaticParams() {
  return pressStories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/press/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const story = pressStories.find((s) => s.slug === slug);
  if (!story) return {};
  return {
    title: story.title,
    description: story.summary.slice(0, 160),
    alternates: { canonical: `/press/${story.slug}` },
    openGraph: {
      type: "article",
      publishedTime: story.date,
      images: [{ url: story.image.src, width: story.image.width, height: story.image.height, alt: story.image.alt }],
    },
  };
}

export default async function PressStoryPage({ params }: PageProps<"/press/[slug]">) {
  const { slug } = await params;
  const story = pressStories.find((s) => s.slug === slug);
  if (!story) notFound();

  return (
    <article>
      <PageHeader
        level="L01"
        label={`Press · ${formatDate(story.date)}`}
        title={<span className="block text-[clamp(2.25rem,1.4rem+3.4vw,4.5rem)] leading-[1.02]">{story.title}</span>}
      />
      <div className="frame section-y grid gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <Link href="/press" className="t-label inline-flex min-h-11 items-center gap-2 text-graphite-muted hover:text-graphite">
            <ArrowLeft aria-hidden className="size-4" /> All press
          </Link>
          <p className="t-label mt-8 text-brass-deep">Covered by</p>
          <ul className="mt-3 grid gap-1 text-sm">
            {story.outlets.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </aside>
        <div className="lg:col-span-8 lg:col-start-5">
          <figure className="mb-10" style={{ maxWidth: story.image.width }}>
            <Image
              src={story.image.src}
              alt={story.image.alt}
              width={story.image.width}
              height={story.image.height}
              sizes="(min-width: 1024px) 50vw, 92vw"
              loading="eager"
              className="h-auto w-full bg-lacquer"
            />
          </figure>
          {/* Excerpt only: some items are third-party journalism, not Rubics releases. TODO(client): add original article links. */}
          {story.body.slice(0, 3).map((p, i) => (
            <p key={i} className={i === 0 ? "t-lead" : "t-body mt-5 text-graphite-muted"}>
              {p}
            </p>
          ))}
          <p className="mt-12 border-t border-datum pt-5 text-xs text-graphite-muted">
            Excerpt. Full coverage appeared in the publications listed, from {formatDate(story.date)}.
          </p>
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: story.title,
          image: absoluteUrl(story.image.src),
          datePublished: story.date,
          url: absoluteUrl(`/press/${story.slug}`),
          publisher: { "@id": absoluteUrl("/#organization") },
        }}
      />
    </article>
  );
}
