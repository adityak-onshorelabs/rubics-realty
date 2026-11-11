"use client";

import { useState } from "react";
import type { PressStory } from "@/content/types";
import { LevelTabs } from "./level-tabs";
import { PressList } from "./press-list";

export function PressFilter({ stories }: { stories: PressStory[] }) {
  const [tab, setTab] = useState("real-estate");
  const list = tab === "all" ? stories : stories.filter((s) => s.category === tab);
  return (
    <>
      <LevelTabs
        idBase="press"
        label="Filter press coverage"
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "real-estate", label: "Real estate", count: stories.filter((s) => s.category === "real-estate").length },
          { id: "group", label: "Rubics Group", count: stories.filter((s) => s.category === "group").length },
          { id: "all", label: "All", count: stories.length },
        ]}
      />
      <div id={`press-panel-${tab}`} role="tabpanel" aria-labelledby={`press-tab-${tab}`} className="mt-8">
        <PressList stories={list} />
      </div>
    </>
  );
}
