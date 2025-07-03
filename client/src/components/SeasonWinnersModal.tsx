"use client"

import { useAppSelector, useAppDispatch } from "../store/hooks"
import { setShowWinnersModal } from "../store/slices/arenaSlice"

export default function SeasonWinnersModal() {
  const dispatch = useAppDispatch()
  const { winners, showWinnersModal, totalPool } = useAppSelector((state) => state.arena)

  const formatWalletAddress = (address: string) => {
    if (address.length <= 8) return address
    return `${address.slice(0, 4)}...${address.slice(-3)}`
  }

  const getRankStyle = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500 text-yellow-400"
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400 text-gray-300"
      case 3:
        return "bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500 text-orange-400"
      default:
        return "bg-gray-800/50 border-gray-600 text-gray-300"
    }
  }

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return "👑"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return "🎯"
    }
  }

  if (!showWinnersModal || winners.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-700">
          <div className="text-center">
            <h2 className="pixel-font text-2xl sm:text-3xl font-black text-emerald-400 neon-glow mb-2">
              🏆 SEASON COMPLETE!
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">Congratulations to our champions!</p>
            <div className="mt-2 bg-yellow-500/20 border border-yellow-500 rounded-lg px-3 py-1 inline-block">
              <span className="text-yellow-400 text-xs font-bold">Total Pool: {totalPool} GOR</span>
            </div>
          </div>
        </div>

        {/* Winners */}
        <div className="p-4 sm:p-6 space-y-3">
          {winners.slice(0, 3).map((winner) => (
            <div key={winner.wallet} className={`p-4 rounded-lg border ${getRankStyle(winner.position)} neon-border`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getRankIcon(winner.position)}</span>
                  <div>
                    <div className="font-bold text-sm sm:text-base pixel-font">
                      {winner.position === 1 ? "CHAMPION" : winner.position === 2 ? "RUNNER-UP" : "THIRD PLACE"}
                    </div>
                    <div className="text-xs sm:text-sm font-mono opacity-75">{formatWalletAddress(winner.wallet)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{winner.score.toLocaleString()}</div>
                  <div className="text-xs opacity-75">pts</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-current/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">Reward:</span>
                  <span className="text-lg font-black">{winner.reward} GOR</span>
                </div>
                <button
                  onClick={() => {
                    // Placeholder for explorer link
                    alert("Explorer link coming soon!")
                  }}
                  className="w-full mt-2 bg-purple-500 hover:bg-purple-600 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                >
                  🔍 View on Explorer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-700">
          <div className="text-center space-y-3">
            <p className="text-gray-400 text-sm">New season starting soon! Get ready for the next competition.</p>
            <button
              onClick={() => dispatch(setShowWinnersModal(false))}
              className="w-full bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-bold transition-all duration-200 neon-border"
            >
              Continue Playing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
