interface TimerOverlayProps {
    timeLeft: number
  }
  
  export default function TimerOverlay({ timeLeft }: TimerOverlayProps) {
    if (timeLeft <= 0) return null
  
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="text-center">
          <h2 className="pixel-font text-4xl font-bold text-white mb-8">Game starting in...</h2>
          <div className="text-8xl font-black pixel-font text-emerald-400 neon-glow pulse-neon">{timeLeft}</div>
          <p className="text-xl text-gray-300 mt-8">Get ready to grab those bags! 💰</p>
        </div>
      </div>
    )
  }
  