import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import WalletContextProvider from "@/providers/WalletProvider"
import ReduxProvider from "@/providers/ReduxProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bag Grab - Gorbagana Mini Game",
  description: "The trash tide is rising. Grab the bag. Beat your friends. Brag. Repeat.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white overflow-x-hidden`}>
      <ReduxProvider>
        <WalletContextProvider>{children}</WalletContextProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
