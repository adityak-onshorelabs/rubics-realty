import Image from "next/image";
import type { ReactNode } from "react";
import type { ImageAsset } from "@/content/types";
import { cn } from "@/lib/utils";
import { ImpressionTag } from "./impression-tag";

/**
 * An image presented as a numbered drawing plate: printer's crop marks outside the frame, a plate number and
 * caption underneath, and the "Artist's impression" tag on renders. The image rises into the frame on reveal.
 */
export function Plate({
  image,
  no,
  caption,
  sizes,
  className,
  frameClassName,
  imageClassName,
  contain = false,
  priority = false,
  marks = true,
  delay = 0,
  children,
}: {
  image: ImageAsset;
  /** Plate number, e.g. "03". */
  no?: string;
  caption?: ReactNode;
  sizes: string;
  className?: string;
  /** Sizing for the frame (aspect ratio, max height). Defaults to the image's own ratio. */
  frameClassName?: string;
  imageClassName?: string;
  contain?: boolean;
  priority?: boolean;
  marks?: boolean;
  delay?: number;
  children?: ReactNode;
}) {
  return (
    <figure className={cn("relative", className)}>
      <div className="relative">
        {marks ? <span aria-hidden className="plate-crop" /> : null}
        <div
          suppressHydrationWarning data-reveal="plate"
          style={{ ["--d" as string]: `${delay}ms`, aspectRatio: frameClassName?.includes("aspect-") ? undefined : `${image.width} / ${image.height}` }}
          className={cn("relative overflow-hidden", contain ? "bg-travertine-2" : "bg-lacquer", frameClassName)}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            {...(priority ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
            className={cn("plate-media", contain ? "object-contain p-4 mix-blend-multiply" : "object-cover", imageClassName)}
          />
          {image.impression ? <ImpressionTag /> : null}
          {children}
        </div>
      </div>
      {caption || no ? (
        <figcaption className="mt-3 flex items-baseline gap-3 text-sm opacity-80">
          {no ? <span className="t-note shrink-0 text-brass-deep [.on-lacquer_&]:text-brass [.on-navy_&]:text-brass">Pl. {no}</span> : null}
          {caption ? <span className="min-w-0">{caption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
