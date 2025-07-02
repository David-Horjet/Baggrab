"use client"

import type React from "react"
import { useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"

interface WalletContextProviderProps {
  children: React.ReactNode
}

export default function WalletContextProvider({ children }: WalletContextProviderProps) {
  // Gorbagana testnet RPC endpoint
  const endpoint = "https://rpc.gorbagana.wtf"

  // Only support Backpack wallet
  const wallets = useMemo(() => [new BackpackWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
