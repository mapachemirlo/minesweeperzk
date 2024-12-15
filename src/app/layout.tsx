'use client';

import { Press_Start_2P } from 'next/font/google'
import './globals.css'
import { Web3Provider } from './context/Web3Context'

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={pressStart2P.className}>
      <head>
        <link rel="icon" href="/ZKgato.png" />
        <title>Minesweeperzk</title>
      </head>
      <body>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  )
}