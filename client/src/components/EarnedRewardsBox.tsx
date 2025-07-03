interface EarnedRewardsBoxProps {
  tokensEarned: number
  rewardTx?: string | null
  mode: "solo" | "arena"
}

export default function EarnedRewardsBox({ tokensEarned, rewardTx, mode }: EarnedRewardsBoxProps) {
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

  // Solo mode rewards (existing logic)
  const baseReward = 25
  const performanceBonus = Math.max(0, tokensEarned - baseReward)

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500 rounded-lg p-6 backdrop-blur-sm neon-border">
      <h3 className="pixel-font text-2xl font-bold text-purple-400 mb-6 text-center neon-glow">💎 REWARDS EARNED</h3>

      <div className="text-center mb-6">
        <div className="text-6xl font-black pixel-font text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
          {tokensEarned}
        </div>
        <div className="text-xl text-purple-300 font-bold">GORBAGANA TOKENS</div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <span className="text-purple-300">Base Reward</span>
          <span className="text-purple-400 font-bold">{baseReward} GORB</span>
        </div>

        {performanceBonus > 0 && (
          <div className="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <span className="text-emerald-300">Performance Bonus</span>
            <span className="text-emerald-400 font-bold">{performanceBonus} GORB</span>
          </div>
        )}

        {rewardTx && (
          <div className="flex justify-between items-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <span className="text-yellow-300">Special Reward</span>
            <span className="text-yellow-400 font-bold">🏆 Bonus</span>
          </div>
        )}
      </div>

      {rewardTx && (
        <div className="mt-6 text-center">
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
        <div className="text-sm text-purple-300 mb-1">Total Balance</div>
        <div className="text-2xl font-bold text-purple-400">{(tokensEarned + 150).toLocaleString()} GORB</div>
        <div className="text-xs text-purple-400 mt-1">*Estimated wallet balance</div>
      </div>
    </div>
  )
}
