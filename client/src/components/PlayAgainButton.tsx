"use client"

interface PlayAgainButtonProps {
  onPlayAgain: () => void
}

export default function PlayAgainButton({ onPlayAgain }: PlayAgainButtonProps) {
  return (
    <button
      onClick={onPlayAgain}
      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 neon-border transform hover:scale-105"
    >
      🎮 Play Again
    </button>
  )
}
