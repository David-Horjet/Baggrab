"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ArenaResultCard from "@/components/ArenaResultCard"
import EarnedRewardsBox from "@/components/EarnedRewardsBox"
import PlayAgainButton from "@/components/PlayAgainButton"
import ResultCard from "@/components/ResultCard"
import ShareToXButton from "@/components/SharetoXButton"
import WalletSync from "@/components/WalletSync"
import { fetchLeaderboard } from "@/services/api"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { resetArena } from "@/store/slices/arenaSlice"
import { resetGame } from "@/store/slices/gameSlice"
import { setLeaderboardLoading, setLeaderboardEntries, setLeaderboardError } from "@/store/slices/leaderboardSlice"

export default function ResultScreen() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { address: walletAddress, connected } = useAppSelector((state) => state.wallet)
  const { lastSubmissionResponse, currentScore, bagCount } = useAppSelector((state) => state.game)
  const { mode, lastSubmissionTx, leaderboard } = useAppSelector((state) => state.arena)
  const { entries } = useAppSelector((state) => state.leaderboard)

  const [showConfetti, setShowConfetti] = useState(true)
  const [userRank, setUserRank] = useState<number | null>(null)

  // Calculate user's rank from appropriate leaderboard
  useEffect(() => {
    if (walletAddress) {
      if (mode === "arena" && leaderboard.length > 0) {
        const userEntry = leaderboard.find((entry) => entry._id === walletAddress)
        if (userEntry) {
          const rank = leaderboard.findIndex((entry) => entry._id === walletAddress) + 1
          setUserRank(rank)
        }
      } else if (mode === "solo" && entries.length > 0) {
        const userEntry = entries.find((entry) => entry._id === walletAddress)
        if (userEntry) {
          const rank = entries.findIndex((entry) => entry._id === walletAddress) + 1
          setUserRank(rank)
        }
      }
    }
  }, [walletAddress, mode, leaderboard, entries])

  // Load leaderboard data for solo mode
  useEffect(() => {
    if (mode === "solo") {
      const loadLeaderboard = async () => {
        dispatch(setLeaderboardLoading(true))
        try {
          const response = await fetchLeaderboard()
          dispatch(setLeaderboardEntries(response.data))
        } catch (error) {
          dispatch(setLeaderboardError(error instanceof Error ? error.message : "Failed to load leaderboard"))
        }
      }

      loadLeaderboard()
    }
  }, [mode, dispatch])

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!connected) {
      router.push("/")
      return
    }

    // Check if we have valid submission data
    const hasValidSubmission = mode === "solo" ? lastSubmissionResponse : lastSubmissionTx
    if (!hasValidSubmission && currentScore === 0) {
      router.push("/")
      return
    }
  }, [connected, lastSubmissionResponse, lastSubmissionTx, currentScore, mode, router])

  const handlePlayAgain = () => {
    dispatch(resetGame())
    dispatch(resetArena())
    router.push("/")
  }

  const handleGoHome = () => {
    dispatch(resetGame())
    dispatch(resetArena())
    router.push("/")
  }

  // Get results based on mode
  const results = {
    score: mode === "solo" ? lastSubmissionResponse?.data.score.score || currentScore : currentScore,
    bagsCaught: bagCount,
    trashHit: Math.max(0, Math.floor(bagCount * 0.2)),
    timeSurvived: Math.floor(bagCount * 8),
    tokensEarned: mode === "solo" ? (lastSubmissionResponse?.data.rewardTx ? 50 : 25) : 0,
    rank: userRank || Math.floor(Math.random() * 50) + 1,
    rewardTx: mode === "solo" ? lastSubmissionResponse?.data.rewardTx : lastSubmissionTx,
    mode,
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <h1 className="pixel-font text-2xl sm:text-3xl md:text-4xl font-black text-red-400 neon-glow mb-4">
            ACCESS DENIED
          </h1>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8">Please connect your wallet to view results</p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-emerald-500 hover:bg-emerald-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl transition-all duration-200 neon-border"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      <WalletSync />

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(window.innerWidth < 768 ? 25 : 50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen flex flex-col justify-center">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="pixel-font text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-emerald-400 neon-glow mb-4 slide-in-up">
            {mode === "arena" ? "ARENA COMPLETE! 🏟️" : "YOU SECURED THE BAG! 🤑"}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 slide-in-up" style={{ animationDelay: "0.2s" }}>
            {userRank
              ? `Rank #${userRank} out of ${mode === "arena" ? leaderboard.length : entries.length} players`
              : "Great job out there!"}
          </p>
          <p className="text-xs sm:text-sm text-gray-400 font-mono mt-2 break-all px-4 sm:px-0">
            {walletAddress?.slice(0, 8)}...
          </p>

          {/* Mode indicator */}
          <div className="mt-3">
            <div
              className={`inline-block px-3 py-1 rounded-lg border text-xs font-bold ${
                mode === "arena"
                  ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                  : "bg-emerald-500/20 border-emerald-500 text-emerald-400"
              }`}
            >
              {mode === "arena" ? "🏟️ ARENA MODE" : "🎯 SOLO MODE"}
            </div>
          </div>
        </div>

        {/* Submission Status */}
        {mode === "solo" && lastSubmissionResponse && (
          <div
            className="max-w-2xl mx-auto mb-4 sm:mb-6 bg-emerald-500/20 border border-emerald-500 rounded-lg p-3 sm:p-4 slide-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <p className="text-emerald-400 font-bold text-center mb-2 text-sm sm:text-base">
              ✅ {lastSubmissionResponse.message}
            </p>
            {lastSubmissionResponse.data.rewardTx && (
              <div className="text-center">
                <a
                  href={`https://explorer.gorbagana.wtf/tx/${lastSubmissionResponse.data.rewardTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-500 hover:bg-purple-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200"
                >
                  🏆 View Reward Transaction
                </a>
              </div>
            )}
          </div>
        )}

        {mode === "arena" && lastSubmissionTx && (
          <div
            className="max-w-2xl mx-auto mb-4 sm:mb-6 bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 sm:p-4 slide-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <p className="text-yellow-400 font-bold text-center mb-2 text-sm sm:text-base">
              ✅ Arena Score Submitted Successfully
            </p>
            <div className="text-center">
              <a
                href={`https://explorer.gorbagana.wtf/tx/${lastSubmissionTx}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-500 hover:bg-purple-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200"
              >
                🔍 View Transaction
              </a>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="slide-in-up" style={{ animationDelay: "0.4s" }}>
            {mode === "arena" ? (
              <ArenaResultCard results={results} leaderboard={leaderboard} />
            ) : (
              <ResultCard results={results} />
            )}
          </div>

          <div className="slide-in-up" style={{ animationDelay: "0.6s" }}>
            <EarnedRewardsBox tokensEarned={results.tokensEarned} rewardTx={results.rewardTx} mode={mode} />
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 slide-in-up px-4 sm:px-0"
          style={{ animationDelay: "0.8s" }}
        >
          <PlayAgainButton onPlayAgain={handlePlayAgain} />
          <ShareToXButton score={results.score} rank={results.rank} mode={mode} />
          <button
            onClick={() => router.push("/leaderboard")}
            className="bg-purple-600 hover:bg-purple-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base lg:text-lg transition-all duration-200 neon-border"
          >
            View Leaderboard
          </button>
        </div>

        <div className="text-center mt-6 sm:mt-8 slide-in-up px-4 sm:px-0" style={{ animationDelay: "1s" }}>
          <p className="text-gray-400 mb-4 text-sm sm:text-base">
            Try again or share your {mode === "arena" ? "arena victory" : "chaos"} •
            <button onClick={handleGoHome} className="text-emerald-400 hover:text-emerald-300 ml-2 underline">
              Return Home
            </button>
          </p>

          <div className="bg-purple-500/20 border border-purple-500 rounded-lg px-3 py-1 inline-block">
            <span className="text-purple-400 text-xs font-bold">⚡ Powered by Gorbagana</span>
          </div>
        </div>
      </div>
    </div>
  )
}
