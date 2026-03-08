"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useHydrationStore } from "@/store"
import { WeeklyChart } from "@/components/features/weekly-chart"
import Link from "next/link"

// ── Reuse the same bottom tab bar as the home page ───────────────────────────
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

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl bg-white py-5 px-2 min-h-[100px] border border-slate-50/50"
      style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
    >
      <p className="text-xl font-extrabold text-blue-600 leading-tight">{value}</p>
      <p className="mt-1 text-[11px] font-medium text-slate-400 text-center uppercase tracking-wide">{label}</p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function StatisticsPage() {
  const router = useRouter()
  const { user, isOnboarded, getTodayHydration, getProgress } = useHydrationStore()
  const todayConsumed = getTodayHydration()
  const progress = getProgress()

  const weeklyData = useMemo(() => {
    if (!user) return []
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const today = new Date()
    const data: { day: string; date: string; total: number; goal: number }[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      let total = 0
      if (i === 0) {
        total = todayConsumed
      } else {
        const seed = (date.getDate() * 37 + date.getMonth() * 17 + user.dailyGoal) % 1200
        total = 1500 + seed
      }
      data.push({ day: days[date.getDay()], date: date.toISOString().split("T")[0], total, goal: user.dailyGoal })
    }
    return data
  }, [todayConsumed, user])

  const weeklyStats = useMemo(() => {
    if (weeklyData.length === 0) return { total: 0, avg: 0, daysMetGoal: 0 }
    const total = weeklyData.reduce((sum, d) => sum + d.total, 0)
    const avg = Math.round(total / 7)
    const daysMetGoal = weeklyData.filter((d) => d.total >= d.goal).length
    return { total, avg, daysMetGoal }
  }, [weeklyData])

  useEffect(() => {
    if (!isOnboarded) router.push("/onboarding")
  }, [isOnboarded, router])

  if (!isOnboarded || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1f3c]">
        <p className="text-white/50 text-sm">Loading SipSense...</p>
      </div>
    )
  }

  const consumedL = (todayConsumed / 1000).toFixed(1)
  const goalL = (user.dailyGoal / 1000).toFixed(1)

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f0f2f5] font-sans">

      {/* ── Background split ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-[#0a1628] to-[#0d1f3c]" style={{ height: "32%" }} />
        <div className="absolute left-0 right-0 overflow-hidden" style={{ top: "calc(32% - 1px)" }}>
          <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" className="block w-full" style={{ height: 50 }} preserveAspectRatio="none">
            <path d="M0,25 C300,65 600,0 900,35 C1100,55 1300,15 1440,30 L1440,70 L0,70 Z" fill="#f0f2f5" />
          </svg>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col pb-20">

        {/* Compact Header */}
        <div className="flex flex-col px-6 pt-12 pb-8" style={{ minHeight: "32%" }}>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Statistics</h1>
          <p className="mt-1 text-sm font-medium text-blue-200/70">Track your weekly hydration trend</p>

          {/* Inline Summary */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-white tracking-tight">{consumedL}L</p>
              <p className="text-sm font-medium text-blue-200/50">/ {goalL}L goal</p>
            </div>

            {/* Smaller ring progress */}
            <div className="relative flex items-center justify-center" style={{ width: 60, height: 60 }}>
              <svg width="60" height="60" viewBox="0 0 60 60" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                <circle
                  cx="30" cy="30" r="24"
                  fill="none" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={2 * Math.PI * 24 - (Math.min(progress, 100) / 100) * 2 * Math.PI * 24}
                  style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
                />
              </svg>
              <span className="absolute text-xs font-black text-white">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Light section */}
        <div className="flex flex-col gap-5 px-5 pt-2">

          {/* Premium Steak Card */}
          <div 
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-400 to-yellow-400 p-6 flex flex-col gap-5 border border-white/20" 
            style={{ boxShadow: "0 10px 40px -10px rgba(251,146,60,0.4), 0 4px 20px rgba(251,146,60,0.2)" }}
          >
             {/* Glossy Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />

             <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-5">
                   {/* Animated Flame Container */}
                   <div className="relative flex items-center justify-center">
                      <div className="absolute size-14 rounded-full bg-white/30 animate-pulse blur-xl" />
                      <div className="relative size-14 rounded-[1.25rem] bg-white/95 flex items-center justify-center text-3xl shadow-xl">
                         🔥
                      </div>
                   </div>
                   
                   <div className="flex flex-col">
                      <p className="text-xl font-black text-white leading-none tracking-tight">3 Day Streak!</p>
                      <p className="text-xs text-orange-950/60 font-bold mt-1.5 uppercase tracking-wider">You're on fire</p>
                   </div>
                </div>

                <span className="text-[10px] font-black text-[#0f172a] bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl uppercase tracking-[0.15em] border border-white/50 shadow-sm">
                   Weekly
                </span>
             </div>

             {/* Progress Bar Container */}
             <div className="relative z-10 flex flex-col gap-2.5">
                <div className="flex items-center justify-between px-1">
                   <p className="text-[10px] font-bold text-orange-950/70 uppercase tracking-widest">Streak Progress</p>
                   <p className="text-[10px] font-black text-white bg-orange-950/20 px-2 py-0.5 rounded-md">3 / 7</p>
                </div>
                <div className="h-2.5 w-full bg-orange-950/10 rounded-full overflow-hidden border border-white/10 p-0.5">
                   <div 
                     className="h-full bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.6)]" 
                     style={{ width: '42%', transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                   />
                </div>
             </div>
          </div>

          {/* Weekly chart card */}
          <div className="rounded-2xl bg-white px-5 py-6" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between mb-6">
              <p className="text-base font-bold text-[#1e293b]">Weekly Trend</p>
              <span
                className="rounded-full px-3 py-1 text-xs font-bold text-blue-600"
                style={{ background: "rgba(59,130,246,0.10)" }}
              >
                {user.dailyGoal} ml Goal
              </span>
            </div>
            <WeeklyChart data={weeklyData} goal={user.dailyGoal} />
          </div>

          {/* Stat cards row — Reduced gap to ensure visibility on all screens while maintaining equal widths */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard value={`${(weeklyStats.total / 1000).toFixed(1)}L`} label="Total" />
            <StatCard value={`${weeklyStats.avg}`} label="Avg ml/day" />
            <StatCard value={`${weeklyStats.daysMetGoal}/7`} label="Goals met" />
          </div>

          {/* Info tip */}
          <div
            className="flex items-start gap-3 rounded-2xl px-4 py-3"
            style={{ background: "rgba(59,130,246,0.07)" }}
          >
            <svg className="mt-0.5 size-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs font-medium text-blue-700/80">
              Consistency is key. Meeting your goal daily improves focus and energy levels.
            </p>
          </div>

        </div>
      </div>

      <BottomTabBar active="/statistics" />
    </div>
  )
}
