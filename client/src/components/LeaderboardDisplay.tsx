"use client"

import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "../store/hooks"
import { setLeaderboardLoading, setLeaderboardEntries, setLeaderboardError } from "../store/slices/leaderboardSlice"
import { fetchLeaderboard, checkApiHealth } from "../services/api"

export default function LeaderboardDisplay() {
  const dispatch = useAppDispatch()
  const { entries, loading, error, lastUpdated } = useAppSelector((state) => state.leaderboard)
  const { address: walletAddress } = useAppSelector((state) => state.wallet)
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null)

  const loadLeaderboard = async () => {
    dispatch(setLeaderboardLoading(true))
    try {
      const response = await fetchLeaderboard()
      dispatch(setLeaderboardEntries(response.data))
      setApiHealthy(true)
    } catch (error) {
      console.error("Leaderboard fetch error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load leaderboard"
      dispatch(setLeaderboardError(errorMessage))
      setApiHealthy(false)
    }
  }

  const checkHealth = async () => {
    const healthy = await checkApiHealth()
    setApiHealthy(healthy)
    return healthy
  }

  useEffect(() => {
    checkHealth().then((healthy) => {
      if (healthy) {
        loadLeaderboard()
      } else {
        dispatch(
          setLeaderboardError("Backend server is not responding. Please check if it's running on the correct port."),
        )
      }
    })
  }, [dispatch, loadLeaderboard])

  useEffect(() => {
    if (!apiHealthy) return

    const interval = setInterval(() => {
      loadLeaderboard()
    }, 30000)

    return () => clearInterval(interval)
  }, [apiHealthy, loadLeaderboard])

  const formatWalletAddress = (address: string) => {
    if (address.length <= 8) return address
    return `${address.slice(0, 4)}...${address.slice(-3)}`
  }

  if (loading && entries.length === 0) {
    return (
      <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="pixel-font text-xl font-bold text-emerald-400 mb-4 text-center neon-glow">🏆 LEADERBOARD</h3>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading scores...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="pixel-font text-xl font-bold text-emerald-400 mb-4 text-center neon-glow">🏆 LEADERBOARD</h3>
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-3">
            <p className="text-red-400 text-sm mb-2">⚠️ Connection Error</p>
            <p className="text-red-300 text-xs">{error}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={loadLeaderboard}
              className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 mr-2"
            >
              🔄 Retry
            </button>
            <button
              onClick={checkHealth}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
            >
              🔍 Check API
            </button>
          </div>

          <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500 rounded-lg">
            <p className="text-yellow-400 text-xs">💡 Make sure your backend server is running</p>
            <p className="text-yellow-300 text-xs mt-1">
              Expected: {process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="pixel-font text-xl font-bold text-emerald-400 mb-4 text-center neon-glow">🏆 LEADERBOARD</h3>
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-gray-400 text-lg mb-2">No scores yet!</p>
          <p className="text-gray-500 text-sm">Be the first to play and claim the top spot</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="pixel-font text-xl font-bold text-emerald-400 neon-glow">🏆 LEADERBOARD</h3>
        <div className="flex items-center gap-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          )}
          {apiHealthy && (
            <div className="bg-emerald-500/20 border border-emerald-500 rounded px-2 py-1">
              <span className="text-emerald-400 text-xs font-bold">LIVE</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {entries.slice(0, 10).map((entry, index) => (
          <div
            key={entry._id}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              entry._id === walletAddress
                ? "bg-emerald-500/20 border border-emerald-500/50"
                : index === 0
                  ? "bg-yellow-500/20 border border-yellow-500/50"
                  : index === 1
                    ? "bg-gray-400/20 border border-gray-400/50"
                    : index === 2
                      ? "bg-orange-500/20 border border-orange-500/50"
                      : "bg-gray-800/50 border border-gray-600/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎯"}</span>
              <div>
                <div className={`font-bold text-sm ${entry._id === walletAddress ? "text-emerald-400" : "text-white"}`}>
                  {formatWalletAddress(entry._id)}
                  {entry._id === walletAddress && " (You)"}
                </div>
                <div className="text-xs text-gray-400">#{index + 1}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-emerald-400">{entry.highestScore.toLocaleString()}</div>
              <div className="text-xs text-gray-400">pts</div>
            </div>
          </div>
        ))}
      </div>

      {lastUpdated && (
        <div className="text-center mt-4 text-xs text-gray-500">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </div>
      )}

      <div className="mt-4 text-center">
        <div className="bg-purple-500/20 border border-purple-500 rounded-lg px-3 py-1 inline-block">
          <span className="text-purple-400 text-xs font-bold">⚡ Powered by Gorbagana</span>
        </div>
      </div>
    </div>
  )
}
