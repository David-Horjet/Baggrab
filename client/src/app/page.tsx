import ArenaLeaderboardPreview from "@/components/ArenaLeaderboardPreview";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import GameDescriptionBox from "@/components/GameDescriptionBox";
import MiniLeaderboardPreview from "@/components/MiniLeaderboardPreview";
import ModeSelector from "@/components/ModeSelector";
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
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-gray-500 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
          <div className="pixel-font text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-emerald-400 neon-glow text-center sm:text-left">
            💰 BAG GRAB
          </div>
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex justify-center sm:justify-start">
              <WalletStatus />
            </div>
            <div className="flex justify-center sm:justify-start">
              <ConnectWalletButton />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-6 sm:gap-8 lg:gap-16">
          {/* Left Side - Game Info */}
          <div className="flex-1 max-w-2xl text-center lg:text-left order-2 lg:order-1">
            <h1 className="pixel-font text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 leading-tight">
              <span className="text-emerald-400 neon-glow block sm:inline">GRAB</span>{" "}
              <span className="text-blue-400 neon-glow block sm:inline">THE</span>{" "}
              <span className="text-purple-400 neon-glow block sm:inline">BAG</span>
            </h1>

            <div className="mb-6 sm:mb-8">
              <GameDescriptionBox />
            </div>

            {/* Mode Selector */}
            <ModeSelector />

            <div className="space-y-4 sm:space-y-6">
              <PlayButton />
              <p className="text-gray-400 text-xs sm:text-sm px-4 sm:px-0">
                🚀 Built on Gorbagana • 🏟️ Arena Mode • 💎 Earn GOR Rewards
              </p>
            </div>
          </div>

          {/* Right Side - Leaderboard Preview */}
          <div className="w-full max-w-sm sm:max-w-md lg:w-96 order-1 lg:order-2 space-y-6">
            <MiniLeaderboardPreview />
            <ArenaLeaderboardPreview />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8 pb-4">
          <p>Powered by Gorbagana • Solana Testnet</p>
        </footer>
      </div>
    </div>
  )
}
