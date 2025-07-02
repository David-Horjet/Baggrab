"use client"

import { FilterType } from "@/app/leaderboard/page";

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
    <div className="flex justify-center mb-6 sm:mb-8 px-4 sm:px-0">
      <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-1 backdrop-blur-sm w-full max-w-md sm:w-auto">
        <div className="flex gap-1">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all duration-200 text-sm sm:text-base ${
                activeFilter === filter.key
                  ? "bg-emerald-500 text-white neon-border"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <span className="mr-1 sm:mr-2">{filter.icon}</span>
              <span className="hidden sm:inline">{filter.label}</span>
              <span className="sm:hidden">{filter.key === "alltime" ? "All" : filter.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
