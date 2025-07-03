"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { useAppSelector, useAppDispatch } from "../store/hooks"
import { setIsJoining, setJoinError, setHasJoined, setCurrentSeasonId } from "../store/slices/arenaSlice"
import { joinArena } from "../services/arenaApi"

interface ArenaJoinModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// Placeholder address - to be replaced with actual arena pool address
const ARENA_POOL_ADDRESS = "Bu49KZzvwoRJ9brbwYeMBUcp8J2yLTt4bgrbdMT37rin" // System Program ID as placeholder

export default function ArenaJoinModal({ isOpen, onClose, onSuccess }: ArenaJoinModalProps) {
  const dispatch = useAppDispatch()
  const { publicKey, signTransaction } = useWallet()
  const { isJoining, joinError } = useAppSelector((state) => state.arena)
  const [transactionStep, setTransactionStep] = useState<"confirm" | "signing" | "submitting">("confirm")
  const { currentSeasonId, seasonEndTime } = useAppSelector((state) => state.arena)

  const handleJoinArena = async () => {
    if (!publicKey || !signTransaction) {
      dispatch(setJoinError("Wallet not properly connected"))
      return
    }

    try {
      dispatch(setIsJoining(true))
      dispatch(setJoinError(null))
      setTransactionStep("signing")

      // Create connection to Gorbagana testnet
      const connection = new Connection("https://rpc.gorbagana.wtf", "confirmed")

      // Create transaction for 1 GOR (assuming 1 GOR = 1 SOL for now)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(ARENA_POOL_ADDRESS),
          lamports: 1 * LAMPORTS_PER_SOL, // 1 GOR entry fee
        }),
      )

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      // Sign transaction
      const signedTransaction = await signTransaction(transaction)

      // Send transaction
      const txSignature = await connection.sendRawTransaction(signedTransaction.serialize())

      // Wait for confirmation
      await connection.confirmTransaction(txSignature, "confirmed")

      setTransactionStep("submitting")

      // Call API to join arena with raw transaction signature
      const response = await joinArena({
        wallet: publicKey.toString(),
        txSignature: txSignature, // Store raw signature without prefixes
      })

      // Update Redux state
      dispatch(setHasJoined(true))
      dispatch(setCurrentSeasonId(response.seasonId))

      // Success - proceed to game
      onSuccess()
    } catch (error) {
      console.error("Arena join error:", error)
      let errorMessage = "Failed to join arena"

      if (error instanceof Error) {
        if (error.message.includes("User rejected")) {
          errorMessage = "Transaction was cancelled by user"
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for entry fee and gas"
        } else {
          errorMessage = error.message
        }
      }

      dispatch(setJoinError(errorMessage))
      setTransactionStep("confirm")
    } finally {
      dispatch(setIsJoining(false))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-yellow-500 rounded-lg max-w-md w-full backdrop-blur-sm neon-border">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="text-center">
            <h2 className="pixel-font text-2xl font-black text-yellow-400 neon-glow mb-2">🏟️ JOIN ARENA</h2>
            <p className="text-gray-300">Enter the competitive arena and compete for GOR rewards</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {transactionStep === "confirm" && (
            <>
              {!currentSeasonId ? (
                <div className="bg-gray-500/20 border border-gray-500 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-gray-400 mb-3 text-center">No Active Season</h3>
                  <p className="text-sm text-gray-300 text-center">
                    There is currently no active arena season. Please check back later when a new season starts.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-yellow-400 mb-3">Entry Requirements:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Entry Fee:</span>
                        <span className="text-yellow-400 font-bold">1 GOR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Network:</span>
                        <span className="text-purple-400 font-bold">Gorbagana Testnet</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Competition:</span>
                        <span className="text-emerald-400 font-bold">Current Season</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-emerald-400 mb-3">Prize Distribution:</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">🏆 1st Place:</span>
                        <span className="text-yellow-400">60% of pool</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">🥈 2nd Place:</span>
                        <span className="text-gray-300">30% of pool</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">🥉 3rd Place:</span>
                        <span className="text-orange-400">10% of pool</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {joinError && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-sm font-bold">❌ {joinError}</p>
                </div>
              )}
            </>
          )}

          {transactionStep === "signing" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Sign Transaction</h3>
              <p className="text-gray-300 text-sm">
                Please sign the transaction in your wallet to pay the 1 GOR entry fee
              </p>
            </div>
          )}

          {transactionStep === "submitting" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-emerald-400 mb-2">Joining Arena</h3>
              <p className="text-gray-300 text-sm">Transaction confirmed! Registering you for the current season...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          {transactionStep === "confirm" && (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isJoining}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-lg font-bold transition-all duration-200 disabled:opacity-50"
              >
                {!currentSeasonId ? "Go Back" : "Cancel"}
              </button>
              {currentSeasonId && (
                <button
                  onClick={handleJoinArena}
                  disabled={isJoining}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-4 py-3 rounded-lg font-bold transition-all duration-200 neon-border disabled:opacity-50"
                >
                  {isJoining ? "🔄 Joining..." : "💰 Pay 1 GOR & Join"}
                </button>
              )}
            </div>
          )}

          {(transactionStep === "signing" || transactionStep === "submitting") && (
            <div className="text-center">
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
