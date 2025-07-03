"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../store/hooks"
import { getArenaStatus } from "@/services/arenaApi"
import { setCurrentSeason, setPlayerCount, setTotalGorPool } from "@/store/slices/arenaSlice"

export default function ArenaPreview() {
  const dispatch = useAppDispatch()
  const { playerCount, totalGorPool, currentSeason } = useAppSelector((state) => state.arena)
  const { address: walletAddress } = useAppSelector((state) => state.wallet)

  useEffect(() => {
    const loadArenaPreview = async () => {
      try {
        const response = await getArenaStatus()
        dispatch(setCurrentSeason(response.data.season))
        dispatch(setPlayerCount(response.data.playerCount))
        dispatch(setTotalGorPool(response.data.totalGorPool))
      } catch (error) {
        console.error("Failed to load arena preview:", error)
      }
    }

    loadArenaPreview()
  }, [dispatch])

  const getTimeLeft = () => {
    if (!currentSeason.endTime) return "00:00:00"

    const now = new Date().getTime()
    const endTime = new Date(currentSeason.endTime).getTime()
    const difference = endTime - now

    if (difference <= 0) return "Season Ended"

    const hours = Math.floor(difference / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-yellow-900/50 border border-yellow-500 rounded-lg p-4 sm:p-6 backdrop-blur-sm neon-border">
      <div className="text-center mb-4">
        <h3 className="pixel-font text-lg sm:text-xl font-bold text-yellow-400 neon-glow mb-2">🏟️ ARENA MODE LIVE</h3>
        <p className="text-gray-300 text-sm">Stake 1 GOR • Compete for the prize pool</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-3 text-center">
          <div className="text-purple-400 font-bold text-sm">Season Ends In</div>
          <div className="text-purple-300 font-black pixel-font text-lg">{getTimeLeft()}</div>
        </div>

        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-center">
          <div className="text-yellow-400 font-bold text-sm">Prize Pool</div>
          <div className="text-yellow-300 font-black pixel-font text-lg">{totalGorPool} GOR</div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-gray-300 text-sm mb-2">🪙 {playerCount} players competing • Top 3 win rewards</div>
        <div className="text-xs text-gray-400">
          1st: {Math.floor(totalGorPool * 0.6)} GOR • 2nd: {Math.floor(totalGorPool * 0.3)} GOR • 3rd:{" "}
          {Math.floor(totalGorPool * 0.1)} GOR
        </div>
      </div>
    </div>
  )
}
