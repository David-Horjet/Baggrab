import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface LeaderboardEntry {
  _id: string // Wallet address
  highestScore: number
  createdAt: string
}

export interface LeaderboardResponse {
  status: "success"
  data: LeaderboardEntry[]
}

interface LeaderboardState {
  entries: LeaderboardEntry[]
  loading: boolean
  error: string | null
  lastUpdated: number | null
}

const initialState: LeaderboardState = {
  entries: [],
  loading: false,
  error: null,
  lastUpdated: null,
}

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    setLeaderboardLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setLeaderboardEntries: (state, action: PayloadAction<LeaderboardEntry[]>) => {
      state.entries = action.payload
      state.lastUpdated = Date.now()
      state.error = null
    },
    setLeaderboardError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setLeaderboardLoading, setLeaderboardEntries, setLeaderboardError } = leaderboardSlice.actions
export default leaderboardSlice.reducer
