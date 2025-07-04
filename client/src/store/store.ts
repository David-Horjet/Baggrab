import { configureStore } from "@reduxjs/toolkit"
import walletReducer from "./slices/walletSlice"
import gameReducer from "./slices/gameSlice"
import leaderboardReducer from "./slices/leaderboardSlice"
import arenaReducer from "./slices/arenaSlice"

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    game: gameReducer,
    leaderboard: leaderboardReducer,
    arena: arenaReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
