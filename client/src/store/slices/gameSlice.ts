import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface GameState {
  currentScore: number
  lives: number
  bagCount: number
  reactionTime: number
  gameStarted: boolean
  gameOver: boolean
  submittingScore: boolean
  submitError: string | null
  lastSubmissionResponse: SubmitScoreResponse | null
}

export interface SubmitScorePayload {
  wallet: string
  score: number
}

export interface SubmitScoreResponse {
  status: "success"
  message: string
  data: {
    score: {
      _id: string
      wallet: string
      score: number
      createdAt: string
    }
    rewardTx: string | null
  }
}

const initialState: GameState = {
  currentScore: 0,
  lives: 3,
  bagCount: 0,
  reactionTime: 0,
  gameStarted: false,
  gameOver: false,
  submittingScore: false,
  submitError: null,
  lastSubmissionResponse: null,
}

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    updateScore: (state, action: PayloadAction<number>) => {
      state.currentScore += action.payload
    },
    updateBagCount: (state) => {
      state.bagCount += 1
    },
    updateLives: (state, action: PayloadAction<number>) => {
      state.lives = Math.max(0, state.lives + action.payload)
    },
    updateReactionTime: (state, action: PayloadAction<number>) => {
      state.reactionTime = action.payload
    },
    setGameStarted: (state, action: PayloadAction<boolean>) => {
      state.gameStarted = action.payload
    },
    setGameOver: (state, action: PayloadAction<boolean>) => {
      state.gameOver = action.payload
    },
    setSubmittingScore: (state, action: PayloadAction<boolean>) => {
      state.submittingScore = action.payload
    },
    setSubmitError: (state, action: PayloadAction<string | null>) => {
      state.submitError = action.payload
    },
    setSubmissionResponse: (state, action: PayloadAction<SubmitScoreResponse | null>) => {
      state.lastSubmissionResponse = action.payload
    },
    resetGame: (state) => {
      state.currentScore = 0
      state.lives = 3
      state.bagCount = 0
      state.reactionTime = 0
      state.gameStarted = false
      state.gameOver = false
      state.submittingScore = false
      state.submitError = null
      state.lastSubmissionResponse = null
    },
  },
})

export const {
  updateScore,
  updateBagCount,
  updateLives,
  updateReactionTime,
  setGameStarted,
  setGameOver,
  setSubmittingScore,
  setSubmitError,
  setSubmissionResponse,
  resetGame,
} = gameSlice.actions

export default gameSlice.reducer
