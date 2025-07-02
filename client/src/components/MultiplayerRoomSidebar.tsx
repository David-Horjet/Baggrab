"use client"

import { useAppSelector } from "../store/hooks"

export default function MultiplayerRoomSidebar() {
  const { address: walletAddress } = useAppSelector((state) => state.wallet)
  const { currentScore } = useAppSelector((state) => state.game)
  const { entries } = useAppSelector((state) => state.leaderboard)

  const currentPlayer = {
    id: walletAddress || "unknown",
    username: walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-3)}` : "You",
    score: currentScore,
    isOnline: true,
    avatar: "🎯",
  }

  const topPlayers = entries.slice(0, 4).map((entry, index) => ({
    id: entry._id,
    username: `${entry._id.slice(0, 4)}...${entry._id.slice(-3)}`,
    score: entry.highestScore,
    isOnline: Math.random() > 0.3,
    avatar: index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎮",
  }))

  const roomPlayers = [currentPlayer, ...topPlayers.filter((player) => player.id !== walletAddress)].slice(0, 5)

  return (
    <div className="w-72 sm:w-80 bg-black/95 border-l border-gray-700 p-3 sm:p-4 overflow-y-auto h-full">
      <h3 className="pixel-font text-base sm:text-lg font-bold text-emerald-400 mb-3 sm:mb-4 neon-glow">
        🎮 LIVE ROOM ({roomPlayers.length}/8)
      </h3>

      <div className="space-y-2">
        {roomPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-200 ${
              player.id === walletAddress
                ? "bg-emerald-500/20 border border-emerald-500/50"
                : "bg-gray-800/50 border border-gray-600/30"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <span className="text-lg sm:text-xl">{player.avatar}</span>
                <div
                  className={`absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-black ${
                    player.isOnline ? "bg-green-400" : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className={`font-bold text-xs sm:text-sm truncate ${
                    player.id === walletAddress ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {player.username}
                  {player.id === walletAddress && " (You)"}
                </div>
                <div className="text-xs text-gray-400">#{index + 1}</div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-emerald-400 text-xs sm:text-sm">{player.score.toLocaleString()}</div>
              <div className="text-xs text-gray-400">pts</div>
            </div>
          </div>
        ))}

        {roomPlayers.length < 8 && (
          <>
            {[...Array(8 - roomPlayers.length)].map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-800/20 border border-gray-700/30"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl text-gray-600">👤</span>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-gray-500">Waiting...</div>
                    <div className="text-xs text-gray-600">#{roomPlayers.length + index + 1}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-600 text-xs sm:text-sm">---</div>
                  <div className="text-xs text-gray-600">pts</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="mt-4 sm:mt-6 p-2 sm:p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
        <div className="text-center text-xs sm:text-sm text-gray-400 mb-2">Quick Chat</div>
        <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
          {["🔥", "💪", "😤", "🎯", "💎"].map((emoji) => (
            <button key={emoji} className="text-lg sm:text-xl hover:scale-125 transition-transform duration-200 p-1">
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 sm:mt-4 text-center">
        <div className="bg-purple-500/20 border border-purple-500 rounded-lg px-2 sm:px-3 py-1 inline-block">
          <span className="text-purple-400 text-xs font-bold">⚡ Powered by Gorbagana</span>
        </div>
      </div>
    </div>
  )
}
