"use client";

import { RANKING_TABS } from "@/lib/scoring";
import { RankingTabKey } from "@/lib/types";

export function RankingTabs({ active, onChange }: { active: RankingTabKey; onChange: (tab: RankingTabKey) => void }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
      {RANKING_TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "border-brand-600 bg-brand-600 text-white shadow-card"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
