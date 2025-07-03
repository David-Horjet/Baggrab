"use client"

import { useAppSelector, useAppDispatch } from "../store/hooks"
import { setMode } from "../store/slices/arenaSlice"

export default function ModeSelector() {
  const dispatch = useAppDispatch()
  const { mode } = useAppSelector((state) => state.arena)
  const { connected } = useAppSelector((state) => state.wallet) // Use Redux state instead of wallet hook

  const handleModeChange = (newMode: "solo" | "arena") => {
    dispatch(setMode(newMode))
  }

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 sm:p-6 backdrop-blur-sm mb-6">
      <h3 className="pixel-font text-lg sm:text-xl font-bold text-emerald-400 mb-4 text-center neon-glow">
        🎮 CHOOSE YOUR MODE
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Solo Mode */}
        <button
          onClick={() => handleModeChange("solo")}
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            mode === "solo"
              ? "border-emerald-500 bg-emerald-500/20 neon-border"
              : "border-gray-600 bg-gray-800/50 hover:border-emerald-400"
          }`}
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-bold text-emerald-400 pixel-font mb-2">PLAY SOLO</div>
            <div className="text-sm text-gray-300 mb-3">Practice mode • No entry fee • Build your skills</div>
            <div className="text-xs text-gray-400">
              • Free to play
              <br />• Personal best tracking
              <br />• Casual gameplay
            </div>
          </div>
        </button>

        {/* Arena Mode */}
        <button
          onClick={() => handleModeChange("arena")}
          disabled={!connected}
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            mode === "arena"
              ? "border-yellow-500 bg-yellow-500/20 neon-border"
              : !connected
                ? "border-gray-600 bg-gray-800/30 opacity-50 cursor-not-allowed"
                : "border-gray-600 bg-gray-800/50 hover:border-yellow-400"
          }`}
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🏟️</div>
            <div className="font-bold text-yellow-400 pixel-font mb-2">JOIN ARENA</div>
            <div className="text-sm text-gray-300 mb-3">Competitive mode • Stake GOR • Win big rewards</div>
            <div className="text-xs text-gray-400">
              • 1 GOR entry fee
              <br />• Seasonal competition
              <br />• Top 3 win prizes
            </div>
            {!connected && <div className="text-xs text-red-400 mt-2">Connect wallet required</div>}
          </div>
        </button>
      </div>

      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          {mode === "solo"
            ? "Selected: Solo Mode - Practice and improve your skills"
            : "Selected: Arena Mode - Compete for GOR rewards"}
        </p>
      </div>
    </div>
  )
}
