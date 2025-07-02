"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletAddress } from "../hooks/useWalletAddress"

export default function WalletStatus() {
  const { connecting } = useWallet()
  const { connected, shortAddress } = useWalletAddress()

  if (connecting) {
    return (
      <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500 rounded-lg px-3 py-1">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-spin"></div>
        <span className="text-yellow-400 text-xs font-bold">Connecting...</span>
      </div>
    )
  }

  if (!connected) {
    return (
      <div className="flex items-center gap-2 bg-red-500/20 border border-red-500 rounded-lg px-3 py-1">
        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        <span className="text-red-400 text-xs font-bold">Not Connected</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="bg-emerald-500/20 border border-emerald-500 rounded-lg px-3 py-1 flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        <span className="text-emerald-400 text-xs font-mono font-bold">{shortAddress}</span>
      </div>
      <div className="bg-purple-500/20 border border-purple-500 rounded-lg px-2 py-1">
        <span className="text-purple-400 text-xs font-bold">Gorbagana</span>
      </div>
    </div>
  )
}
