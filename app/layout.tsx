
// ✅ File: app/layout.tsx
'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/HeaderSwitcher'
import Footer from '@/components/Footer'
import '@/styles/globals.css'

import ClickSplashEffect from "@/components/ClickSplashEffect";


const Providers = dynamic(() => import('./providers'), { ssr: false })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#1e1b4b] text-yellow-200 font-pixel">
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster position="top-center" />
        </Providers>
        <ClickSplashEffect />
      </body>
    </html>
  )
}