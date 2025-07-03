"use client"

import { useAppSelector, useAppDispatch } from "../store/hooks"
import { setIsJoining, setJoinError, setHasJoined } from "../store/slices/arenaSlice"
import { joinArena } from "../services/arenaApi"

export default function JoinArenaButton() {
  const dispatch = useAppDispatch()
  const { address: walletAddress } = useAppSelector((state) => state.wallet)
  const { hasJoined, isJoining, joinError, currentSeasonId } = useAppSelector((state) => state.arena)

  const handleJoinArena = async () => {
    if (!walletAddress || isJoining || hasJoined || !currentSeasonId) return

    dispatch(setIsJoining(true))
    dispatch(setJoinError(null))

    try {
      const response = await joinArena({
        wallet: walletAddress,
        txSignature: `temp_${Date.now()}`, // Temporary signature for now
      })

      dispatch(setHasJoined(true))
      // Note: The API response doesn't include playerCount and totalPool
      // These would need to be fetched separately or the API updated
    } catch (error) {
      console.error("Arena join error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to join arena"
      dispatch(setJoinError(errorMessage))
    } finally {
      dispatch(setIsJoining(false))
    }
  }

  if (hasJoined) {
    return (
      <div className="bg-emerald-500/20 border border-emerald-500 rounded-lg px-4 sm:px-6 py-3 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-emerald-400 font-bold text-sm sm:text-base pixel-font">✅ ARENA JOINED</div>
          <div className="text-emerald-300 text-xs sm:text-sm">1 GOR staked • Good luck!</div>
        </div>
      </div>
    )
  }

  if (!currentSeasonId) {
    return (
      <div className="bg-gray-600/50 border border-gray-500 rounded-lg px-4 sm:px-6 py-3 backdrop-blur-sm opacity-50">
        <div className="text-center">
          <div className="text-gray-400 font-bold text-sm sm:text-base pixel-font">SEASON ENDED</div>
          <div className="text-gray-500 text-xs sm:text-sm">Wait for next season</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleJoinArena}
        disabled={isJoining || !walletAddress}
        className={`w-full px-4 sm:px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition-all duration-200 neon-border pixel-font ${
          isJoining || !walletAddress
            ? "bg-gray-600 cursor-not-allowed opacity-50"
            : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white transform hover:scale-105"
        }`}
      >
        {isJoining ? "🔄 JOINING..." : "🏟️ JOIN ARENA (1 GOR)"}
      </button>

      {joinError && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-2">
          <p className="text-red-400 text-xs font-bold text-center">❌ {joinError}</p>
        </div>
      )}

      <div className="text-center text-xs text-gray-400">Stake 1 GOR to compete for the prize pool</div>
    </div>
  )
}
