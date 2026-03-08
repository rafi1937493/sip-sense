"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useHydrationStore } from "@/store"
import { AddDrinkSheet } from "@/components/features/add-drink-sheet"
import { DrinkHistoryList } from "@/components/features/drink-history-list"
import { calculateHydration, getHydrationMessage, QUICK_DRINKS, type DrinkType } from "@/types"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ── 3D Sphere with SVG progress ring ──────────────────────────────────────────
function HydrationSphere({ progress }: { progress: number }) {
  // Container: 260px, ring radius: 118px, sphere: 200px
  // This creates a perfect ~10px gap between the sphere and the progress ring
  const size = 260
  const cx = size / 2
  const cy = size / 2
  const radius = 118
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (Math.min(progress, 100) / 100) * circumference
  const sphereSize = 200

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      {/* ── Proper SVG Circular Progress Ring ── */}
      <svg
        className="absolute inset-0 z-10"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Background Track - Light Gray */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Arc - Vibrant Blue */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>

      {/* ── Central 3D Sphere ── */}
      <div className="relative z-0" style={{ width: sphereSize, height: sphereSize }}>
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 32%, #93c5fd 0%, #60a5fa 22%, #3b82f6 52%, #1d4ed8 76%, #1e3a8a 100%)",
            boxShadow: "0 0 100px 32px rgba(59,130,246,0.35), 0 24px 60px rgba(0,0,0,0.5)",
            animationDuration: "3s",
          }}
        />
        {/* Specular Highlights */}
        <div className="absolute" style={{ borderRadius: "50%", top: "14%", left: "20%", width: "28%", height: "20%", background: "white", opacity: 0.70, filter: "blur(4px)" }} />
        <div className="absolute" style={{ borderRadius: "50%", top: "8%", left: "12%", width: "50%", height: "36%", background: "white", opacity: 0.15, filter: "blur(9px)" }} />
      </div>
    </div>
  )
}

// ── iOS-style icon container ──────────────────────────────────────────────────
function DrinkIcon({ emoji, label, onClick }: { emoji: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 active:scale-95 transition-all duration-200"
    >
      <div
        className="flex items-center justify-center rounded-2xl bg-white shadow-md"
        style={{ width: 58, height: 58, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
      >
        <span style={{ fontSize: 28 }}>{emoji}</span>
      </div>
      <span className="text-xs font-semibold text-slate-600 text-center leading-tight">{label}</span>
    </button>
  )
}

// ── Bottom Navigation ─────────────────────────────────────────────────────────
function BottomTabBar({ active }: { active: string }) {
  const tabs = [
    {
      href: "/",
      label: "Home",
      activeIcon: (
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      icon: (
        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      href: "/statistics",
      label: "Stats",
      activeIcon: (
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h2v18H3V3zm4 8h2v10H7V11zm4-4h2v14h-2V7zm4 6h2v8h-2v-8zm4-10h2v18h-2V3z" />
        </svg>
      ),
      icon: (
        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      href: "/settings",
      label: "Settings",
      activeIcon: (
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      icon: (
        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4">
      <div
        className="flex w-full max-w-[420px] items-center justify-around rounded-2xl px-2 py-2"
        style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)", boxShadow: "0 -2px 30px rgba(0,0,0,0.08), 0 4px 24px rgba(0,0,0,0.06)" }}
      >
        {tabs.map((tab) => {
          const isActive = active === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all duration-200 ${isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              {isActive && (tab as any).activeIcon ? (tab as any).activeIcon : tab.icon}
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? "text-blue-600" : "text-slate-400"}`}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { 
    user, 
    todayLogs, 
    isOnboarded, 
    addDrinkLog, 
    removeDrinkLog, 
    getTodayHydration, 
    getProgress, 
    getRemaining,
    fetchInitialData,
    isLoading,
    error,
    success 
  } = useHydrationStore()

  useEffect(() => {
    setMounted(true)
    if (!isOnboarded) {
      router.push("/onboarding")
    } else {
      fetchInitialData()
    }
  }, [isOnboarded, router, fetchInitialData])

  if (!isOnboarded || !user || (isLoading && !mounted)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1f3c]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
          <p className="text-white/50 text-sm font-medium">Syncing with Supabase...</p>
        </div>
      </div>
    )
  }

  const consumed = getTodayHydration()
  const goal = user.dailyGoal
  const progress = getProgress()
  const remaining = getRemaining()
  const consumedL = (consumed / 1000).toFixed(1)
  const goalL = (goal / 1000).toFixed(1)

  const handleQuickAdd = (drinkType: DrinkType) => {
    const quickDrink = QUICK_DRINKS.find((d) => d.type === drinkType)
    const quantityMl = quickDrink?.defaultMl || 250
    const hydrationAmount = calculateHydration(quantityMl, drinkType)
    const icon = quickDrink?.icon || "💧"
    addDrinkLog({ id: crypto.randomUUID(), drinkType, quantityMl, hydrationAmount, icon, createdAt: new Date() })
  }

  const handleAddDrink = (drinkType: string, quantityMl: number, factor?: number, icon?: string) => {
    const hydrationAmount = factor 
      ? Math.round(quantityMl * factor)
      : calculateHydration(quantityMl, drinkType as any)
    addDrinkLog({ id: crypto.randomUUID(), drinkType, quantityMl, hydrationAmount, icon, createdAt: new Date() })
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f0f2f5] font-sans">

      {/* ── Toast Notifications ── */}
      {(error || success) && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={cn(
            "px-6 py-3 rounded-full shadow-lg flex items-center gap-3 min-w-[200px] justify-between",
            error ? "bg-red-500 text-white" : "bg-blue-600 text-white"
          )}>
            <span className="text-sm font-bold tracking-tight">
              {error || success}
            </span>
            <button 
              onClick={() => useHydrationStore.setState({ error: null, success: null })} 
              className="size-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <span className="text-[10px]">✕</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Background split ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-[#0a1628] to-[#0d1f3c]" style={{ height: "55%" }} />
        {/* Wave */}
        <div className="absolute left-0 right-0 overflow-hidden" style={{ top: "calc(55% - 1px)" }}>
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="block w-full" style={{ height: 70 }} preserveAspectRatio="none">
            <path d="M0,30 C300,80 600,0 900,40 C1100,65 1300,20 1440,35 L1440,80 L0,80 Z" fill="#f0f2f5" />
          </svg>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="relative z-10 flex flex-col pb-28 min-h-screen">

        {/* ── Header ── */}
        <div className="flex items-center px-6 pt-14 pb-2">
          <h1 className="text-xl font-extrabold text-white tracking-tight">Sip Sense</h1>
        </div>

        {/* ── Sphere + water amount + % pill ── */}
        <div className="flex flex-col items-center pt-4 pb-2">
          <HydrationSphere progress={progress} />
          <div className="mt-3 text-center">
            <div className="text-3xl font-extrabold text-white">
              {consumedL}L <span className="text-lg font-medium text-white/50">/ {goalL}L</span>
            </div>
            {/* % pill moved here, below the water amount */}
            <div
              className="mt-2 inline-flex items-center justify-center rounded-full px-4 py-1 text-sm font-bold"
              style={{ background: "rgba(255,255,255,0.10)", color: progress >= 100 ? "#4ade80" : "#93c5fd" }}
            >
              {progress}% complete
            </div>
          </div>
        </div>

        {/* ── Light section content ── */}
        <div
          className={`flex flex-col gap-4 px-5 pt-14 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >

          {/* Motivation card */}
          <div className="rounded-2xl bg-white px-5 py-4" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <p className="text-base font-semibold text-[#1e293b]">{getHydrationMessage(progress)}</p>
            <p className="mt-1 text-sm text-slate-500">
              {remaining > 0 ? `${remaining} ml remaining to reach your goal` : `🎉 You've hit your daily goal!`}
            </p>
          </div>

          {/* Quick Add Drink */}
          <div className="rounded-2xl bg-white px-5" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", paddingTop: 16, paddingBottom: 20 }}>
            <div className="flex items-center justify-between mb-0">
              <div>
                <p className="text-base font-bold text-[#1e293b]">Quick Add Drink</p>
                <p className="text-sm text-slate-500">{consumed} ml logged today</p>
              </div>
              <button
                onClick={() => setIsSheetOpen(true)}
                className="flex size-11 items-center justify-center rounded-full text-white active:scale-95 transition-all"
                style={{ background: "#3b82f6", boxShadow: "0 4px 18px rgba(59,130,246,0.50)" }}
                aria-label="Add custom drink"
              >
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Drink icons row — forced 24px gap with inline marginTop */}
            <div className="grid grid-cols-4 gap-3" style={{ marginTop: 24 }}>
              {QUICK_DRINKS.map((drink) => (
                <button
                  key={drink.type}
                  onClick={() => handleQuickAdd(drink.type)}
                  className="flex flex-col items-center gap-2 active:scale-95 transition-all duration-150"
                >
                  <div
                    className="flex items-center justify-center rounded-2xl bg-white p-3.5"
                    style={{ width: 68, height: 68, boxShadow: "0 4px 18px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)" }}
                  >
                    <span style={{ fontSize: 30 }}>{drink.icon}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 leading-tight text-center">
                    {drink.type.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Today's Drinks */}
          <div>
            <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-slate-300 px-1">Today&apos;s Drinks</p>
            <div className="rounded-[2rem] bg-white overflow-hidden border-2 border-dashed border-slate-200/60" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.04)" }}>
              {todayLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center px-10 gap-5">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-100/40 blur-2xl rounded-full scale-110" />
                    <span className="relative text-5xl leading-none select-none">💧</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-bold text-slate-700">No drinks logged yet.</p>
                    <p className="text-[13px] font-normal text-[#9ca3af] tracking-tight">Tap a drink above to get started!</p>
                  </div>
                </div>
              ) : (
                <DrinkHistoryList
                  logs={todayLogs}
                  onDelete={(id) => removeDrinkLog(id)}
                  onEdit={(log) => console.log("Edit", log)}
                />
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <BottomTabBar active="/" />

      {/* ── Add Drink Sheet ── */}
      <AddDrinkSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} onAddDrink={handleAddDrink} />
    </div>
  )
}
