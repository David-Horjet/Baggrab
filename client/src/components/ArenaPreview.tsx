"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../store/hooks"
import {
  setCurrentSeasonId,
  setSeasonStartTime,
  setSeasonEndTime,
  setPlayerCount,
  setTotalPool,
} from "../store/slices/arenaSlice"
import { getArenaStatus } from "../services/arenaApi"

export default function ArenaPreview() {
  const dispatch = useAppDispatch()
  const { playerCount, totalPool, currentSeasonId, seasonEndTime } = useAppSelector((state) => state.arena)
  const { address: walletAddress } = useAppSelector((state) => state.wallet)

  useEffect(() => {
    const loadArenaPreview = async () => {
      try {
        const response = await getArenaStatus()
        const { currentSeason, playerCount, totalPool } = response.data

        // Handle different currentSeason response formats
        if (currentSeason) {
          if (typeof currentSeason === "string") {
            // Backend returns season ID as string
            dispatch(setCurrentSeasonId(currentSeason))
            // Set default times if not provided
            const now = new Date()
            dispatch(setSeasonStartTime(now.toISOString()))
            const defaultEndTime = new Date()
            defaultEndTime.setHours(defaultEndTime.getHours() + 24)
            dispatch(setSeasonEndTime(defaultEndTime.toISOString()))
          } else if (typeof currentSeason === "object" && currentSeason.id) {
            // Backend returns season object
            dispatch(setCurrentSeasonId(currentSeason.id))
            dispatch(setSeasonStartTime(currentSeason.startTime))
            dispatch(setSeasonEndTime(currentSeason.endTime))
          }
        }

        dispatch(setPlayerCount(playerCount))
        dispatch(setTotalPool(totalPool))
      } catch (error) {
        console.error("Failed to load arena preview:", error)
      }
    }

    loadArenaPreview()
  }, [dispatch])

  const getTimeLeft = () => {
    if (!seasonEndTime) return "00:00:00"

    const now = new Date().getTime()
    const endTime = new Date(seasonEndTime).getTime()
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
          <div className="text-yellow-300 font-black pixel-font text-lg">{totalPool} GOR</div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-gray-300 text-sm mb-2">🪙 {playerCount} players competing • Top 3 win rewards</div>
        <div className="text-xs text-gray-400">
          1st: {Math.floor(totalPool * 0.6)} GOR • 2nd: {Math.floor(totalPool * 0.3)} GOR • 3rd:{" "}
          {Math.floor(totalPool * 0.1)} GOR
        </div>
      </div>
    </div>
  )
}
