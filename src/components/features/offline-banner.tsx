"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // 1. Initial check
    setIsOffline(!navigator.onLine)

    // 2. Listen for 'online'/'offline'
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] animate-in slide-in-from-top-full duration-500">
      <div className="mx-auto w-full max-w-[420px] px-6 pt-4">
        <div className="bg-blue-600/95 backdrop-blur-md rounded-[2rem] p-4 shadow-2xl border border-white/20 flex items-center gap-4 transition-all duration-300">
           {/* Animated WifiIcon Container */}
           <div className="relative flex items-center justify-center">
              <div className="absolute size-10 rounded-full bg-white/20 animate-pulse blur-lg" />
              <div className="relative size-10 rounded-xl bg-white/95 flex items-center justify-center text-blue-600 shadow-xl">
                 <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                    <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                    <path d="M12 18h.01" />
                 </svg>
              </div>
           </div>
           
           <div className="flex flex-col gap-0.5">
              <p className="text-[14px] font-black text-white leading-tight tracking-tight flex items-center gap-1.5 uppercase tracking-widest">
                 📶 You are offline
              </p>
              <p className="text-[11px] font-bold text-blue-100/80 leading-tight">Data will sync when reconnected.</p>
           </div>
        </div>
      </div>
    </div>
  )
}
