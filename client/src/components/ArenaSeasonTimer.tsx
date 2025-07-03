"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "../store/hooks"

export default function ArenaSeasonTimer() {
  const { seasonEndTime, mode } = useAppSelector((state) => state.arena)
  const [timeLeft, setTimeLeft] = useState("")
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (mode !== "arena" || !seasonEndTime) return

    const updateTimer = () => {
      const now = new Date().getTime()
      const endTime = new Date(seasonEndTime).getTime()
      const difference = endTime - now

      if (difference <= 0) {
        setTimeLeft("00:00:00")
        setIsExpired(true)
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      )
      setIsExpired(false)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [seasonEndTime, mode])

  if (mode !== "arena" || !seasonEndTime) return null

  return (
    <div
      className={`border rounded-lg px-3 sm:px-4 py-2 backdrop-blur-sm transition-all duration-300 ${
        isExpired
          ? "bg-red-900/80 border-red-500"
          : timeLeft.startsWith("00:") && Number.parseInt(timeLeft.split(":")[1]) < 10
            ? "bg-orange-900/80 border-orange-500 animate-pulse"
            : "bg-purple-900/80 border-purple-500"
      }`}
    >
      <div className="text-center">
        <div className="text-white text-xs sm:text-sm font-bold pixel-font">
          {isExpired ? "⏰ SEASON ENDED" : "⏰ SEASON ENDS IN"}
        </div>
        <div
          className={`text-lg sm:text-xl font-black pixel-font ${
            isExpired
              ? "text-red-400"
              : timeLeft.startsWith("00:") && Number.parseInt(timeLeft.split(":")[1]) < 10
                ? "text-orange-400"
                : "text-purple-400"
          }`}
        >
          {timeLeft}
        </div>
      </div>
    </div>
  )
}
