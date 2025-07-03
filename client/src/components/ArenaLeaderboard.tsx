"use client"

import { useAppSelector } from "../store/hooks"

export default function ArenaLeaderboard() {
  const { players, currentSeason } = useAppSelector((state) => state.arena)
  const { address: walletAddress } = useAppSelector((state) => state.wallet)

  const sortedPlayers = [...players]
    .filter((player) => player.isActive)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

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

  if (!currentSeason.isActive && sortedPlayers.length === 0) {
    return (
      <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
        <h3 className="pixel-font text-lg sm:text-xl font-bold text-gray-400 mb-4 text-center">🏟️ ARENA LEADERBOARD</h3>
        <div className="text-center">
          <div className="text-4xl sm:text-6xl mb-4">🏆</div>
          <p className="text-gray-400 text-sm sm:text-base">Season ended • Winners announced</p>
        </div>
      </div>
    )
  }

  if (sortedPlayers.length === 0) {
    return (
      <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
        <h3 className="pixel-font text-lg sm:text-xl font-bold text-emerald-400 mb-4 text-center neon-glow">
          🏟️ ARENA LEADERBOARD
        </h3>
        <div className="text-center">
          <div className="text-4xl sm:text-6xl mb-4">🎮</div>
          <p className="text-gray-400 text-sm sm:text-base mb-2">No scores yet this season</p>
          <p className="text-gray-500 text-xs sm:text-sm">Be the first to set a score!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="pixel-font text-lg sm:text-xl font-bold text-emerald-400 neon-glow">🏟️ ARENA LEADERBOARD</h3>
        <div className="bg-purple-500/20 border border-purple-500 rounded px-2 py-1">
          <span className="text-purple-400 text-xs font-bold">LIVE</span>
        </div>
      </div>

      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.wallet}
            className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border transition-all duration-200 ${getRankStyle(index)} ${
              player.wallet === walletAddress ? "ring-2 ring-emerald-500" : ""
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-lg sm:text-xl flex-shrink-0">{getRankIcon(index)}</span>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm pixel-font truncate">
                  #{index + 1} {formatWalletAddress(player.wallet)}
                  {player.wallet === walletAddress && " (You)"}
                </div>
                {index <= 2 && (
                  <div className="text-xs opacity-75">
                    {index === 0 ? "🏆 Champion" : index === 1 ? "🥈 Runner-up" : "🥉 Third Place"}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-sm sm:text-base">{player.score.toLocaleString()}</div>
              <div className="text-xs opacity-75">pts</div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4 text-xs text-gray-500">Top 3 players win GOR rewards • Season ends soon!</div>
    </div>
  )
}
