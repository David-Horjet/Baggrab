"use client"

import { FilterType } from "@/app/leaderboard/page"
import { useAppSelector } from "../store/hooks"
import type { LeaderboardEntry } from "../store/slices/leaderboardSlice"

interface LeaderboardTableProps {
  filter: FilterType
  entries: LeaderboardEntry[]
  loading: boolean
  error: string | null
}

export default function LeaderboardTable({ filter, entries, loading, error }: LeaderboardTableProps) {
  const { address: walletAddress } = useAppSelector((state) => state.wallet)

  const getFilterTitle = () => {
    switch (filter) {
      case "today":
        return "Today's Champions"
      case "week":
        return "This Week's Leaders"
      case "alltime":
        return "All-Time Legends"
      default:
        return "Leaderboard"
    }
  }

  const formatWalletAddress = (address: string) => {
    if (address.length <= 8) return address
    return `${address.slice(0, 4)}...${address.slice(-3)}`
  }

  if (loading && entries.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-300">{getFilterTitle()}</h2>
        <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-8 backdrop-blur-sm text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-300">{getFilterTitle()}</h2>
        <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-8 backdrop-blur-sm text-center">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
            <p className="text-red-400 font-bold mb-2">⚠️ Failed to Load Leaderboard</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-bold transition-all duration-200"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-300">{getFilterTitle()}</h2>
        <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-8 backdrop-blur-sm text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-2xl font-bold text-gray-300 mb-2">No Scores Yet!</h3>
          <p className="text-gray-400 mb-6">Be the first to play and claim the top spot</p>
          <button
            onClick={() => (window.location.href = "/game")}
            className="bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 neon-border"
          >
            🎮 Start Playing
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-300">{getFilterTitle()}</h2>

      <div className="bg-gray-900/80 border border-gray-700 rounded-lg overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div className="bg-gray-800/50 border-b border-gray-700 p-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-bold text-gray-400">
            <div className="col-span-1">RANK</div>
            <div className="col-span-4">PLAYER</div>
            <div className="col-span-3">WALLET</div>
            <div className="col-span-2">SCORE</div>
            <div className="col-span-2">JOINED</div>
          </div>
        </div>

        {/* Players */}
        <div className="divide-y divide-gray-700">
          {entries.map((entry, index) => (
            <div
              key={entry._id}
              className={`p-4 transition-all duration-200 hover:bg-gray-800/30 ${
                entry._id === walletAddress ? "bg-emerald-500/10 border-l-4 border-emerald-500" : ""
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Rank */}
                <div className="col-span-1">
                  <div
                    className={`text-2xl font-black pixel-font ${
                      index === 0
                        ? "text-yellow-400"
                        : index === 1
                          ? "text-gray-300"
                          : index === 2
                            ? "text-orange-400"
                            : "text-gray-400"
                    }`}
                  >
                    #{index + 1}
                  </div>
                </div>

                {/* Player */}
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎯"}
                    </span>
                    <div>
                      <div className={`font-bold ${entry._id === walletAddress ? "text-emerald-400" : "text-white"}`}>
                        {formatWalletAddress(entry._id)}
                        {entry._id === walletAddress && " (You)"}
                      </div>
                      {index <= 2 && (
                        <div className="text-xs text-yellow-400">
                          {index === 0 ? "🏆 Champion" : index === 1 ? "🥈 Runner-up" : "🥉 Third Place"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Wallet */}
                <div className="col-span-3">
                  <div className="font-mono text-sm text-gray-400">{formatWalletAddress(entry._id)}</div>
                </div>

                {/* Score */}
                <div className="col-span-2">
                  <div className="text-lg font-bold text-emerald-400">{entry.highestScore.toLocaleString()}</div>
                </div>

                {/* Date */}
                <div className="col-span-2">
                  <div className="text-gray-400 text-sm">{new Date(entry.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="text-center mt-6 text-gray-400">
        <p>
          Showing {entries.length} player{entries.length !== 1 ? "s" : ""}
        </p>
        {loading && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Updating...</span>
          </div>
        )}
      </div>
    </div>
  )
}
