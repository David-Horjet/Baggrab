"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useAppSelector } from "../store/hooks"
import Link from "next/link"

export default function PlayButton() {
  const { connected } = useWallet()
  const { mode } = useAppSelector((state) => state.arena)

  const getButtonText = () => {
    if (mode === "arena" && !connected) {
      return "🔒 CONNECT WALLET FOR ARENA"
    }
    if (mode === "arena") {
      return "🏟️ ENTER ARENA"
    }
    return "🎮 PLAY SOLO"
  }

  const getButtonStyle = () => {
    if (mode === "arena" && !connected) {
      return "bg-gray-600 cursor-not-allowed opacity-50"
    }
    if (mode === "arena") {
      return "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 pulse-neon"
    }
    return "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 pulse-neon"
  }

  const isDisabled = mode === "arena" && !connected
  const href = isDisabled ? "#" : `/game?mode=${mode}`

  if (isDisabled) {
    return (
      <button
        disabled
        className={`w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 rounded-lg font-black text-lg sm:text-xl md:text-2xl lg:text-3xl text-white transition-all duration-200 neon-border pixel-font ${getButtonStyle()}`}
      >
        {getButtonText()}
      </button>
    )
  }

  return (
    <Link
      href={href}
      className={`inline-block w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 rounded-lg font-black text-lg sm:text-xl md:text-2xl lg:text-3xl text-white transition-all duration-200 neon-border pixel-font transform hover:scale-105 text-center ${getButtonStyle()}`}
    >
      {getButtonText()}
    </Link>
  )
}
