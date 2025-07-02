"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import GameCanvas from "@/components/GameCanvas"
import MultiplayerRoomSidebar from "@/components/MultiplayerRoomSidebar"
import ScoreBoardHUD from "@/components/ScoreBoarddHUD"
import TimerOverlay from "@/components/TimeOverlay"
import WalletStatus from "@/components/WalletStatus"
import WalletSync from "@/components/WalletSync"
import { checkApiHealth, submitScore } from "@/services/api"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { resetGame, setGameStarted, updateScore, updateBagCount, updateReactionTime, updateLives, setGameOver, setSubmitError, setSubmittingScore, setSubmissionResponse } from "@/store/slices/gameSlice"

interface GameState {
  timeLeft: number
  showTimer: boolean
  showSidebar: boolean
}

export default function GameScreen() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { address: walletAddress, connected, connecting } = useAppSelector((state) => state.wallet)
  const {
    currentScore,
    lives,
    bagCount,
    reactionTime,
    gameStarted,
    gameOver,
    submittingScore,
    submitError,
    lastSubmissionResponse,
  } = useAppSelector((state) => state.game)

  const [localGameState, setLocalGameState] = useState<GameState>({
    timeLeft: 5,
    showTimer: true,
    showSidebar: false, // Hidden by default on mobile
  })

  const [walletCheckComplete, setWalletCheckComplete] = useState(false)
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setWalletCheckComplete(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    checkApiHealth().then(setApiHealthy)
  }, [])

  useEffect(() => {
    if (walletCheckComplete && !connecting && !connected) {
      alert("Please connect your Backpack wallet first!")
      router.push("/")
    }
  }, [walletCheckComplete, connected, connecting, router])

  useEffect(() => {
    dispatch(resetGame())
  }, [dispatch])

  // Auto-hide sidebar on mobile, show on desktop
  useEffect(() => {
    const handleResize = () => {
      setLocalGameState((prev) => ({
        ...prev,
        showSidebar: window.innerWidth >= 1024, // lg breakpoint
      }))
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (localGameState.showTimer && localGameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setLocalGameState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (localGameState.timeLeft === 0 && localGameState.showTimer) {
      setLocalGameState((prev) => ({ ...prev, showTimer: false }))
      dispatch(setGameStarted(true))
    }
  }, [localGameState.timeLeft, localGameState.showTimer, dispatch])

  const handleBagCatch = useCallback(
    (reactionTime: number) => {
      dispatch(updateScore(10))
      dispatch(updateBagCount())
      dispatch(updateReactionTime(reactionTime))
    },
    [dispatch],
  )

  const handleTrashHit = useCallback(() => {
    dispatch(updateLives(-1))
    if (lives <= 1) {
      dispatch(setGameOver(true))
    }
  }, [dispatch, lives])

  const handleSubmitScore = useCallback(async () => {
    if (!walletAddress || submittingScore) return

    const healthy = await checkApiHealth()
    if (!healthy) {
      dispatch(setSubmitError("Backend server is not responding. Please try again later."))
      return
    }

    dispatch(setSubmittingScore(true))
    dispatch(setSubmitError(null))

    try {
      const response = await submitScore({
        wallet: walletAddress,
        score: currentScore,
      })

      dispatch(setSubmissionResponse(response))

      setTimeout(() => {
        router.push("/result")
      }, 2000)
    } catch (error) {
      console.error("Score submission error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to submit score"
      dispatch(setSubmitError(errorMessage))
    } finally {
      dispatch(setSubmittingScore(false))
    }
  }, [walletAddress, currentScore, submittingScore, dispatch, router])

  if (!walletCheckComplete || connecting) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <WalletSync />
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="pixel-font text-xl sm:text-2xl font-black text-emerald-400 neon-glow mb-2">
            {connecting ? "CONNECTING WALLET..." : "LOADING GAME..."}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Please wait while we prepare your game</p>
        </div>
      </div>
    )
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <h1 className="pixel-font text-2xl sm:text-3xl md:text-4xl font-black text-red-400 neon-glow mb-4">
            WALLET NOT CONNECTED
          </h1>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8">Please connect your Backpack wallet to play</p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-emerald-500 hover:bg-emerald-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl transition-all duration-200 neon-border"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <WalletSync />
        <div className="text-center max-w-md mx-auto">
          <h1 className="pixel-font text-4xl sm:text-5xl md:text-6xl font-black text-red-400 neon-glow mb-4">
            GAME OVER
          </h1>
          <p className="text-xl sm:text-2xl mb-2">Final Score: {currentScore.toLocaleString()}</p>
          <p className="text-base sm:text-lg mb-2 text-gray-400">Bags Caught: {bagCount}</p>
          <p className="text-sm mb-4 sm:mb-6 text-gray-500 font-mono break-all">{walletAddress?.slice(0, 8)}...</p>

          {apiHealthy === false && (
            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 mb-4">
              <p className="text-yellow-400 text-sm">⚠️ Backend server not responding</p>
              <p className="text-yellow-300 text-xs">Score submission may not work</p>
            </div>
          )}

          {submitError && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm font-bold">❌ Submission Failed</p>
              <p className="text-red-300 text-xs mt-1 break-words">{submitError}</p>
            </div>
          )}

          {lastSubmissionResponse && (
            <div className="bg-emerald-500/20 border border-emerald-500 rounded-lg p-4 mb-4">
              <p className="text-emerald-400 font-bold mb-2">✅ {lastSubmissionResponse.message}</p>
              {lastSubmissionResponse.data.rewardTx && (
                <a
                  href={`https://explorer.gorbagana.wtf/tx/${lastSubmissionResponse.data.rewardTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-500 hover:bg-purple-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200"
                >
                  🏆 View Reward Transaction
                </a>
              )}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleSubmitScore}
              disabled={submittingScore || !!lastSubmissionResponse || apiHealthy === false}
              className={`w-full px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl transition-all duration-200 neon-border ${
                submittingScore || !!lastSubmissionResponse || apiHealthy === false
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {submittingScore
                ? "🔄 Submitting..."
                : lastSubmissionResponse
                  ? "✅ Score Submitted"
                  : apiHealthy === false
                    ? "❌ Server Offline"
                    : "📊 Submit Score"}
            </button>

            {lastSubmissionResponse && (
              <button
                onClick={() => router.push("/result")}
                className="w-full bg-purple-500 hover:bg-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl transition-all duration-200 neon-border"
              >
                View Results
              </button>
            )}

            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-600 hover:bg-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200"
            >
              🏠 Back to Home
            </button>
          </div>

          <div className="mt-6 text-center">
            <div className="bg-purple-500/20 border border-purple-500 rounded-lg px-3 py-1 inline-block mb-2">
              <span className="text-purple-400 text-xs font-bold">⚡ Powered by Gorbagana</span>
            </div>
            {apiHealthy !== null && (
              <div>
                <span className={`text-xs ${apiHealthy ? "text-emerald-400" : "text-red-400"}`}>
                  API Status: {apiHealthy ? "🟢 Online" : "🔴 Offline"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <WalletSync />

      {localGameState.showTimer && <TimerOverlay timeLeft={localGameState.timeLeft} />}

      {/* Mobile Controls */}
      <div className="lg:hidden absolute top-4 right-4 z-30 flex gap-2">
        <WalletStatus />
        <button
          onClick={() =>
            setLocalGameState((prev) => ({
              ...prev,
              showSidebar: !prev.showSidebar,
            }))
          }
          className="bg-gray-800/80 border border-gray-600 rounded-lg p-2 text-white hover:bg-gray-700/80 transition-colors"
        >
          {localGameState.showSidebar ? "✕" : "👥"}
        </button>
      </div>

      {/* Desktop Wallet Status */}
      <div className="hidden lg:block absolute top-4 right-4 z-30">
        <WalletStatus />
      </div>

      <div className="flex h-screen">
        {/* Main Game Area */}
        <div className={`flex-1 relative ${localGameState.showSidebar ? "lg:mr-80" : ""}`}>
          <ScoreBoardHUD score={currentScore} lives={lives} bagCount={bagCount} reactionTime={reactionTime} />

          {gameStarted && (
            <GameCanvas onBagCatch={handleBagCatch} onTrashHit={handleTrashHit} gameStarted={gameStarted} />
          )}
        </div>

        {/* Multiplayer Sidebar - Responsive */}
        {localGameState.showSidebar && (
          <div className="absolute lg:relative inset-y-0 right-0 z-20 lg:z-auto">
            <MultiplayerRoomSidebar />
          </div>
        )}
      </div>

      {/* Mobile overlay when sidebar is open */}
      {localGameState.showSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-10"
          onClick={() =>
            setLocalGameState((prev) => ({
              ...prev,
              showSidebar: false,
            }))
          }
        />
      )}
    </div>
  )
}
