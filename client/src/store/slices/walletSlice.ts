import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface WalletState {
  address: string | null
  connected: boolean
  connecting: boolean
}

const initialState: WalletState = {
  address: null,
  connected: false,
  connecting: false,
}

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletConnecting: (state, action: PayloadAction<boolean>) => {
      state.connecting = action.payload
    },
    setWalletConnected: (state, action: PayloadAction<{ address: string; connected: boolean }>) => {
      state.address = action.payload.address
      state.connected = action.payload.connected
      state.connecting = false
    },
    setWalletDisconnected: (state) => {
      state.address = null
      state.connected = false
      state.connecting = false
    },
  },
})

export const { setWalletConnecting, setWalletConnected, setWalletDisconnected } = walletSlice.actions
export default walletSlice.reducer
