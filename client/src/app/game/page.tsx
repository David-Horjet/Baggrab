"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import GameCanvas from "@/components/GameCanvas"
import MultiplayerRoomSidebar from "@/components/MultiplayerRoomSidebar"
import ScoreBoardHUD from "@/components/ScoreBoarddHUD"
import TimerOverlay from "@/components/TimeOverlay"
import WalletStatus from "@/components/WalletStatus"
import WalletSync from "@/components/WalletSync"
import { submitScore } from "@/services/api"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { resetGame, setGameStarted, updateScore, updateBagCount, updateReactionTime, updateLives, setGameOver, setSubmittingScore, setSubmitError, setSubmissionResponse } from "@/store/slices/gameSlice"

interface GameState {
  timeLeft: number
  showTimer: boolean
}

export default function GameScreen() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { address: walletAddress, connected, connecting } = useAppSelector((state: { wallet: any }) => state.wallet)
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
  } = useAppSelector((state: { game: any }) => state.game)

  const [localGameState, setLocalGameState] = useState<GameState>({
    timeLeft: 5,
    showTimer: true,
  })

  // Wait for wallet connection to stabilize before checking
  const [walletCheckComplete, setWalletCheckComplete] = useState(false)

  useEffect(() => {
    // Give wallet time to connect/auto-connect
    const timer = setTimeout(() => {
      setWalletCheckComplete(true)
    }, 2000) // Wait 2 seconds for wallet to stabilize

    return () => clearTimeout(timer)
  }, [])

  // Only redirect after wallet check is complete
  useEffect(() => {
    if (walletCheckComplete && !connecting && !connected) {
      alert("Please connect your Backpack wallet first!")
      router.push("/")
    }
  }, [walletCheckComplete, connected, connecting, router])

  // Reset game state when component mounts
  useEffect(() => {
    dispatch(resetGame())
  }, [dispatch])

  // Game timer logic
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

    dispatch(setSubmittingScore(true))
    dispatch(setSubmitError(null))

    try {
      const response = await submitScore({
        wallet: walletAddress,
        score: currentScore,
      })

      dispatch(setSubmissionResponse(response))

      // Navigate to results page after successful submission
      setTimeout(() => {
        router.push("/result")
      }, 2000)
    } catch (error) {
      dispatch(setSubmitError(error instanceof Error ? error.message : "Failed to submit score"))
    } finally {
      dispatch(setSubmittingScore(false))
    }
  }, [walletAddress, currentScore, submittingScore, dispatch, router])

  // Show loading while wallet is connecting or checking
  if (!walletCheckComplete || connecting) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <WalletSync />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="pixel-font text-2xl font-black text-emerald-400 neon-glow mb-2">
            {connecting ? "CONNECTING WALLET..." : "LOADING GAME..."}
          </h1>
          <p className="text-gray-400">Please wait while we prepare your game</p>
        </div>
      </div>
    )
  }

  // Show wallet not connected after check is complete
  if (!connected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="pixel-font text-4xl font-black text-red-400 neon-glow mb-4">WALLET NOT CONNECTED</h1>
          <p className="text-xl mb-8">Please connect your Backpack wallet to play</p>
          <button
            onClick={() => router.push("/")}
            className="bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-lg font-bold text-xl transition-all duration-200 neon-border"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Show game over screen with score submission
  if (gameOver) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <WalletSync />
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="pixel-font text-6xl font-black text-red-400 neon-glow mb-4">GAME OVER</h1>
          <p className="text-2xl mb-2">Final Score: {currentScore.toLocaleString()}</p>
          <p className="text-lg mb-2 text-gray-400">Bags Caught: {bagCount}</p>
          <p className="text-sm mb-6 text-gray-500 font-mono">{walletAddress?.slice(0, 8)}...</p>

          {submitError && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{submitError}</p>
            </div>
          )}

          {lastSubmissionResponse && (
            <div className="bg-emerald-500/20 border border-emerald-500 rounded-lg p-4 mb-4">
              <p className="text-emerald-400 font-bold mb-2">{lastSubmissionResponse.message}</p>
              {lastSubmissionResponse.data.rewardTx && (
                <a
                  href={`https://explorer.gorbagana.wtf/tx/${lastSubmissionResponse.data.rewardTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                >
                  🏆 View Reward Transaction
                </a>
              )}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleSubmitScore}
              disabled={submittingScore || !!lastSubmissionResponse}
              className={`w-full px-8 py-4 rounded-lg font-bold text-xl transition-all duration-200 neon-border ${
                submittingScore || !!lastSubmissionResponse
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {submittingScore ? "🔄 Submitting..." : lastSubmissionResponse ? "✅ Score Submitted" : "📊 Submit Score"}
            </button>

            {lastSubmissionResponse && (
              <button
                onClick={() => router.push("/result")}
                className="w-full bg-purple-500 hover:bg-purple-600 px-8 py-4 rounded-lg font-bold text-xl transition-all duration-200 neon-border"
              >
                View Results
              </button>
            )}
          </div>

          <div className="mt-6 text-center">
            <div className="bg-purple-500/20 border border-purple-500 rounded-lg px-3 py-1 inline-block">
              <span className="text-purple-400 text-xs font-bold">⚡ Powered by Gorbagana</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <WalletSync />

      {localGameState.showTimer && <TimerOverlay timeLeft={localGameState.timeLeft} />}

      {/* Wallet Status in top right */}
      <div className="absolute top-4 right-4 z-30">
        <WalletStatus />
      </div>

      <div className="flex h-screen">
        {/* Main Game Area */}
        <div className="flex-1 relative">
          <ScoreBoardHUD score={currentScore} lives={lives} bagCount={bagCount} reactionTime={reactionTime} />

          {gameStarted && (
            <GameCanvas onBagCatch={handleBagCatch} onTrashHit={handleTrashHit} gameStarted={gameStarted} />
          )}
        </div>

        {/* Multiplayer Sidebar */}
        <MultiplayerRoomSidebar />
      </div>
    </div>
  )
}
