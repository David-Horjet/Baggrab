import type { ArenaPlayer } from "../store/slices/arenaSlice"

interface ArenaResultCardProps {
  results: any
  leaderboard: ArenaPlayer[]
}

export default function ArenaResultCard({ results, leaderboard }: ArenaResultCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const accuracy =
    results.bagsCaught + results.trashHit > 0
      ? Math.round((results.bagsCaught / (results.bagsCaught + results.trashHit)) * 100)
      : 100

  const totalPlayers = leaderboard.length
  const topPercentile = totalPlayers > 0 ? Math.round((1 - (results.rank - 1) / totalPlayers) * 100) : 100

  return (
    <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-500 rounded-lg p-6 backdrop-blur-sm neon-border">
      <h3 className="pixel-font text-2xl font-bold text-yellow-400 mb-6 text-center neon-glow">🏟️ ARENA STATS</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <span className="text-yellow-400 font-bold">Arena Score</span>
          <span className="text-2xl font-black text-yellow-400">{results.score.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <span className="text-emerald-400 font-bold">💰 Bags Caught</span>
          <span className="text-xl font-bold text-emerald-400">{results.bagsCaught}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <span className="text-red-400 font-bold">🗑️ Trash Hit</span>
          <span className="text-xl font-bold text-red-400">{results.trashHit}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <span className="text-blue-400 font-bold">⏱️ Time Survived</span>
          <span className="text-xl font-bold text-blue-400">{formatTime(results.timeSurvived)}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <span className="text-purple-400 font-bold">🏆 Arena Rank</span>
          <span className="text-xl font-bold text-purple-400">#{results.rank}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-400 mb-2">Accuracy Rate</div>
          <div className="text-2xl font-black text-emerald-400">{accuracy}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-2">Top Percentile</div>
          <div className="text-2xl font-black text-yellow-400">{topPercentile}%</div>
        </div>
      </div>

      {results.rank <= 3 && (
        <div className="mt-6 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-lg text-center">
          <div className="text-lg font-bold text-yellow-400 mb-1">
            {results.rank === 1 ? "🏆 CHAMPION!" : results.rank === 2 ? "🥈 RUNNER-UP!" : "🥉 THIRD PLACE!"}
          </div>
          <div className="text-sm text-yellow-300">You're in the prize pool!</div>
        </div>
      )}
    </div>
  )
}
