"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useMemo } from "react"

export function useWalletAddress() {
  const { publicKey, connected } = useWallet()

  const walletAddress = useMemo(() => {
    if (!connected || !publicKey) return null
    return publicKey.toString()
  }, [connected, publicKey])

  const shortAddress = useMemo(() => {
    if (!walletAddress) return null
    if (walletAddress.length <= 8) return walletAddress
    return `${walletAddress.slice(0, 4)}...${walletAddress.slice(-3)}`
  }, [walletAddress])

  return {
    walletAddress,
    shortAddress,
    connected,
  }
}
