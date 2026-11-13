import Image from "next/image";
import type { Project } from "@/content/types";
import { cn } from "@/lib/utils";

/** MahaRERA registration as a brass plaque: number + QR, shown near the top of every project page. */
export function ReraPlaque({ project, className }: { project: Project; className?: string }) {
  if (!project.rera) return null;
  return (
    <div className={cn("plaque flex items-center gap-4 !p-3 !pe-4", className)} style={{ ["--plaque-fill" as string]: "color-mix(in oklch, var(--lacquer) 82%, transparent)" }}>
      <Image src={project.rera.qr.src} alt={project.rera.qr.alt} width={72} height={72} className="size-[72px] bg-ivory p-1" />
      <div>
        <p className="t-label text-[0.62rem] text-ivory-muted">MahaRERA registration</p>
        <p className="t-level mt-1 text-lg text-brass">{project.rera.number}</p>
        <a
          href={project.rera.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center text-xs text-ivory-muted underline underline-offset-4 hover:text-ivory"
        >
          Verify on maharera.maharashtra.gov.in<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
