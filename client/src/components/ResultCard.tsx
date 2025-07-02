interface GameResults {
  score: number
  bagsCaught: number
  trashHit: number
  timeSurvived: number
  tokensEarned: number
  rank: number
  rewardTx?: string | null
}

interface ResultCardProps {
  results: GameResults
}

export default function ResultCard({ results }: ResultCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const accuracy =
    results.bagsCaught + results.trashHit > 0
      ? Math.round((results.bagsCaught / (results.bagsCaught + results.trashHit)) * 100)
      : 100

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="pixel-font text-2xl font-bold text-emerald-400 mb-6 text-center neon-glow">📊 GAME STATS</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <span className="text-emerald-400 font-bold">Final Score</span>
          <span className="text-2xl font-black text-emerald-400">{results.score.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <span className="text-yellow-400 font-bold">💰 Bags Caught</span>
          <span className="text-xl font-bold text-yellow-400">{results.bagsCaught}</span>
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
          <span className="text-purple-400 font-bold">🎯 Rank</span>
          <span className="text-xl font-bold text-purple-400">#{results.rank}</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="text-sm text-gray-400 mb-2">Accuracy Rate</div>
        <div className="text-3xl font-black text-purple-400">{accuracy}%</div>
      </div>
    </div>
  )
}
