"use client"

import FilterTabs from "@/components/FilterTabs"
import LeaderboardTable from "@/components/LeaderboardTable"
import WalletSync from "@/components/WalletSync"
import { fetchLeaderboard } from "@/services/api"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setLeaderboardLoading, setLeaderboardEntries, setLeaderboardError } from "@/store/slices/leaderboardSlice"
import { useState, useEffect } from "react"

export type FilterType = "today" | "week" | "alltime"

export default function LeaderboardPage() {
  const dispatch = useAppDispatch()
  const [activeFilter, setActiveFilter] = useState<FilterType>("alltime")
  const { entries, loading, error } = useAppSelector((state) => state.leaderboard)

  useEffect(() => {
    const loadLeaderboard = async () => {
      dispatch(setLeaderboardLoading(true))
      try {
        const response = await fetchLeaderboard()
        dispatch(setLeaderboardEntries(response.data))
      } catch (error) {
        dispatch(setLeaderboardError(error instanceof Error ? error.message : "Failed to load leaderboard"))
      }
    }

    loadLeaderboard()
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <WalletSync />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="pixel-font text-4xl md:text-6xl font-black text-emerald-400 neon-glow mb-4">🏆 LEADERBOARD</h1>
          <p className="text-xl text-gray-300">See who's dominating the trash tide</p>
          <div className="mt-4">
            <div className="bg-purple-500/20 border border-purple-500 rounded-lg px-3 py-1 inline-block">
              <span className="text-purple-400 text-xs font-bold">⚡ Powered by Gorbagana</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* Leaderboard Table */}
        <LeaderboardTable filter={activeFilter} entries={entries} loading={loading} error={error} />

        {/* Back to Game */}
        <div className="text-center mt-8">
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 neon-border"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  )
}
