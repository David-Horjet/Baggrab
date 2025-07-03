"use client"

import { useAppSelector } from "../store/hooks"

export default function ArenaStats() {
  const { playerCount, totalPool, currentSeasonId } = useAppSelector((state) => state.arena)

  if (!currentSeasonId && playerCount === 0) {
    return (
      <div className="bg-gray-800/80 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-gray-400 text-sm font-bold pixel-font">🏟️ Arena Closed</div>
          <div className="text-gray-500 text-xs">Next season starting soon</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-yellow-900/80 to-orange-900/80 border border-yellow-500 rounded-lg px-3 sm:px-4 py-2 backdrop-blur-sm neon-border">
      <div className="text-center">
        <div className="text-yellow-400 text-sm sm:text-base font-bold pixel-font flex items-center justify-center gap-2">
          <span>🪙</span>
          <span>{playerCount} Players</span>
          <span>•</span>
          <span>{totalPool} GOR in Pool</span>
        </div>
        <div className="text-yellow-300 text-xs mt-1">
          Winner takes {Math.floor(totalPool * 0.6)} GOR • 2nd: {Math.floor(totalPool * 0.3)} GOR • 3rd:{" "}
          {Math.floor(totalPool * 0.1)} GOR
        </div>
      </div>
    </div>
  )
}
