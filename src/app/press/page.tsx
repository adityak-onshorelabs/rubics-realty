import type { Metadata } from "next";
import { pressStories } from "@/content/press";
import { LevelSection } from "@/components/site/level-section";
import { PageHeader } from "@/components/site/page-header";
import { PressFilter } from "@/components/site/press-filter";

export const metadata: Metadata = {
  title: "Press | Rubics Realty in the news",
  description:
    "Coverage of Rubics Realty and Rubics Group: the BeauMonté Tower C launch, Sion and redevelopment in Mumbai, and the group's sport partnerships.",
  alternates: { canonical: "/press" },
};

export default function PressPage() {
  const outlets = new Set(pressStories.flatMap((s) => s.outlets)).size;
  return (
    <>
      <PageHeader
        level="L00"
        label="Press"
        title="In the news."
        lede={`${pressStories.length} stories, covered by ${outlets} publications.`}
      />
      <LevelSection level="L01" label="Coverage">
        <div className="frame">
          <PressFilter stories={pressStories} />
        </div>
      </LevelSection>
    </>
  );
}
