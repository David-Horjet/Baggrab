"use client"

import { useAppSelector } from "../store/hooks"

export default function ArenaLeaderboardPreview() {
  const { leaderboard, mode, isLoadingLeaderboard, leaderboardError } = useAppSelector((state) => state.arena)
  const { address: walletAddress } = useAppSelector((state) => state.wallet)

  const formatWalletAddress = (address: string) => {
    if (address.length <= 8) return address
    return `${address.slice(0, 4)}...${address.slice(-3)}`
  }

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-500/20 border-yellow-500 text-yellow-400"
      case 1:
        return "bg-gray-400/20 border-gray-400 text-gray-300"
      case 2:
        return "bg-orange-500/20 border-orange-500 text-orange-400"
      default:
        return "bg-gray-800/50 border-gray-600 text-gray-300"
    }
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return "👑"
      case 1:
        return "🥈"
      case 2:
        return "🥉"
      default:
        return "🎯"
    }
  }

  if (mode !== "arena") return null

  if (isLoadingLeaderboard) {
    return (
      <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 backdrop-blur-sm">
        <h3 className="pixel-font text-lg font-bold text-yellow-400 mb-4 text-center neon-glow">🏟️ ARENA LEADERS</h3>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (leaderboardError) {
    return (
      <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 backdrop-blur-sm">
        <h3 className="pixel-font text-lg font-bold text-yellow-400 mb-4 text-center neon-glow">🏟️ ARENA LEADERS</h3>
        <div className="text-center">
          <p className="text-red-400 text-sm">Failed to load leaderboard</p>
        </div>
      </div>
    )
  }

  const topPlayers = leaderboard.slice(0, 5)

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="pixel-font text-lg font-bold text-yellow-400 neon-glow">🏟️ ARENA LEADERS</h3>
        <div className="bg-yellow-500/20 border border-yellow-500 rounded px-2 py-1">
          <span className="text-yellow-400 text-xs font-bold">LIVE</span>
        </div>
      </div>

      {topPlayers.length === 0 ? (
        <div className="text-center">
          <div className="text-4xl mb-2">🎮</div>
          <p className="text-gray-400 text-sm">No scores yet this season</p>
        </div>
      ) : (
        <div className="space-y-2">
          {topPlayers.map((player, index) => (
            <div
              key={player._id}
              className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${getRankStyle(index)} ${
                player._id === walletAddress ? "ring-2 ring-emerald-500" : ""
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg flex-shrink-0">{getRankIcon(index)}</span>
                <div className="min-w-0">
                  <div className="font-bold text-xs pixel-font truncate">
                    #{index + 1} {formatWalletAddress(player._id)}
                    {player._id === walletAddress && " (You)"}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-sm">{player.score.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-3 text-xs text-gray-500">Top 3 players win GOR rewards</div>
    </div>
  )
}
