interface ScoreBoardHUDProps {
  score: number
  lives: number
  bagCount: number
  reactionTime: number
}

export default function ScoreBoardHUD({ score, lives, bagCount, reactionTime }: ScoreBoardHUDProps) {
  return (
    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {/* Score */}
        <div className="bg-black/80 border border-emerald-500 rounded-lg px-2 sm:px-4 py-1 sm:py-2 neon-border">
          <div className="text-emerald-400 font-bold pixel-font text-xs sm:text-sm lg:text-base">
            SCORE: {score.toLocaleString()}
          </div>
        </div>

        {/* Lives */}
        <div className="bg-black/80 border border-red-500 rounded-lg px-2 sm:px-4 py-1 sm:py-2">
          <div className="text-red-400 font-bold pixel-font flex items-center gap-1 text-xs sm:text-sm lg:text-base">
            LIVES:{" "}
            {[...Array(lives)].map((_, i) => (
              <span key={i} className="text-xs sm:text-sm">
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Bag Count */}
        <div className="bg-black/80 border border-yellow-500 rounded-lg px-2 sm:px-4 py-1 sm:py-2">
          <div className="text-yellow-400 font-bold pixel-font text-xs sm:text-sm lg:text-base">BAGS: {bagCount}</div>
        </div>

        {/* Reaction Time */}
        <div className="bg-black/80 border border-purple-500 rounded-lg px-2 sm:px-4 py-1 sm:py-2">
          <div className="text-purple-400 font-bold pixel-font text-xs sm:text-sm lg:text-base">
            REACTION: {reactionTime}ms
          </div>
        </div>
      </div>
    </div>
  )
}
