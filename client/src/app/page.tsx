import ConnectWalletButton from "@/components/ConnectWalletButton";
import GameDescriptionBox from "@/components/GameDescriptionBox";
import MiniLeaderboardPreview from "@/components/MiniLeaderboardPreview";
import PlayButton from "@/components/PlayButton";
import WalletStatus from "@/components/WalletStatus";

export default function LandingPage() {
  return (
    <div className="min-h-screen trash-bg relative overflow-hidden">
      {/* Floating trash particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gray-500 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="pixel-font text-2xl md:text-4xl font-black text-emerald-400 neon-glow">💰 BAG GRAB</div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <WalletStatus />
            <ConnectWalletButton />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Left Side - Game Info */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <h1 className="pixel-font text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="text-emerald-400 neon-glow">GRAB</span>{" "}
              <span className="text-blue-400 neon-glow">THE</span>{" "}
              <span className="text-purple-400 neon-glow">BAG</span>
            </h1>

            <GameDescriptionBox />

            <div className="mt-8 space-y-4">
              <PlayButton />
              <p className="text-gray-400 text-sm">🚀 Built on Gorbagana • 🎮 Multiplayer • 💎 Earn Rewards</p>
            </div>
          </div>

          {/* Right Side - Leaderboard Preview */}
          <div className="w-full lg:w-96">
            <MiniLeaderboardPreview />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-8">
          <p>Powered by Gorbagana • Solana Testnet</p>
        </footer>
      </div>
    </div>
  )
}
