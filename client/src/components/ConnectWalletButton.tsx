"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useEffect, useState } from "react"

export default function ConnectWalletButton() {
  const { publicKey, connected, connecting } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatWalletAddress = (address: string) => {
    if (address.length <= 8) return address
    return `${address.slice(0, 4)}...${address.slice(-3)}`
  }

  if (!mounted) {
    return (
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-white animate-pulse text-sm sm:text-base">
        🎒 Loading...
      </div>
    )
  }

  if (connected && publicKey) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
        <div className="bg-emerald-500/20 border border-emerald-500 rounded-lg px-3 sm:px-4 py-1 sm:py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <div className="text-emerald-400 font-mono text-xs sm:text-sm">
            {formatWalletAddress(publicKey.toString())}
          </div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500 rounded-lg px-2 sm:px-3 py-1">
          <span className="text-purple-400 text-xs font-bold">Connected to Gorbagana</span>
        </div>
        <WalletMultiButton
          style={{
            backgroundColor: "#ef4444",
            borderRadius: "0.5rem",
            padding: "0.375rem 0.75rem",
            fontSize: "0.75rem",
            fontWeight: "bold",
            border: "1px solid #dc2626",
          }}
        />
      </div>
    )
  }

  return (
    <WalletMultiButton
      style={{
        background: "linear-gradient(to right, #10b981, #3b82f6)",
        borderRadius: "0.5rem",
        padding: "0.5rem 1rem",
        fontSize: "0.875rem",
        fontWeight: "bold",
        border: "none",
        boxShadow: "0 0 5px currentColor, 0 0 10px currentColor, inset 0 0 5px currentColor",
        animation: "pulseNeon 2s ease-in-out infinite alternate",
        minWidth: "160px",
      }}
    >
      {connecting ? "🔄 Connecting..." : "🎒 Connect Backpack"}
    </WalletMultiButton>
  )
}
