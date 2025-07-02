"use client"

interface ShareToXButtonProps {
  score: number
  rank: number
}

export default function ShareToXButton({ score, rank }: ShareToXButtonProps) {
  const handleShare = () => {
    const text = `Just secured the bag in Bag Grab! 💰\n\nScore: ${score.toLocaleString()}\nRank: #${rank}\n\nThink you can beat me? 🎯\n\n#BagGrab #Solana #GameFi #Gorbagana`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  return (
    <button
      onClick={handleShare}
      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 neon-border"
    >
      🐦 Share on X
    </button>
  )
}
