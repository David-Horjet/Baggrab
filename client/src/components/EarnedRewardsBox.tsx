interface EarnedRewardsBoxProps {
  tokensEarned: number
  rewardTx?: string | null
  mode: "solo" | "arena"
  score?: number // Add score prop for reward calculation
}

export default function EarnedRewardsBox({ tokensEarned, rewardTx, mode, score = 0 }: EarnedRewardsBoxProps) {
  // Calculate GOR rewards based on score for solo mode
  const calculateGorReward = (score: number): number => {
    if (score >= 70) return 0.001
    if (score >= 50) return 0.0005
    if (score >= 30) return 0.0002
    return 0
  }

  if (mode === "arena") {
    return (
      <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-500 rounded-lg p-6 backdrop-blur-sm neon-border">
        <h3 className="pixel-font text-2xl font-bold text-yellow-400 mb-6 text-center neon-glow">🏟️ ARENA REWARDS</h3>

        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🏆</div>
          <div className="text-xl text-yellow-300 font-bold mb-2">Competition Complete!</div>
          <div className="text-sm text-gray-300">Arena rewards are distributed to top 3 players at season end</div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <span className="text-yellow-300">Entry Fee</span>
            <span className="text-yellow-400 font-bold">1 GOR</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <span className="text-purple-300">Competition Status</span>
            <span className="text-purple-400 font-bold">Submitted</span>
          </div>
        </div>

        {rewardTx && (
          <div className="mt-6 text-center">
            <div className="mb-3 p-2 bg-gray-800/50 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Transaction Signature:</div>
              <div className="text-xs font-mono text-gray-300 break-all">{rewardTx}</div>
            </div>
            <a
              href={`https://explorer.gorbagana.wtf/tx/${rewardTx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 neon-border"
            >
              🔍 View Transaction
            </a>
          </div>
        )}

        <div className="mt-6 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-lg text-center">
          <div className="text-sm text-yellow-300 mb-1">Prize Distribution</div>
          <div className="text-xs text-yellow-400">1st: 60% • 2nd: 30% • 3rd: 10% of total pool</div>
        </div>
      </div>
    )
  }

  // Solo mode rewards with updated GOR logic
  const gorReward = calculateGorReward(score)

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500 rounded-lg p-6 backdrop-blur-sm neon-border">
      <h3 className="pixel-font text-2xl font-bold text-purple-400 mb-6 text-center neon-glow">💎 REWARDS EARNED</h3>

      <div className="text-center mb-6">
        <div className="text-6xl font-black pixel-font text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
          {gorReward > 0 ? `${gorReward}` : "0"}
        </div>
        <div className="text-xl text-purple-300 font-bold">GOR TOKENS</div>
        {gorReward === 0 && <div className="text-sm text-gray-400 mt-2">Score 30+ points to earn rewards</div>}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <span className="text-purple-300">Your Score</span>
          <span className="text-purple-400 font-bold">{score} pts</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <span className="text-emerald-300">GOR Reward</span>
          <span className="text-emerald-400 font-bold">{gorReward > 0 ? `${gorReward} GOR` : "No reward"}</span>
        </div>

        {rewardTx && (
          <div className="flex justify-between items-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <span className="text-yellow-300">Bonus Reward</span>
            <span className="text-yellow-400 font-bold">🏆 Special</span>
          </div>
        )}
      </div>

      {rewardTx && (
        <div className="mt-6 text-center">
          <div className="mb-3 p-2 bg-gray-800/50 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Transaction Signature:</div>
            <div className="text-xs font-mono text-gray-300 break-all">{rewardTx}</div>
          </div>
          <a
            href={`https://explorer.gorbagana.wtf/tx/${rewardTx}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 neon-border"
          >
            🔍 View Transaction
          </a>
        </div>
      )}

      <div className="mt-6 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 rounded-lg text-center">
        <div className="text-sm text-purple-300 mb-1">Reward Tiers</div>
        <div className="text-xs text-purple-400">70+ pts: 0.001 GOR • 50+ pts: 0.0005 GOR • 30+ pts: 0.0002 GOR</div>
      </div>
    </div>
  )
}
