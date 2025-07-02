"use client"

import { useAppSelector } from "../store/hooks"

export default function MultiplayerRoomSidebar() {
  const { address: walletAddress } = useAppSelector((state) => state.wallet)
  const { currentScore } = useAppSelector((state) => state.game)
  const { entries } = useAppSelector((state) => state.leaderboard)

  // Create a simulated room with current player and top players from leaderboard
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
    isOnline: Math.random() > 0.3, // Simulate online status
    avatar: index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎮",
  }))

  // Combine current player with top players, avoiding duplicates
  const roomPlayers = [currentPlayer, ...topPlayers.filter((player) => player.id !== walletAddress)].slice(0, 5)

  return (
    <div className="w-80 bg-black/90 border-l border-gray-700 p-4 overflow-y-auto">
      <h3 className="pixel-font text-lg font-bold text-emerald-400 mb-4 neon-glow">
        🎮 LIVE ROOM ({roomPlayers.length}/8)
      </h3>

      <div className="space-y-2">
        {roomPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              player.id === walletAddress
                ? "bg-emerald-500/20 border border-emerald-500/50"
                : "bg-gray-800/50 border border-gray-600/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-xl">{player.avatar}</span>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                    player.isOnline ? "bg-green-400" : "bg-gray-400"
                  }`}
                />
              </div>
              <div>
                <div className={`font-bold text-sm ${player.id === walletAddress ? "text-emerald-400" : "text-white"}`}>
                  {player.username}
                  {player.id === walletAddress && " (You)"}
                </div>
                <div className="text-xs text-gray-400">#{index + 1}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-emerald-400">{player.score.toLocaleString()}</div>
              <div className="text-xs text-gray-400">pts</div>
            </div>
          </div>
        ))}

        {/* Empty slots */}
        {roomPlayers.length < 8 && (
          <>
            {[...Array(8 - roomPlayers.length)].map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-800/20 border border-gray-700/30"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl text-gray-600">👤</span>
                  <div>
                    <div className="font-bold text-sm text-gray-500">Waiting...</div>
                    <div className="text-xs text-gray-600">#{roomPlayers.length + index + 1}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-600">---</div>
                  <div className="text-xs text-gray-600">pts</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="mt-6 p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
        <div className="text-center text-sm text-gray-400 mb-2">Quick Chat</div>
        <div className="flex gap-2 flex-wrap justify-center">
          {["🔥", "💪", "😤", "🎯", "💎"].map((emoji) => (
            <button key={emoji} className="text-xl hover:scale-125 transition-transform duration-200">
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="bg-purple-500/20 border border-purple-500 rounded-lg px-3 py-1 inline-block">
          <span className="text-purple-400 text-xs font-bold">⚡ Powered by Gorbagana</span>
        </div>
      </div>
    </div>
  )
}
