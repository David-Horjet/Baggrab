export default function GameDescriptionBox() {
  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
      <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed mb-4 sm:mb-6">
        <span className="text-emerald-400 font-bold">The trash tide is rising.</span> Grab the bag. Beat your friends.
        Brag. Repeat.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
          <div className="text-xl sm:text-2xl mb-1">💰</div>
          <div className="text-emerald-400 font-bold text-sm sm:text-base">Catch Bags</div>
          <div className="text-xs sm:text-sm text-gray-400">+10 points each</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <div className="text-xl sm:text-2xl mb-1">🗑️</div>
          <div className="text-red-400 font-bold text-sm sm:text-base">Avoid Trash</div>
          <div className="text-xs sm:text-sm text-gray-400">-1 life each</div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
          <div className="text-xl sm:text-2xl mb-1">⚡</div>
          <div className="text-purple-400 font-bold text-sm sm:text-base">React Fast</div>
          <div className="text-xs sm:text-sm text-gray-400">Speed bonus</div>
        </div>
      </div>
    </div>
  )
}
