"use client"

import LeaderboardDisplay from "./LeaderboardDisplay"

interface Player {
  rank: number
  username: string
  score: number
  avatar: string
}

export default function MiniLeaderboardPreview() {
  return <LeaderboardDisplay />
}
