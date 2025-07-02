"use client"

import { useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch } from "@/store/hooks"
import { setWalletConnecting, setWalletConnected, setWalletDisconnected } from "@/store/slices/walletSlice"

export default function WalletSync() {
  const { publicKey, connected, connecting } = useWallet()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setWalletConnecting(connecting))
  }, [connecting, dispatch])

  useEffect(() => {
    if (connected && publicKey) {
      dispatch(
        setWalletConnected({
          address: publicKey.toString(),
          connected: true,
        }),
      )
    } else {
      dispatch(setWalletDisconnected())
    }
  }, [connected, publicKey, dispatch])

  return null // This component only syncs state
}
