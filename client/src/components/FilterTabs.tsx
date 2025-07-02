"use client"

import type { FilterType } from "../app/leaderboard/page"

interface FilterTabsProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export default function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  const filters: { key: FilterType; label: string; icon: string }[] = [
    { key: "today", label: "Today", icon: "📅" },
    { key: "week", label: "This Week", icon: "📊" },
    { key: "alltime", label: "All Time", icon: "🏆" },
  ]

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-1 backdrop-blur-sm">
        <div className="flex gap-1">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
                activeFilter === filter.key
                  ? "bg-emerald-500 text-white neon-border"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
