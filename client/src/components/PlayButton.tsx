"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

export default function PlayButton() {
  const { connected } = useWallet();

  const handlePlay = () => {
    if (!connected) {
      alert("Please connect your Backpack wallet first!");
      return;
    }
    window.location.href = "/game";
  };

  return (
    <button
      // onClick={handlePlay}
      disabled={!connected}
      className={`w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 rounded-lg font-black text-lg sm:text-xl md:text-2xl lg:text-3xl text-white transition-all duration-200 neon-border pixel-font transform hover:scale-105 ${
        connected
          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 pulse-neon"
          : "bg-gray-600 cursor-not-allowed opacity-50"
      }`}
    >
      <Link href={"/game"}>
        {connected ? "🎮 PLAY NOW" : "🔒 CONNECT WALLET TO PLAY"}
      </Link>
    </button>
  );
}
