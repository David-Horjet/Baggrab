"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "../store/store"

interface ReduxProviderProps {
  children: React.ReactNode
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>
}
