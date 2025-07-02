interface ScoreBoardHUDProps {
    score: number
    lives: number
    bagCount: number
    reactionTime: number
  }
  
  export default function ScoreBoardHUD({ score, lives, bagCount, reactionTime }: ScoreBoardHUDProps) {
    return (
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          {/* Score */}
          <div className="bg-black/80 border border-emerald-500 rounded-lg px-4 py-2 neon-border">
            <div className="text-emerald-400 font-bold pixel-font">SCORE: {score.toLocaleString()}</div>
          </div>
  
          {/* Lives */}
          <div className="bg-black/80 border border-red-500 rounded-lg px-4 py-2">
            <div className="text-red-400 font-bold pixel-font flex items-center gap-1">
              LIVES:{" "}
              {[...Array(lives)].map((_, i) => (
                <span key={i}>❤️</span>
              ))}
            </div>
          </div>
  
          {/* Bag Count */}
          <div className="bg-black/80 border border-yellow-500 rounded-lg px-4 py-2">
            <div className="text-yellow-400 font-bold pixel-font">BAGS: {bagCount}</div>
          </div>
  
          {/* Reaction Time */}
          <div className="bg-black/80 border border-purple-500 rounded-lg px-4 py-2">
            <div className="text-purple-400 font-bold pixel-font">REACTION: {reactionTime}ms</div>
          </div>
        </div>
      </div>
    )
  }
  