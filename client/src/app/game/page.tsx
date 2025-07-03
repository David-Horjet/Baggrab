"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ArenaJoinModal from "@/components/ArenaJoinModal"
import ArenaLeaderboardPreview from "@/components/ArenaLeaderboardPreview"
import ArenaSeasonTimer from "@/components/ArenaSeasonTimer"
import GameCanvas from "@/components/GameCanvas"
import NoSeasonMessage from "@/components/NoSeasonMessage"
import ScoreBoardHUD from "@/components/ScoreBoarddHUD"
import TimerOverlay from "@/components/TimeOverlay"
import WalletStatus from "@/components/WalletStatus"
import WalletSync from "@/components/WalletSync"
import { checkApiHealth, submitScore } from "@/services/api"
import { getArenaStatus, fetchArenaLeaderboard, submitArenaScore } from "@/services/arenaApi"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setMode, resetArena, setIsLoadingStatus, setPlayerCount, setTotalPool, setCurrentSeasonId, setSeasonStartTime, setSeasonEndTime, setHasJoined, setIsLoadingLeaderboard, setLeaderboard, setStatusError, setSubmitScoreError, setIsSubmittingScore, setLastSubmissionTx } from "@/store/slices/arenaSlice"
import { resetGame, setGameStarted, updateScore, updateBagCount, updateReactionTime, updateLives, setGameOver, setSubmitError, setSubmittingScore, setSubmissionResponse } from "@/store/slices/gameSlice"
import { setLeaderboardError } from "@/store/slices/leaderboardSlice"

interface GameState {
  timeLeft: number
  showTimer: boolean
  showSidebar: boolean
  showJoinModal: boolean
}

export default function GameScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
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
  const { mode, currentSeasonId, hasJoined, isSubmittingScore, submitScoreError, lastSubmissionTx, isLoadingStatus } =
    useAppSelector((state) => state.arena)

  const [localGameState, setLocalGameState] = useState<GameState>({
    timeLeft: 5,
    showTimer: true,
    showSidebar: false,
    showJoinModal: false,
  })

  const [walletCheckComplete, setWalletCheckComplete] = useState(false)
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null)

  // Set mode from URL parameter
  useEffect(() => {
    const modeParam = searchParams.get("mode")
    if (modeParam === "arena" || modeParam === "solo") {
      dispatch(setMode(modeParam))
    }
  }, [searchParams, dispatch])

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
    if (walletCheckComplete && !connecting && !connected && mode === "arena") {
      alert("Please connect your Backpack wallet for Arena mode!")
      router.push("/")
    }
  }, [walletCheckComplete, connected, connecting, mode, router])

  useEffect(() => {
    dispatch(resetGame())
    dispatch(resetArena())
  }, [dispatch])

  // Load arena status when entering arena mode
  const loadArenaStatus = useCallback(async () => {
    if (mode !== "arena" || !walletAddress) return

    dispatch(setIsLoadingStatus(true))
    try {
      const statusResponse = await getArenaStatus(walletAddress)
      const { currentSeason, hasJoined: userHasJoined, playerCount, totalPool } = statusResponse.data

      // Always update player count and total pool
      dispatch(setPlayerCount(playerCount))
      dispatch(setTotalPool(totalPool))

      // Handle different currentSeason response formats
      let seasonId: string | null = null
      let seasonStartTime: string | null = null
      let seasonEndTime: string | null = null
      let seasonIsActive = true // Default to true if we have a season

      if (currentSeason) {
        if (typeof currentSeason === "string") {
          // Backend returns season ID as string
          seasonId = currentSeason
          // Set default times if not provided
          const now = new Date()
          seasonStartTime = now.toISOString()
          const defaultEndTime = new Date()
          defaultEndTime.setHours(defaultEndTime.getHours() + 24)
          seasonEndTime = defaultEndTime.toISOString()
        } else if (typeof currentSeason === "object" && currentSeason.id) {
          // Backend returns season object
          seasonId = currentSeason.id
          seasonStartTime = currentSeason.startTime
          seasonEndTime = currentSeason.endTime
          seasonIsActive = currentSeason.isActive
        }
      }

      if (seasonId) {
        dispatch(setCurrentSeasonId(seasonId))
        dispatch(setSeasonStartTime(seasonStartTime))
        dispatch(setSeasonEndTime(seasonEndTime))
        dispatch(setHasJoined(userHasJoined))

        console.log("Arena Status:", {
          seasonId,
          userHasJoined,
          seasonIsActive,
          seasonStartTime,
          seasonEndTime,
          playerCount,
          totalPool,
        })

        // Load leaderboard if user has joined
        if (userHasJoined) {
          dispatch(setIsLoadingLeaderboard(true))
          try {
            const leaderboardResponse = await fetchArenaLeaderboard(seasonId)
            dispatch(setLeaderboard(leaderboardResponse.data))
          } catch (error) {
            console.error("Leaderboard load error:", error)
            dispatch(setLeaderboardError(error instanceof Error ? error.message : "Failed to load leaderboard"))
          } finally {
            dispatch(setIsLoadingLeaderboard(false))
          }
        }

        // Show join modal if user hasn't joined and season is active
        if (!userHasJoined && seasonIsActive) {
          setLocalGameState((prev) => ({ ...prev, showJoinModal: true }))
        }
      } else {
        // No current season available
        dispatch(setCurrentSeasonId(null))
        dispatch(setSeasonStartTime(null))
        dispatch(setSeasonEndTime(null))
        dispatch(setHasJoined(false))

        // Don't show join modal when no season is active
        setLocalGameState((prev) => ({ ...prev, showJoinModal: false }))
      }
    } catch (error) {
      console.error("Failed to load arena status:", error)
      dispatch(setStatusError(error instanceof Error ? error.message : "Failed to load arena status"))
    } finally {
      dispatch(setIsLoadingStatus(false))
    }
  }, [mode, walletAddress, dispatch])

  useEffect(() => {
    loadArenaStatus()
  }, [mode, walletAddress, dispatch])

  // Auto-hide sidebar on mobile, show on desktop
  useEffect(() => {
    const handleResize = () => {
      setLocalGameState((prev) => ({
        ...prev,
        showSidebar: window.innerWidth >= 1024,
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

      console.log("Timer finished. Game conditions:", {
        mode,
        hasJoined,
        currentSeasonId,
        canStartGame: mode === "solo" || (mode === "arena" && hasJoined && currentSeasonId),
      })

      // Only start game if user has joined arena (for arena mode) or if in solo mode
      // For arena mode, also check that there's an active season
      if (mode === "solo" || (mode === "arena" && hasJoined && currentSeasonId)) {
        console.log("Starting game...")
        dispatch(setGameStarted(true))
      } else if (mode === "arena" && !currentSeasonId) {
        // No active season, redirect back to home
        alert("No active arena season available. Please try again later.")
        router.push("/")
      } else if (mode === "arena" && !hasJoined) {
        // User hasn't joined arena yet
        console.log("User hasn't joined arena yet, showing join modal")
        setLocalGameState((prev) => ({ ...prev, showJoinModal: true }))
      }
    }
  }, [localGameState.timeLeft, localGameState.showTimer, mode, hasJoined, currentSeasonId, dispatch, router])

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
    if (!walletAddress || (mode === "solo" && submittingScore) || (mode === "arena" && isSubmittingScore)) return

    const healthy = await checkApiHealth()
    if (!healthy) {
      const errorMessage = "Backend server is not responding. Please try again later."
      if (mode === "solo") {
        dispatch(setSubmitError(errorMessage))
      } else {
        dispatch(setSubmitScoreError(errorMessage))
      }
      return
    }

    if (mode === "solo") {
      // Solo mode submission
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
        console.error("Solo score submission error:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to submit score"
        dispatch(setSubmitError(errorMessage))
      } finally {
        dispatch(setSubmittingScore(false))
      }
    } else if (mode === "arena" && currentSeasonId) {
      // Arena mode submission
      dispatch(setIsSubmittingScore(true))
      dispatch(setSubmitScoreError(null))

      try {
        const response = await submitArenaScore({
          wallet: walletAddress,
          score: currentScore,
          seasonId: currentSeasonId,
        })

        // Store raw transaction signature from API response
        // Remove any prefixes and store only the signature
        const rawSignature = response.txSignature || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        dispatch(setLastSubmissionTx(rawSignature))

        setTimeout(() => {
          router.push("/result")
        }, 2000)
      } catch (error) {
        console.error("Arena score submission error:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to submit arena score"
        dispatch(setSubmitScoreError(errorMessage))
      } finally {
        dispatch(setIsSubmittingScore(false))
      }
    }
  }, [walletAddress, currentScore, mode, currentSeasonId, submittingScore, isSubmittingScore, dispatch, router])

  const handleJoinModalSuccess = () => {
    setLocalGameState((prev) => ({ ...prev, showJoinModal: false }))
    // Reload arena status to get updated hasJoined state
    if (mode === "arena" && walletAddress) {
      loadArenaStatus()
    }
  }

  const handleJoinModalClose = () => {
    setLocalGameState((prev) => ({ ...prev, showJoinModal: false }))
    router.push("/")
  }

  if (!walletCheckComplete || connecting || isLoadingStatus) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <WalletSync />
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="pixel-font text-xl sm:text-2xl font-black text-emerald-400 neon-glow mb-2">
            {connecting ? "CONNECTING WALLET..." : isLoadingStatus ? "LOADING ARENA..." : "LOADING GAME..."}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Please wait while we prepare your game</p>
        </div>
      </div>
    )
  }

  if (mode === "arena" && !currentSeasonId && !isLoadingStatus && walletCheckComplete) {
    return <NoSeasonMessage onGoBack={() => router.push("/")} />
  }

  if (!connected && mode === "arena") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <h1 className="pixel-font text-2xl sm:text-3xl md:text-4xl font-black text-red-400 neon-glow mb-4">
            WALLET REQUIRED
          </h1>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8">Arena mode requires a connected Backpack wallet</p>
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
    const currentSubmittingScore = mode === "solo" ? submittingScore : isSubmittingScore
    const currentSubmitError = mode === "solo" ? submitError : submitScoreError
    const hasSubmitted = mode === "solo" ? !!lastSubmissionResponse : !!lastSubmissionTx

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <WalletSync />
        <div className="text-center max-w-md mx-auto">
          <h1 className="pixel-font text-4xl sm:text-5xl md:text-6xl font-black text-red-400 neon-glow mb-4">
            GAME OVER
          </h1>
          <p className="text-xl sm:text-2xl mb-2">Final Score: {currentScore.toLocaleString()}</p>
          <p className="text-base sm:text-lg mb-2 text-gray-400">Bags Caught: {bagCount}</p>

          {mode === "arena" && (
            <div className="mb-4">
              <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg px-3 py-1 inline-block mb-2">
                <span className="text-yellow-400 text-sm font-bold">🏟️ ARENA MODE</span>
              </div>
              {hasJoined && <p className="text-sm text-purple-400 font-bold">Arena Score Submitted</p>}
            </div>
          )}

          <p className="text-sm mb-4 sm:mb-6 text-gray-500 font-mono break-all">{walletAddress?.slice(0, 8)}...</p>

          {apiHealthy === false && (
            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 mb-4">
              <p className="text-yellow-400 text-sm">⚠️ Backend server not responding</p>
              <p className="text-yellow-300 text-xs">Score submission may not work</p>
            </div>
          )}

          {currentSubmitError && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm font-bold">❌ Submission Failed</p>
              <p className="text-red-300 text-xs mt-1 break-words">{currentSubmitError}</p>
            </div>
          )}

          {mode === "solo" && lastSubmissionResponse && (
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

          {mode === "arena" && lastSubmissionTx && (
            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-4">
              <p className="text-yellow-400 font-bold mb-2">✅ Arena Score Submitted</p>
              <a
                href={`https://explorer.gorbagana.wtf/tx/${lastSubmissionTx}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-500 hover:bg-purple-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200"
              >
                🔍 View Transaction
              </a>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleSubmitScore}
              disabled={currentSubmittingScore || hasSubmitted || apiHealthy === false}
              className={`w-full px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl transition-all duration-200 neon-border ${
                currentSubmittingScore || hasSubmitted || apiHealthy === false
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : mode === "arena"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {currentSubmittingScore
                ? "🔄 Submitting..."
                : hasSubmitted
                  ? "✅ Score Submitted"
                  : apiHealthy === false
                    ? "❌ Server Offline"
                    : mode === "arena"
                      ? "🏟️ Submit Arena Score"
                      : "📊 Submit Score"}
            </button>

            {hasSubmitted && (
              <button
                onClick={() => router.push("/result")}
                className="w-full bg-purple-500 hover:bg-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 neon-border"
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

      {/* Arena Join Modal */}
      <ArenaJoinModal
        isOpen={localGameState.showJoinModal}
        onClose={handleJoinModalClose}
        onSuccess={handleJoinModalSuccess}
      />

      {localGameState.showTimer && <TimerOverlay timeLeft={localGameState.timeLeft} />}

      {/* Mode-specific header */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-30">
        <div className="flex justify-between items-center mb-2 sm:mb-4">
          {mode === "arena" && <ArenaSeasonTimer />}

          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-lg border text-xs font-bold ${
                mode === "arena"
                  ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                  : "bg-emerald-500/20 border-emerald-500 text-emerald-400"
              }`}
            >
              {mode === "arena" ? "🏟️ ARENA" : "🎯 SOLO"}
            </div>
            <WalletStatus />
          </div>
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="lg:hidden absolute top-16 sm:top-20 right-2 sm:right-4 z-30 flex gap-2">
        {mode === "arena" && (
          <button
            onClick={() =>
              setLocalGameState((prev) => ({
                ...prev,
                showSidebar: !prev.showSidebar,
              }))
            }
            className="bg-gray-800/80 border border-gray-600 rounded-lg p-2 text-white hover:bg-gray-700/80 transition-colors"
          >
            {localGameState.showSidebar ? "✕" : "🏟️"}
          </button>
        )}
      </div>

      <div className="flex h-screen">
        {/* Main Game Area */}
        <div className={`flex-1 relative ${localGameState.showSidebar && mode === "arena" ? "lg:mr-80" : ""}`}>
          <div className="pt-20 sm:pt-24">
            <ScoreBoardHUD score={currentScore} lives={lives} bagCount={bagCount} reactionTime={reactionTime} />

            {gameStarted && (
              <GameCanvas onBagCatch={handleBagCatch} onTrashHit={handleTrashHit} gameStarted={gameStarted} />
            )}
          </div>
        </div>

        {/* Arena Leaderboard Sidebar - Only in Arena Mode */}
        {mode === "arena" && localGameState.showSidebar && (
          <div className="absolute lg:relative inset-y-0 right-0 z-20 lg:z-auto">
            <div className="w-72 sm:w-80 bg-black/95 border-l border-gray-700 p-3 sm:p-4 overflow-y-auto h-full">
              <ArenaLeaderboardPreview />
            </div>
          </div>
        )}
      </div>

      {/* Mobile overlay when sidebar is open */}
      {mode === "arena" && localGameState.showSidebar && (
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
