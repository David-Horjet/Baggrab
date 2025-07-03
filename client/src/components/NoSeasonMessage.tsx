"use client"

interface NoSeasonMessageProps {
  onGoBack: () => void
}

export default function NoSeasonMessage({ onGoBack }: NoSeasonMessageProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-6xl mb-6">🏟️</div>
        <h1 className="pixel-font text-3xl sm:text-4xl font-black text-yellow-400 neon-glow mb-4">NO ACTIVE SEASON</h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-6">There is currently no active arena season running.</p>
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-400 mb-2">What happens next:</p>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• New seasons start regularly</li>
            <li>• Check back soon for the next competition</li>
            <li>• Try Solo mode while you wait</li>
          </ul>
        </div>
        <div className="space-y-3">
          <button
            onClick={onGoBack}
            className="w-full bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 neon-border"
          >
            🏠 Back to Home
          </button>
          <button
            onClick={() => (window.location.href = "/game?mode=solo")}
            className="w-full bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200"
          >
            🎯 Play Solo Mode
          </button>
        </div>
        <div className="mt-6">
          <div className="bg-purple-500/20 border border-purple-500 rounded-lg px-3 py-1 inline-block">
            <span className="text-purple-400 text-xs font-bold">⚡ Powered by Gorbagana</span>
          </div>
        </div>
      </div>
    </div>
  )
}
