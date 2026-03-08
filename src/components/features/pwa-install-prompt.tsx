"use client"

import { useState, useEffect } from "react"
import { Smartphone, Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [visits, setVisits] = useState(0)

  useEffect(() => {
    // 1. Track visits in localStorage
    const storedVisits = Number(localStorage.getItem('sipsense-visits') || '0')
    const currentVisits = storedVisits + 1
    localStorage.setItem('sipsense-visits', String(currentVisits))
    setVisits(currentVisits)

    // 2. Listen for 'beforeinstallprompt'
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e)
      
      // If visits >= 2, show our custom prompt
      if (currentVisits >= 2) {
        setIsVisible(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install')
    } else {
      console.log('User dismissed the PWA install')
    }
    
    // We've used the prompt, and can't use it again, so clear it
    setDeferredPrompt(null)
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    // Don't show again in this session
    sessionStorage.setItem('sipsense-install-dismissed', 'true')
  }

  // Check if session dismissed
  useEffect(() => {
    if (sessionStorage.getItem('sipsense-install-dismissed')) {
      setIsVisible(false)
    }
  }, [])

  if (!isVisible || !deferredPrompt) return null

  return (
    <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 w-full max-w-[420px] px-6 z-[60] animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-white rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-blue-50/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="shrink-0 size-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner overflow-hidden">
             <Smartphone className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 overflow-hidden">
             <p className="text-[14px] font-black text-[#0d1f3c] leading-tight flex items-center gap-1.5 whitespace-nowrap">
                📱 Install SipSense
             </p>
             <p className="text-[11px] font-bold text-slate-400 leading-tight truncate">Add SipSense to your home screen</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleInstallClick}
            className="h-10 px-4 rounded-xl !bg-blue-600 !text-white text-[11px] font-[1000] uppercase tracking-wider shadow-lg shadow-blue-100/50 border-none transition-all active:scale-95"
          >
           Install
          </Button>
          <button 
            onClick={handleDismiss}
            className="size-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-300"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
