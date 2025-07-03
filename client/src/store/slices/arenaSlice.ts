import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface ArenaPlayer {
  _id: string // wallet address
  score: number
}

export interface ArenaState {
  mode: "solo" | "arena"
  currentSeasonId: string | null
  seasonStartTime: string | null
  seasonEndTime: string | null
  leaderboard: ArenaPlayer[]
  hasJoined: boolean
  isJoining: boolean
  joinError: string | null
  isSubmittingScore: boolean
  submitScoreError: string | null
  isLoadingLeaderboard: boolean
  leaderboardError: string | null
  lastSubmissionTx: string | null
  playerCount: number
  totalPool: number
  isLoadingStatus: boolean
  statusError: string | null
  winners: Array<{
    wallet: string
    position: number
    score: number
    reward: number
  }>
  showWinnersModal: boolean
}

const initialState: ArenaState = {
  mode: "solo",
  currentSeasonId: null,
  seasonStartTime: null,
  seasonEndTime: null,
  leaderboard: [],
  hasJoined: false,
  isJoining: false,
  joinError: null,
  isSubmittingScore: false,
  submitScoreError: null,
  isLoadingLeaderboard: false,
  leaderboardError: null,
  lastSubmissionTx: null,
  playerCount: 0,
  totalPool: 0,
  isLoadingStatus: false,
  statusError: null,
  winners: [],
  showWinnersModal: false,
}

const arenaSlice = createSlice({
  name: "arena",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<"solo" | "arena">) => {
      state.mode = action.payload
    },
    setCurrentSeasonId: (state, action: PayloadAction<string | null>) => {
      state.currentSeasonId = action.payload
    },
    setSeasonStartTime: (state, action: PayloadAction<string | null>) => {
      state.seasonStartTime = action.payload
    },
    setSeasonEndTime: (state, action: PayloadAction<string | null>) => {
      state.seasonEndTime = action.payload
    },
    setHasJoined: (state, action: PayloadAction<boolean>) => {
      state.hasJoined = action.payload
    },
    setIsJoining: (state, action: PayloadAction<boolean>) => {
      state.isJoining = action.payload
    },
    setJoinError: (state, action: PayloadAction<string | null>) => {
      state.joinError = action.payload
    },
    setIsSubmittingScore: (state, action: PayloadAction<boolean>) => {
      state.isSubmittingScore = action.payload
    },
    setSubmitScoreError: (state, action: PayloadAction<string | null>) => {
      state.submitScoreError = action.payload
    },
    setIsLoadingLeaderboard: (state, action: PayloadAction<boolean>) => {
      state.isLoadingLeaderboard = action.payload
    },
    setLeaderboard: (state, action: PayloadAction<ArenaPlayer[]>) => {
      state.leaderboard = action.payload
      state.leaderboardError = null
    },
    setLeaderboardError: (state, action: PayloadAction<string>) => {
      state.leaderboardError = action.payload
    },
    setLastSubmissionTx: (state, action: PayloadAction<string>) => {
      state.lastSubmissionTx = action.payload
    },
    setPlayerCount: (state, action: PayloadAction<number>) => {
      state.playerCount = action.payload
    },
    setTotalPool: (state, action: PayloadAction<number>) => {
      state.totalPool = action.payload
    },
    setIsLoadingStatus: (state, action: PayloadAction<boolean>) => {
      state.isLoadingStatus = action.payload
    },
    setStatusError: (state, action: PayloadAction<string | null>) => {
      state.statusError = action.payload
    },
    resetArena: (state) => {
      state.hasJoined = false
      state.isJoining = false
      state.joinError = null
      state.isSubmittingScore = false
      state.submitScoreError = null
      state.lastSubmissionTx = null
      state.leaderboard = []
      state.currentSeasonId = null
      state.seasonStartTime = null
      state.seasonEndTime = null
      state.playerCount = 0
      state.totalPool = 0
    },
    setWinners: (
      state,
      action: PayloadAction<
        Array<{
          wallet: string
          position: number
          score: number
          reward: number
        }>
      >,
    ) => {
      state.winners = action.payload
    },
    setShowWinnersModal: (state, action: PayloadAction<boolean>) => {
      state.showWinnersModal = action.payload
    },
  },
})

export const {
  setMode,
  setCurrentSeasonId,
  setSeasonStartTime,
  setSeasonEndTime,
  setHasJoined,
  setIsJoining,
  setJoinError,
  setIsSubmittingScore,
  setSubmitScoreError,
  setIsLoadingLeaderboard,
  setLeaderboard,
  setLeaderboardError,
  setLastSubmissionTx,
  setPlayerCount,
  setTotalPool,
  setIsLoadingStatus,
  setStatusError,
  resetArena,
  setWinners,
  setShowWinnersModal,
} = arenaSlice.actions

export default arenaSlice.reducer
